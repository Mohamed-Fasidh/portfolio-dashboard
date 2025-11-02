'use client';

import { useMemo } from 'react';
import { ColumnDef, getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import { EnrichedHolding } from '@/lib/types';

export default function PortfolioTable({ rows }: { rows: EnrichedHolding[] }) {
  const cols = useMemo<ColumnDef<EnrichedHolding>[]>(() => ([
    { header: 'Particulars', accessorKey: 'name' },
    { header: 'Exchange', accessorKey: 'exchange' },
    { header: 'Purchase Price', accessorKey: 'purchasePrice', cell: ({ getValue }) => <div className="table-cell-num">₹{Number(getValue()).toFixed(2)}</div> },
    { header: 'Qty', accessorKey: 'qty', cell: ({ getValue }) => <div className="table-cell-num">{getValue() as number}</div> },
    { header: 'Investment', accessorKey: 'investment', cell: ({ getValue }) => <div className="table-cell-num">₹{Number(getValue()).toFixed(2)}</div> },
    { header: 'Portfolio (%)', accessorKey: 'weightPct', cell: ({ getValue }) => <div className="table-cell-num">{Number(getValue()).toFixed(2)}%</div> },
    { header: 'CMP', accessorKey: 'cmp', cell: ({ getValue }) => {
        const v = getValue() as number | null; return <div className="table-cell-num">{v != null ? `₹${v.toFixed(2)}` : '—'}</div>;
      }
    },
    { header: 'Present Value', accessorKey: 'presentValue', cell: ({ getValue }) => {
        const v = getValue() as number | null; return <div className="table-cell-num">{v != null ? `₹${v.toFixed(2)}` : '—'}</div>;
      }
    },
    { header: 'Gain/Loss', accessorKey: 'gainLoss', cell: ({ getValue }) => {
        const v = getValue() as number | null; return <div className={`table-cell-num ${v != null && v >= 0 ? 'gain' : 'loss'}`}>{v != null ? `${v >= 0 ? '+' : ''}₹${v.toFixed(2)}` : '—'}</div>;
      }
    },
    { header: 'P/E Ratio', accessorKey: 'peRatio', cell: ({ getValue }) => <div className="table-cell-num">{(getValue() as number | null) ?? '—'}</div> },
    { header: 'Latest Earnings', accessorKey: 'latestEarnings' },
  ]), []);

  const table = useReactTable({
    data: rows,
    columns: cols,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-auto card">
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 bg-white/70 dark:bg-neutral-900/70 backdrop-blur border-b border-gray-200 dark:border-neutral-800">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id} className="text-left px-3 py-2 font-medium">{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(r => (
            <tr key={r.id} className="border-b border-gray-100 dark:border-neutral-800">
              {r.getVisibleCells().map(c => (
                <td key={c.id} className="px-3 py-2 align-middle">{flexRender(c.column.columnDef.cell, c.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
