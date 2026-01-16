
import { Bond, MarketRate, NewsItem } from './types';

// 根據用戶提供的 ISIN 清單生成的專業化債券池 (約 120 隻)
const generateBonds = (): Bond[] => {
  const isinList = [
    "US91282CFM82", "US91282CPK17", "US91282CMD01", "US91282CMC28", "US91282CJJ18", "US91282CNC19",
    "US912810QA97", "US912810TU25", "US912810TZ12", "US912810RK60", "US912810SN90", "US912810TD00",
    "US912810TX63", "USY5S5CGAK82", "USY5S5CGAL65", "USY5S5CGAM49", "US37045VAY65", "US37045VAZ31",
    "US44891CCG69", "US44891CCH43", "US44891CCJ09", "USG2176UAA81", "USG2176UAB64", "US037833EC07",
    "US023135BF28", "US254687FX90", "US58013MFQ24", "US30303M8S40", "US64110LAZ94", "US30231GBM33",
    "XS1994698436", "US438127AB80", "AU0000075681", "AU000XCLWAR9", "AU000XCLWAM0", "AU000XCLWAP3",
    "AU000XCLWAS7", "AU0000300535", "GB00BPSNB460", "GB00BSQNRD01", "GB00B6460505", "US24023LAF31",
    "US87973RAE09", "XS2911668650", "XS2981969210", "AU3CB0249357", "US88579YAY77", "US88579YBQ35",
    "USU81522AE14", "NZGOVDT427C1", "NZGOVDT530C2", "NZGOVDT536C9", "NZGOVDT541C9", "NZGOVDT554C2",
    "US56501RAN61", "US56501RAX44", "AU3CB0313476", "XS2357280101", "USU74079AQ46", "XS2978743222",
    "DE000A3LSYG8", "DE000A382988", "US855244AT67", "XS2389383766", "AU3SG0002934", "AU3SG0003163",
    "XS2190202015", "HK0000492725", "AU3SG0003155", "US594918AX20", "XS1720922415", "US191216DY38",
    "US191216DZ03", "XS1762698048", "HK0001151395", "USJ75963DC97", "USJ75963DB15", "DE000BU27006",
    "DE000BU2Z056", "DE000BU2F009", "AU3SG0002082", "AU3SG0002553", "HK0001179586", "HK0000249703",
    "US58013MFW91", "US171239AM89", "US71081ET61", "US71081EU35", "US71081EV18", "US097023CY98",
    "US097023CV59", "US097023CX16", "AU3CB0283182", "AU3CB0274280", "HK0000579604", "NZANBDT026C2",
    "XS3007631032", "US88579YBK64", "US01609WBM38", "US01609WBP68", "US01609WBQ42", "US458140CN85",
    "US458140CL20", "US458140CM03", "US68389XDH52", "US68389XDM48", "US68389XDP78", "US68389XDR35",
    "CA135087H235", "CA135087T388", "CA135087T537", "HK0001179263", "AU3CB0313419", "AU3CB0319416",
    "US254687FY73", "US254687FZ49", "US02079KAX54", "US02079KAY38", "US02079KAE73", "US02079KAZ03"
  ];

  return isinList.map((isin, index) => {
    let issuer = "未知發行人";
    let currency: 'USD' | 'EUR' | 'CNY' | 'HKD' = 'USD';
    let sector = "其他";
    let ratings = { moodys: 'Baa1', snp: 'BBB+', fitch: 'BBB' };

    if (isin.startsWith('US9128')) {
      issuer = "美國財政部 (Treasury)";
      sector = "主權債";
      ratings = { moodys: 'Aaa', snp: 'AA+', fitch: 'AA+' };
    } else if (isin.startsWith('HK')) {
      issuer = index % 2 === 0 ? "香港特別行政區政府" : "香港機管局";
      currency = 'HKD';
      sector = "政府/公用債";
      ratings = { moodys: 'Aa3', snp: 'AA+', fitch: 'AA-' };
    } else if (isin.startsWith('AU')) {
      issuer = "澳洲聯邦政府 (ACGB)";
      sector = "主權債";
      ratings = { moodys: 'Aaa', snp: 'AAA', fitch: 'AAA' };
    } else if (isin.startsWith('NZ')) {
      issuer = "紐西蘭政府 (NZGB)";
      sector = "主權債";
      ratings = { moodys: 'Aaa', snp: 'AAA', fitch: 'AAA' };
    } else if (isin.startsWith('DE')) {
      issuer = "德意志聯邦共和國 (Bund)";
      currency = 'EUR';
      sector = "主權債";
      ratings = { moodys: 'Aaa', snp: 'AAA', fitch: 'AAA' };
    } else if (isin.startsWith('GB')) {
      issuer = "英國財政部 (Gilt)";
      currency = 'EUR'; // 國際終端常設
      sector = "政府債";
      ratings = { moodys: 'Aa3', snp: 'AA', fitch: 'AA-' };
    } else if (isin.startsWith('CA')) {
      issuer = "加拿大政府 (CAN)";
      sector = "主權債";
      ratings = { moodys: 'Aaa', snp: 'AAA', fitch: 'AAA' };
    } else if (isin.startsWith('XS') || isin.startsWith('USY') || isin.startsWith('USU')) {
      issuer = "企業/跨國發行人";
      sector = "信用債";
    }

    // 隨機生成一些逼真的市場數據供初次顯示
    const price = 85 + Math.random() * 20;
    const yieldVal = 3 + Math.random() * 4;
    const maturityYear = 2025 + Math.floor(Math.random() * 25);

    return {
      id: `b-${index}`,
      ticker: isin,
      issuer: issuer,
      coupon: 2.5 + Math.random() * 3,
      maturity: `${maturityYear}-06-15`,
      price: Number(price.toFixed(3)),
      yield: Number(yieldVal.toFixed(3)),
      yieldChangeBps: Number(((Math.random() - 0.5) * 10).toFixed(1)),
      duration: 1 + Math.random() * 15,
      currency: currency,
      sector: sector,
      ratings: ratings
    };
  });
};

export const INITIAL_WATCHLIST: Bond[] = generateBonds();

export const INITIAL_RATES: MarketRate[] = [
  { label: 'UST 10Y', rate: 4.22, change: -0.01, currency: 'USD' },
  { label: 'UST 2Y', rate: 4.58, change: +0.02, currency: 'USD' },
  { label: 'SOFR', rate: 5.31, change: 0.00, currency: 'USD' },
  { label: 'EURIBOR 3M', rate: 3.85, change: -0.02, currency: 'EUR' },
  { label: 'HIBOR 3M', rate: 4.65, change: +0.05, currency: 'HKD' }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    timestamp: '15:30',
    date: '2024-05-22',
    title: '全球政府債券收益率震盪',
    summary: '受通脹預期調整影響，美、澳、紐國債收益率今日同步小幅走高。',
    sentiment: 'neutral',
    impact: 'medium',
    tags: ['UST', 'ACGB', 'NZGB']
  },
  {
    id: 'n2',
    timestamp: '11:15',
    date: '2024-05-22',
    title: '香港政府債券市場需求強勁',
    summary: '本地機構投資者對長端港府債表現出濃厚興趣，利差維持在低位。',
    sentiment: 'positive',
    impact: 'low',
    tags: ['HKGB', '流動性']
  }
];
