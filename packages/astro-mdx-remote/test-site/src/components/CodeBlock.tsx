// src/components/user-components/CodeBlock.tsx
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export function CodeBlock({ code, lang = 'text' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      style={{ position: 'relative', background: '#1e1e1e', borderRadius: '6px', padding: '1rem' }}
    >
      <button
        onClick={copy}
        style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '12px' }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre style={{ color: '#d4d4d4', margin: 0, overflowX: 'auto' }}>
        <code data-lang={lang}>{code}</code>
      </pre>
    </div>
  );
}
