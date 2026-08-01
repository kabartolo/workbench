// src/components/jsx/CodeBlock.tsx
import { useState, useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // Or choose any standard HLJS theme CSS

interface Props {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: Props) {
  const [copied, setCopied] = useState(false);

  // Safely highlight code on the client using highlight.js
  const highlightedCode = useMemo(() => {
    try {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(code, { language }).value;
      }
      return hljs.highlightAuto(code).value;
    } catch {
      return code;
    }
  }, [code, language]);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'var(--sundrop-color-canvas-subtle)',
        color: 'var(--sundrop-color-fg-default)',
        borderRadius: 'var(--sundrop-scale-2)',
        border: '1px solid var(--sundrop-color-border-default)',
        overflow: 'hidden',
        margin: 'var(--sundrop-space-lg) 0',
        fontFamily: 'var(--sundrop-font-mono)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--sundrop-space-sm) var(--sundrop-space-md)',
          backgroundColor: 'var(--sundrop-color-surface-cool)',
          borderBottom: '1px solid var(--sundrop-color-border-default)',
          fontSize: 'var(--sundrop-size-small)',
        }}
      >
        <span
          style={{
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--sundrop-color-fg-muted)',
            fontWeight: 600,
          }}
        >
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          style={{
            backgroundColor: copied ? 'var(--vt-pine-dark, #067a53)' : 'var(--sundrop-color-canvas-default)',
            color: copied ? '#ffffff' : 'var(--sundrop-color-fg-default)',
            border: '1px solid var(--sundrop-color-border-default)',
            borderRadius: 'var(--sundrop-scale-1)',
            padding: 'var(--sundrop-scale-1) var(--sundrop-scale-3)',
            fontSize: 'var(--sundrop-size-small)',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'background-color 0.2s ease',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <pre
        style={{
          margin: 0,
          padding: 'var(--sundrop-space-md)',
          overflowX: 'auto',
          fontSize: 'var(--sundrop-size-body)',
          lineHeight: '1.7',
        }}
      >
        <code
          style={{ fontFamily: 'inherit' }}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}