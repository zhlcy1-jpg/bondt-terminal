'use client';

import React from 'react';
import { MarketRate } from '@/types';

interface MarketTickerProps {
  rates: MarketRate[];
}

const MarketTicker: React.FC<MarketTickerProps> = ({ rates }) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide space-x-8">
      <div className="flex items-center space-x-2 mr-4 border-r border-slate-700 pr-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">實時行情</span>
      </div>
      {rates.map((rate, idx) => (
        <div key={idx} className="flex items-center space-x-3">
          <span className="text-xs font-medium text-slate-400">{rate.label}</span>
          <span className="text-sm font-bold mono">{rate.rate.toFixed(2)}%</span>
          <span className={`text-xs ${rate.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {rate.change >= 0 ? '+' : ''}{rate.change.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MarketTicker;
