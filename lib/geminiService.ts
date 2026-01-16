import { GoogleGenAI, Type } from "@google/genai";
import { Bond, NewsItem, Financials } from "@/types";

class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async getFinancialAnalysis(issuer: string): Promise<Financials | null> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `請分析公司 "${issuer}" 的最新財務報表。
        1. 確定其原始報告幣種和單位。
        2. 將所有金額（總資產、總負債、現金等）精確轉換為 港幣 (HKD)。
        3. 以 "百萬港幣" (mil HKD) 為單位提供數值。
        4. 提取數據所屬的財報日期或季度（例如：2023年報 或 2024 Q3）。
        5. 所有輸出必須使用繁體中文。
        請嚴格按照 JSON 格式返回，數值只需包含數字和千分位分隔符，不需帶單位。`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              totalAssets: { type: Type.STRING },
              totalLiabilities: { type: Type.STRING },
              debtRatio: { type: Type.STRING },
              currentRatio: { type: Type.STRING },
              quickRatio: { type: Type.STRING },
              cashEquivalents: { type: Type.STRING },
              grossMargin: { type: Type.STRING },
              netMargin: { type: Type.STRING },
              eps: { type: Type.STRING },
              peg: { type: Type.STRING },
              reportDate: { type: Type.STRING, description: "數據來源財報的日期或期數" }
            },
            required: ["totalAssets", "debtRatio", "reportDate"]
          }
        }
      });
      return JSON.parse(response.text) as Financials;
    } catch (error) {
      console.error("Financial Analysis Error:", error);
      return null;
    }
  }

  async getIssuerBackground(issuer: string, guarantor?: string): Promise<string> {
    try {
      const entity = guarantor ? `${issuer} (由 ${guarantor} 擔保)` : issuer;
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `作為一名資深信用分析師，請為 "${entity}" 提供專業的公司介紹。
        重點說明其業務模式、市場地位及信用狀況。
        字數不超過 200 字。語言：繁體中文。`,
      });
      return response.text || "暫無背景資料。";
    } catch (error) {
      return "無法獲取發行人背景。";
    }
  }

  async getIssuerNews(issuer: string, guarantor?: string): Promise<NewsItem[]> {
    try {
      const query = guarantor ? `${issuer} 和 ${guarantor}` : issuer;
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
      
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `請提供關於 ${query} 的最新 3 條財務新聞、業績亮點或信用評級變動。請使用繁體中文。`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      
      const lines = response.text.split('\n').filter(l => l.trim().length > 10).slice(0, 3);
      return lines.map((line, i) => ({
        id: `gen-${Date.now()}-${i}`,
        timestamp: timeStr,
        date: dateStr,
        title: `${issuer} 市場動態`,
        summary: line.replace(/^\W+/, ''),
        sentiment: 'neutral',
        impact: 'medium',
        tags: [issuer.toUpperCase(), '實時']
      }));
    } catch (error) {
      return [];
    }
  }

  async getTraderInsight(bond: Bond): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `資深債券交易員見解：
          代碼：${bond.ticker}
          發行人：${bond.issuer}
          收益率：${bond.yield}% (變動：${bond.yieldChangeBps}bps)
          評級：穆迪 ${bond.ratings.moodys}, 標普 ${bond.ratings.snp}, 惠譽 ${bond.ratings.fitch}
          請分析其利差風險和估值狀況。語言：繁體中文。`,
      });
      return response.text;
    } catch (e) { 
      return "分析離線。"; 
    }
  }

  async getMacroSummary(news: NewsItem[]): Promise<string> {
    const newsContext = news.map(n => n.title).join("; ");
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `根據以下新聞為交易員總結宏觀策略建議：${newsContext}。語言：繁體中文。`,
    });
    return response.text;
  }
}

// Create a singleton instance
let geminiService: GeminiService;

export function getGeminiService(): GeminiService {
  if (!geminiService) {
    geminiService = new GeminiService();
  }
  return geminiService;
}
