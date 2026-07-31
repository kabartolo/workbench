// src/components/jsx/PreWrapper.tsx
import CodeBlock from '../../../../components/jsx/CodeBlock';

export default function PreWrapper({ children }: any) {
  const code = (children as any)?.props?.children ?? '';
  const language = (children as any)?.props?.className?.replace('language-', '') ?? '';
  return <CodeBlock code={code} language={language} />;
}