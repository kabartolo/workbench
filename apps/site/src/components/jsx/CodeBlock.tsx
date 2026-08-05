import { useState, useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import './CodeBlock.css';

interface Props {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: Props) {
  const [copied, setCopied] = useState(false);

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
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-language">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className={`code-block-copy-btn ${copied ? 'copied' : ''}`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <pre className="code-block-pre">
        <code
          className="code-block-code"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}
