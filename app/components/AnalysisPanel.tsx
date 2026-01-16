'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Bond, Financials } from '@/types';
import { apiService } from '@/lib/apiService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

interface AnalysisPanelProps {
  bond: Bond | null;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ bond }) => {
  const [background, setBackground] = useState<string>('');
  const [financials, setFinancials] = useState<Financials | null>(null);
  const [loading, setLoading] = useState(false);

  const historicalPriceData = useMemo(() => {
    if (!bond) return [];
    const basePrice = bond.price;
    const months = ['1M', '2M', '3M', '4M', '5M', '6M', '7M', '8M', '9M', '10M', '11M', '12M'];
    return months.map((month, i) => {
      const volatility = (Math.random() - 0.5) * 4;
      return {
        name: month,
        price: Number((basePrice + volatility - (11 - i) * 0.2).toFixed(2))
      };
    });
  }, [bond]);

  const stats = useMemo(() => {
    if (historicalPriceData.length === 0) return { avg: 0, min: 0, max: 0 };
    const prices = historicalPriceData.map(d => d.price);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    return {
      avg: Number(avg.toFixed(2)),
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [historicalPriceData]);

  useEffect(() => {
    if (bond) {
      const fetchData = async () => {
        setLoading(true);
        const [finRes, bgRes] = await Promise.all([
          apiService.getFinancialAnalysis(bond.issuer),
          apiService.getIssuerBackground(bond.issuer, bond.guarantor)
        ]);
        setFinancials(finRes);
        setBackground(bgRes);
        setLoading(false);
      };
      fetchData();
    }
  }, [bond]);

  if (!bond) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-600 p-8 text-center">
        <div className="w-10 h-10 mb-4 border border-slate-800 rounded flex items-center justify-center opacity-30">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">待機分析中</p>
      </div>
    );
  }

  const FinancialRow = ({ label, value, showUnit = false }: { label: string; value?: string; showUnit?: boolean }) => (
    <div className="flex justify-between py-2.5 border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors items-baseline">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{label}</span>
      <div className="flex items-baseline space-x-1.5">
        <span className="text-[11px] mono font-bold text-slate-200 tabular-nums">
          {value || '--'}
        </span>
        {showUnit && value && (
          <span className="text-[8px] font-bold text-blue-500/50 uppercase">HKD</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-1">
          <h2 className="text-lg font-bold text-slate-100 mono tracking-tight">{bond.ticker}</h2>
          <div className="px-1.5 py-0.5 rounded-sm text-[8px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {bond.ratings.snp}
          </div>
        </div>
        <p className="text-[11px] font-bold text-slate-400 leading-none">{bond.issuer}</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-8 custom-scrollbar">
        <section>
           <div className="flex justify-between items-center mb-4">
             <div className="flex flex-col">
                <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">LTM 價格趨勢</p>
                <span className="text-[10px] text-slate-400 font-bold mono mt-0.5">平均值: {stats.avg}</span>
             </div>
             <span className="text-[8px] font-bold text-blue-500/60 mono border border-blue-500/20 px-1.5 py-0.5 rounded-sm">1Y 視窗</span>
           </div>
           <div className="h-32 w-full bg-slate-950/40 rounded-sm border border-white/[0.05] p-2 shadow-inner overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalPriceData}>
                <CartesianGrid strokeDasharray="2 2" stroke="#ffffff04" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis hide domain={[stats.avg - 5, stats.avg + 5]} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', fontSize: '10px'}}
                  itemStyle={{color: '#3b82f6', fontWeight: 700}}
                  cursor={{ stroke: 'rgba(59, 130, 246, 0.2)', strokeWidth: 1 }}
                />
                <ReferenceLine y={stats.avg} stroke="#ffffff08" strokeDasharray="2 2" />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={1.5} dot={false} activeDot={{ r: 3, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
           </div>
        </section>

        <section>
          <div className="flex items-center space-x-2 mb-3">
             <div className="w-[2px] h-3 bg-blue-500"></div>
             <h3 className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">發行人信用概況</h3>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.03] p-4 rounded-sm">
            {loading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-2 bg-white/[0.05] rounded w-full"></div>
                <div className="h-2 bg-white/[0.05] rounded w-5/6"></div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 leading-relaxed text-justify font-medium">
                {background}
              </p>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center space-x-2">
               <div className="w-[2px] h-3 bg-emerald-500"></div>
               <h3 className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">財務核心指標</h3>
             </div>
             <span className="text-[8px] font-bold text-slate-600">單位: HKD</span>
          </div>
          
          <div className="bg-slate-900/30 p-2 px-3 rounded-sm border border-white/[0.03] space-y-0">
            <FinancialRow label="總資產" value={financials?.totalAssets} showUnit />
            <FinancialRow label="總負債" value={financials?.totalLiabilities} showUnit />
            <FinancialRow label="資產負債率" value={financials?.debtRatio} />
            <FinancialRow label="流動比率" value={financials?.currentRatio} />
            <FinancialRow label="毛利率" value={financials?.grossMargin} />
            <FinancialRow label="淨利率" value={financials?.netMargin} />
            <div className="h-px bg-white/[0.03] my-1.5"></div>
            <FinancialRow label="報告日期" value={financials?.reportDate} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalysisPanel;
