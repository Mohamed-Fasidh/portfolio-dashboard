'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import PortfolioTable from '@/components/PortfolioTable';
import SectorSummaryCard from '@/components/SectorSummary';
import ErrorBanner from '@/components/ErrorBanner';
import { EnrichedHolding, Holding } from '@/lib/types';
import { groupBySector } from '@/lib/calc';
import { AllocationPie } from '@/components/Charts';

const REFRESH_MS = Number(process.env.NEXT_PUBLIC_REFRESH_MS ?? 15000);

const fetcher = (url: string, body: any) => fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());

export default function Page() {
  const [holdings, setHoldings] = useState<Holding[] | null>(null);

  useEffect(() => {
    fetch('/holdings.json').then(r => r.json()).then(setHoldings).catch(() => setHoldings([]));
  }, []);

  const { data, error, isValidating, mutate } = useSWR<{ rows: EnrichedHolding[] }>(
    holdings ? ['/api/portfolio', holdings] as any : null,
    ([url, body]) => fetcher(url, body),
    { refreshInterval: REFRESH_MS, revalidateOnFocus: false }
  );

  const rows = data?.rows ?? [];
  const sector = groupBySector(rows);

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Dynamic Portfolio Dashboard</h1>
      <p className="text-sm text-gray-500">Auto-updating every {REFRESH_MS/1000}s. Data from Yahoo (CMP) & Google (P/E, Earnings). May be delayed or unavailable.</p>

      <div className="flex items-center gap-2">
        <button onClick={() => mutate()} className="px-3 py-2 rounded-xl border card">Refresh Now</button>
        {isValidating && <span className="text-xs text-gray-500">Refreshing…</span>}
      </div>

      <SectorSummaryCard data={sector} />

      <PortfolioTable rows={rows} />

      <AllocationPie rows={rows} />

      <ErrorBanner message={error ? 'Failed to load portfolio. Please try again.' : ''} />

      <footer className="text-xs text-gray-500">
        Disclaimer: Unofficial sources. Values are for information only and may be delayed or inaccurate.
      </footer>
    </main>
  );
}
