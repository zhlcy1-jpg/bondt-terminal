
import React, { useState, useEffect, useCallback } from 'react';
import { Bond, MarketRate, NewsItem } from './types';
import { INITIAL_WATCHLIST, INITIAL_RATES, INITIAL_NEWS } from './constants';
import MarketTicker from './components/MarketTicker';
import WatchlistTable from './components/WatchlistTable';
import AnalysisPanel from './components/AnalysisPanel';
import NewsFeed from './components/NewsFeed';
import { gemini } from './services/geminiService';

const App: React.FC = () => {
  const [watchlist, setWatchlist] = useState<Bond[]>(INITIAL_WATCHLIST);
  const [rates, setRates] = useState<MarketRate[]>(INITIAL_RATES);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [macroStrategy, setMacroStrategy] = useState<string>('正在分析全球市場數據...');
  const [bondInsight, setBondInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [markup, setMarkup] = useState<number>(0);

  useEffect(() => {
    if (selectedBond) {
      const fetchInsight = async () => {
        setLoadingInsight(true);
        const insight = await gemini.getTraderInsight(selectedBond);
        setBondInsight(insight);
        setLoadingInsight(false);
      };
      fetchInsight();

      const fetchIssuerNews = async () => {
        const issuerNews = await gemini.getIssuerNews(selectedBond.issuer, selectedBond.guarantor);
        if (issuerNews.length > 0) {
          setNews([...issuerNews, ...INITIAL_NEWS]);
        }
      };
      fetchIssuerNews();
    } else {
      setBondInsight('');
    }
  }, [selectedBond]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWatchlist(prev => prev.map(bond => ({
        ...bond,
        price: bond.price + (Math.random() - 0.5) * 0.05,
        yield: bond.yield + (Math.random() - 0.5) * 0.005,
        yieldChangeBps: bond.yieldChangeBps + (Math.random() - 0.5) * 0.5
      })));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMacro = async () => {
      const strategy = await gemini.getMacroSummary(INITIAL_NEWS);
      setMacroStrategy(strategy);
    };
    fetchMacro();
  }, []);

  const handleSelectBond = useCallback((bond: Bond) => {
    setSelectedBond(bond);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-200 antialiased selection:bg-blue-500/30">
      <header className="h-14 flex items-center justify-between px-6 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <h1 className="text-lg font-extrabold tracking-tighter text-white uppercase">BondTerminal<span className="text-blue-500 font-medium">PRO</span></h1>
        </div>
        
        <div className="hidden md:flex flex-1 mx-12 px-5 py-2 bg-white/[0.03] rounded-sm border border-white/5 items-center space-x-4 max-w-3xl overflow-hidden">
          <div className="flex items-center space-x-2 shrink-0">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em]">AI 宏觀分析</span>
          </div>
          <span className="text-xs text-slate-400 truncate font-medium">{macroStrategy}</span>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right flex flex-col justify-center">
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-0.5">數據狀態</span>
            <div className="flex items-center space-x-1.5 justify-end">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              <span className="text-[10px] font-bold text-emerald-500/80 mono uppercase tracking-widest">LIVE</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-sm border border-white/10 overflow-hidden bg-slate-800 grayscale">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=trader1" alt="avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <MarketTicker rates={rates} />

      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-5 overflow-hidden space-y-5">
          <section className="flex flex-col flex-1 min-h-0 bg-slate-900/40 rounded-sm border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-baseline space-x-3">
                <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest">債券名單 <span className="text-slate-500 font-medium">Bond Watchlist</span></h2>
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                   活躍券種: {watchlist.length}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-white/[0.03] rounded-sm border border-white/10">
                   <label htmlFor="markup-select" className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">報價加價</label>
                   <select 
                      id="markup-select"
                      className="bg-transparent text-blue-400 text-[10px] font-bold outline-none border-none cursor-pointer mono"
                      value={markup}
                      onChange={(e) => setMarkup(parseFloat(e.target.value))}
                   >
                      {[0, 0.5, 1, 1.5, 2, 2.5, 3].map(val => (
                        <option key={val} value={val} className="bg-slate-900 text-slate-100">{val.toFixed(1)} pt</option>
                      ))}
                   </select>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <WatchlistTable 
                bonds={watchlist} 
                onSelect={handleSelectBond} 
                selectedId={selectedBond?.id}
                markup={markup}
              />
            </div>
          </section>

          <section className="h-60 bg-slate-900/60 border border-white/5 rounded-sm p-6 flex flex-col relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-[2px] h-full bg-blue-500"></div>
             
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-sm tracking-widest uppercase">AI Insight</div>
                  <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                    智能深度分析報告
                  </h3>
                </div>
               
               {loadingInsight && (
                 <div className="flex space-x-1.5 items-center">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                 </div>
               )}
             </div>

             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {selectedBond ? (
                  <div className="text-[13px] text-slate-300 leading-relaxed font-medium tracking-wide">
                    {loadingInsight ? (
                       <div className="space-y-3 pt-1">
                          <div className="h-2.5 bg-white/[0.03] rounded-full w-full animate-pulse"></div>
                          <div className="h-2.5 bg-white/[0.03] rounded-full w-[94%] animate-pulse"></div>
                       </div>
                    ) : (
                      <div className="pl-4 border-l border-white/10 text-slate-200 whitespace-pre-line not-italic font-normal">
                        {bondInsight || "正在處理多維信用數據並生成報告..."}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 font-sans">請從上方名單選擇證券以生成智能分析報告</p>
                  </div>
                )}
             </div>
             
             <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-slate-700">
                <span className="text-[9px] font-bold uppercase tracking-widest">GEMINI TRADER ENGINE v3.0</span>
                <span className="text-[9px] font-bold uppercase tracking-widest bg-blue-500/5 px-2 py-0.5 border border-white/5 rounded-sm">
                  SECURITY SCORE: {selectedBond ? 'AAA+' : '--'}
                </span>
             </div>
          </section>
        </div>

        <div className="w-[420px] flex flex-col border-l border-white/5 p-5 bg-slate-950/40 overflow-hidden shadow-2xl shrink-0">
          <AnalysisPanel bond={selectedBond} />
        </div>

        <aside className="w-72 border-l border-white/5 bg-slate-950/20 p-5 hidden xl:flex flex-col shrink-0">
          <NewsFeed news={news} />
        </aside>
      </main>

      <footer className="h-7 bg-slate-950 border-t border-white/5 flex items-center justify-between px-6 text-[9px] font-bold text-slate-600 uppercase tracking-widest z-30 font-sans">
        <div className="flex items-center space-x-8">
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full"></span>
            <span>系統就緒</span>
          </span>
          <span>網絡延遲: 8ms</span>
          <span>數據來源: BLOOMBERG / REUTERS</span>
        </div>
        <div className="flex space-x-6 items-center">
          <span className="text-slate-400">{new Date().toLocaleDateString('zh-CN', {year: 'numeric', month: '2-digit', day: '2-digit'})} {new Date().toLocaleTimeString('zh-CN', {hour12: false})}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
