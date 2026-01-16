'use client';

import React from 'react';
import { NewsItem } from '@/types';

interface NewsFeedProps {
  news: NewsItem[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">市場電訊 (News)</h3>
        <span className="flex items-center space-x-1.5">
           <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">實時推送</span>
        </span>
      </div>
      <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {news.map((item) => (
          <div key={item.id} className="group relative pl-4 border-l border-white/5 hover:border-blue-500/50 transition-all duration-300 pb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-slate-500 mono tracking-tighter bg-white/5 px-2 py-0.5 rounded">
                {item.timestamp} <span className="text-slate-600 mx-1">|</span> {item.date}
              </span>
              <span className={`px-2 py-0.5 rounded-[2px] text-[8px] font-black uppercase tracking-widest ${
                item.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                item.sentiment === 'negative' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
              }`}>
                {item.impact === 'high' ? '重大' : item.impact === 'medium' ? '中等' : '一般'}
              </span>
            </div>
            <h4 className="text-[12px] font-bold text-slate-200 group-hover:text-blue-400 transition-colors mb-2 leading-snug">
              {item.title}
            </h4>
            <p className="text-[11px] text-slate-400 leading-[1.6] line-clamp-3 font-medium">
              {item.summary}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.tags.map(tag => (
                <span key={tag} className="text-[8px] font-black bg-slate-800/50 text-slate-500 px-1.5 py-0.5 rounded border border-white/5 uppercase tracking-tighter">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
