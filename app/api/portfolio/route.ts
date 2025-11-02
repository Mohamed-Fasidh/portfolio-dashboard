import { NextRequest, NextResponse } from 'next/server';
import { holdingsSchema } from '@/lib/schema';
import { enrichHoldings } from '@/lib/calc';

export async function POST(req: NextRequest) {
  try {
    const holdings = await req.json();
    const parsed = holdingsSchema.parse(holdings);

    const tickers = parsed.map((h: any) => ({ symbol: h.symbol, exchange: h.exchange }));
    const res = await fetch(new URL('/api/metrics', req.nextUrl).toString(), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tickers })
    });

    if (!res.ok) return NextResponse.json({ error: 'metrics failed' }, { status: 502 });
    const { data } = await res.json();
    const rows = enrichHoldings(parsed, data);
    return NextResponse.json({ rows });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'portfolio enrichment failed' }, { status: 400 });
  }
}
