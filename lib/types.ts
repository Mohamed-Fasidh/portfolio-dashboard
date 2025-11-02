export type Exchange = 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE' | string;

export type Holding = {
  symbol: string;
  exchange: Exchange;
  name: string;
  sector: string;
  purchasePrice: number;
  qty: number;
};

export type Metrics = {
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: string | null;
  ts: number;
  source: {
    cmp: 'yahoo',
    fundamentals: 'google'
  }
};

export type EnrichedHolding = Holding & Metrics & {
  investment: number;
  presentValue: number | null;
  gainLoss: number | null;
  weightPct: number;
};

export type SectorSummary = {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
};
