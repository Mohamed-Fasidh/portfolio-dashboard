import { SectorSummary } from '@/lib/types';

export default function SectorSummaryCard({ data }: { data: SectorSummary[] }) {
  if (!data?.length) return null;
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {data.map(s => (
        <div key={s.sector} className="card p-4">
          <div className="text-sm text-gray-500">{s.sector}</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>Investment</div><div className="table-cell-num">₹{s.totalInvestment.toFixed(2)}</div>
            <div>Present Value</div><div className="table-cell-num">₹{s.totalPresentValue.toFixed(2)}</div>
            <div>Gain/Loss</div>
            <div className={`table-cell-num ${s.totalGainLoss >= 0 ? 'gain' : 'loss'}`}>
              {s.totalGainLoss >= 0 ? '+' : ''}₹{s.totalGainLoss.toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
