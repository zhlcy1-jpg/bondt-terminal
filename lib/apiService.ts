import { Bond, NewsItem, Financials } from "@/types";

export class ApiService {
  private baseUrl = '';

  async getTraderInsight(bond: Bond): Promise<string> {
    try {
      const response = await fetch('/api/gemini/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getTraderInsight', bond })
      });
      
      if (!response.ok) throw new Error('Failed to get insight');
      const data = await response.json();
      return data.insight;
    } catch (error) {
      console.error("Trader Insight Error:", error);
      return "分析離線。";
    }
  }

  async getIssuerNews(issuer: string, guarantor?: string): Promise<NewsItem[]> {
    try {
      const response = await fetch('/api/gemini/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issuer, guarantor })
      });
      
      if (!response.ok) throw new Error('Failed to get news');
      const data = await response.json();
      return data.news;
    } catch (error) {
      console.error("Issuer News Error:", error);
      return [];
    }
  }

  async getMacroSummary(news: NewsItem[]): Promise<string> {
    try {
      const response = await fetch('/api/gemini/macro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ news })
      });
      
      if (!response.ok) throw new Error('Failed to get macro summary');
      const data = await response.json();
      return data.macro;
    } catch (error) {
      console.error("Macro Summary Error:", error);
      return "宏观分析服务暂不可用。";
    }
  }

  async getIssuerBackground(issuer: string, guarantor?: string): Promise<string> {
    try {
      const response = await fetch('/api/gemini/background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issuer, guarantor })
      });
      
      if (!response.ok) throw new Error('Failed to get background');
      const data = await response.json();
      return data.background;
    } catch (error) {
      console.error("Issuer Background Error:", error);
      return "無法獲取發行人背景。";
    }
  }

  async getFinancialAnalysis(issuer: string): Promise<Financials | null> {
    try {
      const response = await fetch('/api/gemini/financial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issuer })
      });
      
      if (!response.ok) throw new Error('Failed to get financial analysis');
      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error("Financial Analysis Error:", error);
      return null;
    }
  }
}

export const apiService = new ApiService();
