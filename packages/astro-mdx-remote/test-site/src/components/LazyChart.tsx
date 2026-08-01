// src/components/user-components/LazyChart.tsx
import { useState, useEffect } from 'react';

interface LazyChartProps {
  dataUrl: string;
}

export function LazyChart({ dataUrl }: LazyChartProps) {
  const [data, setData] = useState<number[] | null>(null);

  useEffect(() => {
    fetch(dataUrl)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData([]));
  }, [dataUrl]);

  if (!data) return <div>Loading chart…</div>;
  if (!data.length) return <div>No data</div>;

  return (
    <div
      className="lazy-chart"
      style={{
        display: 'flex',
        gap: '4px',
        alignItems: 'flex-end',
        height: '80px',
      }}
    >
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${v}%`,
            background: '#3b82f6',
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );
}
