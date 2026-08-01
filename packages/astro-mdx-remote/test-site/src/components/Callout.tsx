// src/components/user-components/Callout.tsx
import type { ReactNode } from 'react';

interface CalloutProps {
  type?: 'note' | 'warning' | 'tip';
  title?: string;
  children: ReactNode;
}

export function Callout({ type = 'note', title, children }: CalloutProps) {
  const styles = {
    note: { border: '1px solid #3b82f6', background: '#eff6ff' },
    warning: { border: '1px solid #f59e0b', background: '#fffbeb' },
    tip: { border: '1px solid #10b981', background: '#ecfdf5' },
  };
  return (
    <div style={{ padding: '1rem', borderRadius: '6px', ...styles[type] }}>
      {title && <strong style={{ display: 'block', marginBottom: '0.5rem' }}>{title}</strong>}
      <div>{children}</div>
    </div>
  );
}
