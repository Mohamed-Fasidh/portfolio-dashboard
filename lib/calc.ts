import { EnrichedHolding, Holding, SectorSummary } from './types';

export function enrichHoldings(base: Holding[], metricsMap: Record<string, { cmp: number|null, pe: number|null, earnings: string|null }>, totalInvestment?: number): EnrichedHolding[] {
  const rows: EnrichedHolding[] = base.map(h => {
    const key = `${h.symbol}:${h.exchange}`.toUpperCase();
    const m = metricsMap[key] || { cmp: null, pe: null, earnings: null };
    const investment = h.purchasePrice * h.qty;
    const presentValue = (m.cmp ?? null) !== null ? (m.cmp as number) * h.qty : null;
    const gainLoss = presentValue !== null ? presentValue - investment : null;
    return {
      ...h,
      cmp: m.cmp,
      peRatio: m.pe,
      latestEarnings: m.earnings,
      ts: Date.now(),
      source: { cmp: 'yahoo', fundamentals: 'google' },
      investment,
      presentValue,
      gainLoss,
      weightPct: 0
    };
  });
  const totalInv = totalInvestment ?? rows.reduce((acc, r) => acc + r.investment, 0);
  rows.forEach(r => { r.weightPct = totalInv ? (r.investment / totalInv) * 100 : 0; });
  return rows;
}

export function groupBySector(rows: EnrichedHolding[]): SectorSummary[] {
  const map = new Map<string, SectorSummary>();
  for (const r of rows) {
    const cur = map.get(r.sector) || { sector: r.sector, totalInvestment: 0, totalPresentValue: 0, totalGainLoss: 0 };
    cur.totalInvestment += r.investment;
    if (typeof r.presentValue === 'number') cur.totalPresentValue += r.presentValue;
    if (typeof r.gainLoss === 'number') cur.totalGainLoss += r.gainLoss;
    map.set(r.sector, cur);
  }
  return Array.from(map.values());
}
