'use client';

import React, { useState, useMemo } from 'react';
import { Bond } from '@/types';

interface WatchlistTableProps {
  bonds: Bond[];
  onSelect: (bond: Bond) => void;
  selectedId?: string;
  markup: number;
}

interface Filters {
  ticker: string;
  issuer: string;
  currency: string;
  sector: string;
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({ bonds, onSelect, selectedId, markup }) => {
  const [filters, setFilters] = useState<Filters>({
    ticker: '',
    issuer: '',
    currency: '',
    sector: ''
  });

  const calculateTenor = (maturity: string) => {
    const maturityDate = new Date(maturity);
    const today = new Date();
    const diffTime = maturityDate.getTime() - today.getTime();
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return diffYears > 0 ? diffYears.toFixed(1) : '0.0';
  };

  const getAdjustedData = (bond: Bond) => {
    const adjPrice = bond.price + markup;
    const yieldImpact = markup > 0 ? (markup / (bond.price * bond.duration)) * 100 : 0;
    const adjYield = Math.max(0, bond.yield - yieldImpact);
    
    return {
      price: adjPrice,
      yield: adjYield
    };
  };

  const filteredBonds = useMemo(() => {
    return bonds.filter(bond => {
      return (
        bond.ticker.toLowerCase().includes(filters.ticker.toLowerCase()) &&
        bond.issuer.toLowerCase().includes(filters.issuer.toLowerCase()) &&
        bond.currency.toLowerCase().includes(filters.currency.toLowerCase()) &&
        bond.sector.toLowerCase().includes(filters.sector.toLowerCase())
      );
    });
  }, [bonds, filters]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const FilterInput = ({ placeholder, value, onChange }: { placeholder: string, value: string, onChange: (v: string) => void }) => (
    <input 
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 bg-slate-950/50 border border-white/5 rounded-sm px-1.5 py-0.5 text-[8px] font-bold text-blue-400 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-colors"
      onClick={(e) => e.stopPropagation()}
    />
  );

  return (
    <div className="h-full overflow-auto custom-scrollbar relative">
      <table className="w-full text-left border-separate border-spacing-0 min-w-[1050px]">
        <thead className="sticky top-0 z-20 shadow-xl">
          <tr className="bg-slate-900 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            <th className="px-5 py-3 border-b border-white/10 whitespace-nowrap align-top">
              <div>證券代碼</div>
              <FilterInput placeholder="篩選 ISIN..." value={filters.ticker} onChange={(v) => handleFilterChange('ticker', v)} />
            </th>
            <th className="px-5 py-3 border-b border-white/10 whitespace-nowrap align-top">
              <div>發行人 / 擔保人</div>
              <FilterInput placeholder="搜尋發行人..." value={filters.issuer} onChange={(v) => handleFilterChange('issuer', v)} />
            </th>
            <th className="px-5 py-3 border-b border-white/10 text-right whitespace-nowrap align-top">報價 (加價)</th>
            <th className="px-5 py-3 border-b border-white/10 text-right whitespace-nowrap align-top">收益率 (%)</th>
            <th className="px-5 py-3 border-b border-white/10 text-right whitespace-nowrap align-top">日變 (BPS)</th>
            <th className="px-5 py-3 border-b border-white/10 text-center whitespace-nowrap align-top">期限 (Y)</th>
            <th className="px-5 py-3 border-b border-white/10 text-center whitespace-nowrap align-top">
              <div>板塊</div>
              <FilterInput placeholder="篩選板塊..." value={filters.sector} onChange={(v) => handleFilterChange('sector', v)} />
            </th>
            <th className="px-5 py-3 border-b border-white/10 whitespace-nowrap align-top">到期日</th>
            <th className="px-5 py-3 text-center border-b border-white/10 whitespace-nowrap align-top">
              <div>幣種</div>
              <FilterInput placeholder="幣種" value={filters.currency} onChange={(v) => handleFilterChange('currency', v)} />
            </th>
            <th className="px-5 py-3 text-center border-b border-white/10 whitespace-nowrap align-top">評級</th>
          </tr>
        </thead>
        <tbody className="text-[11px] font-medium">
          {filteredBonds.length > 0 ? (
            filteredBonds.map((bond) => {
              const adj = getAdjustedData(bond);
              return (
                <tr 
                  key={bond.id} 
                  onClick={() => onSelect(bond)}
                  className={`group transition-colors duration-75 cursor-pointer 
                    ${selectedId === bond.id 
                      ? 'bg-blue-500/10' 
                      : 'hover:bg-white/[0.03]'}`}
                >
                  <td className="px-5 py-2.5 border-b border-white/[0.03] whitespace-nowrap">
                    <span className={`font-bold mono tracking-tight ${selectedId === bond.id ? 'text-blue-400' : 'text-slate-100'}`}>
                      {bond.ticker}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 border-b border-white/[0.03]">
                    <div className="flex flex-col max-w-[200px]">
                      <span className="text-slate-300 font-bold truncate leading-none mb-1">{bond.issuer}</span>
                      {bond.guarantor && (
                        <span className="text-[8px] text-slate-600 font-bold uppercase tracking-tight truncate">
                          G: {bond.guarantor}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-2.5 text-right mono border-b border-white/[0.03] tabular-nums font-bold whitespace-nowrap">
                    <span className={markup > 0 ? "text-blue-400" : "text-slate-200"}>{adj.price.toFixed(3)}</span>
                  </td>
                  <td className="px-5 py-2.5 text-right text-emerald-400 mono font-bold border-b border-white/[0.03] tabular-nums whitespace-nowrap">
                    {adj.yield.toFixed(3)}%
                  </td>
                  <td className={`px-5 py-2.5 text-right mono font-bold border-b border-white/[0.03] tabular-nums whitespace-nowrap ${bond.yieldChangeBps >= 0 ? 'text-rose-500/80' : 'text-emerald-500/80'}`}>
                    {bond.yieldChangeBps >= 0 ? '+' : ''}{bond.yieldChangeBps.toFixed(1)}
                  </td>
                  <td className="px-5 py-2.5 text-center text-blue-400 font-bold mono border-b border-white/[0.03] whitespace-nowrap">
                    {calculateTenor(bond.maturity)}
                  </td>
                  <td className="px-5 py-2.5 text-center text-slate-500 mono border-b border-white/[0.03] whitespace-nowrap">
                    <span className="text-[9px] font-bold opacity-80">{bond.sector}</span>
                  </td>
                  <td className="px-5 py-2.5 text-slate-500 whitespace-nowrap border-b border-white/[0.03] font-bold">
                    {bond.maturity}
                  </td>
                  <td className="px-5 py-2.5 text-center border-b border-white/[0.03] whitespace-nowrap">
                    <span className="text-[8px] font-bold text-slate-400 bg-white/[0.03] px-1.5 py-0.5 rounded-sm border border-white/5">
                      {bond.currency}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 border-b border-white/[0.03] whitespace-nowrap">
                    <div className="flex justify-center space-x-1">
                      <span className="text-[8px] font-bold text-blue-400/80">{bond.ratings.moodys}</span>
                      <span className="text-[8px] font-bold text-slate-500">/</span>
                      <span className="text-[8px] font-bold text-slate-400/80">{bond.ratings.snp}</span>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={10} className="px-5 py-20 text-center text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                沒有匹配的債券數據
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WatchlistTable;
