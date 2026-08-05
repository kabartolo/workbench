// src/components/jsx/PreWrapper.tsx
import CodeBlock from '../../../../components/jsx/CodeBlock';
import { type ReactElement } from 'react';

interface CodeChild {
  children?: string;
  className?: string;
}

export default function PreWrapper({
  children,
}: {
  children?: ReactElement<CodeChild>;
}) {
  const code = children?.props?.children ?? '';
  const language = children?.props?.className?.replace('language-', '') ?? '';
  return <CodeBlock code={code} language={language} />;
}
