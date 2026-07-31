// src/components/jsx/CodeBlock.tsx
import { useState } from 'react';

interface Props {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ position: 'relative' }}>
      {language && (
        <span
          style={{
            position: 'absolute',
            top: '0.5rem',
            left: '0.75rem',
            opacity: 0.5,
            fontSize: '0.75rem',
          }}
        >
          {language}
        </span>
      )}
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.75rem',
          fontSize: '0.75rem',
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
