import { NextRequest, NextResponse } from 'next/server';
import { metricsCache, cacheKey } from '@/lib/cache';
import { getYahooCMP } from '@/lib/providers/yahooFinance';
import { getGoogleFundamentals, getGoogleCMP } from '@/lib/providers/googleFinance';
import { resolveCandidates, sanitizeExchange } from '@/lib/symbolMap';

export async function POST(req: NextRequest) {
  try {
    const { tickers } = (await req.json()) as { tickers: Array<{ symbol: string; exchange: string }> };
    if (!Array.isArray(tickers) || tickers.length === 0) {
      return NextResponse.json({ error: 'tickers empty' }, { status: 400 });
    }

    const out: Record<string, { cmp: number | null; pe: number | null; earnings: string | null }> = {};

    await Promise.all(
      tickers.map(async (t) => {
        const ex = sanitizeExchange(t.exchange);
        const key = cacheKey(t.symbol, ex);

        const cached = metricsCache.get(key);
        if (cached) { out[key] = cached; return; }

        // Try canonical candidates
        const candidates = resolveCandidates(t.symbol);
        let chosen = candidates[0];
        let cmp: number | null = null;

        // 1) Yahoo CMP
        for (const cand of candidates) {
          cmp = await getYahooCMP(cand, ex);
          if (cmp != null) { chosen = cand; break; }
        }

        // 2) Google CMP fallback
        if (cmp == null) {
          for (const cand of candidates) {
            cmp = await getGoogleCMP(cand, ex);
            if (cmp != null) { chosen = cand; break; }
          }
        }

        const fundamentals = await getGoogleFundamentals(chosen, ex);
        const val = { cmp, pe: fundamentals.pe, earnings: fundamentals.earnings };

        metricsCache.set(key, val);
        out[key] = val;

        console.log(`[metrics] ${t.symbol} → ${chosen}:${ex} | CMP=${cmp} PE=${val.pe} E=${val.earnings}`);
      })
    );

    return NextResponse.json({ data: out });
  } catch (e) {
    console.error('metrics route error:', e);
    return NextResponse.json({ error: 'metrics fetch failed' }, { status: 500 });
  }
}
