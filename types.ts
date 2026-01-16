
export interface Ratings {
  moodys: string;
  snp: string;
  fitch: string;
}

export interface Financials {
  totalAssets: string;
  totalLiabilities: string;
  debtRatio: string;
  currentRatio: string;
  quickRatio: string;
  cashEquivalents: string;
  grossMargin: string;
  netMargin: string;
  eps: string;
  peg: string;
  reportDate: string;
}

export interface Bond {
  id: string;
  ticker: string;
  issuer: string;
  guarantor?: string;
  coupon: number;
  maturity: string;
  price: number;
  yield: number;
  yieldChangeBps: number;
  duration: number;
  currency: 'USD' | 'EUR' | 'CNY' | 'HKD';
  sector: string;
  ratings: Ratings;
}

export interface MarketRate {
  label: string;
  rate: number;
  change: number;
  currency: string;
}

export interface NewsItem {
  id: string;
  timestamp: string; // 時間 HH:MM
  date: string;      // 日期 yyyy-mm-dd
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'low' | 'medium' | 'high';
  tags: string[];
}
