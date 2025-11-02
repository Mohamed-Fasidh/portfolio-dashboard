'use client';
import { ResponsiveContainer, PieChart, Pie, Tooltip } from 'recharts';
import { EnrichedHolding } from '@/lib/types';

export function AllocationPie({ rows }: { rows: EnrichedHolding[] }) {
  const data = rows.map(r => ({ name: r.name, value: Number(r.weightPct.toFixed(2)) }));
  return (
    <div className="card p-4">
      <div className="text-sm text-gray-500 mb-2">Portfolio Allocation</div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie dataKey="value" data={data} outerRadius={90} label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
