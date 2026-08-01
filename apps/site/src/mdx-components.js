import CodeBlock from './components/jsx/CodeBlock';

export const components = {
  CodeBlock: CodeBlock,

  // HTML Element Override with an explicit prop-extractor function
  pre: {
    Component: CodeBlock,
    transform: (props) => ({
      code: props.children?.props?.children ?? '',
      language: props.children?.props?.className?.replace('language-', '') ?? '',
    }),
  },
};