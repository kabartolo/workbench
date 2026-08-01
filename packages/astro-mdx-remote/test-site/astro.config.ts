// @ts-check
import { defineConfig } from 'astro/config';
import astroRemoteMdx from '../src/index';
import node from '@astrojs/node';
import react from '@astrojs/react'; // dev dep only

const config = {
  output: 'static' as 'server' | 'static' | undefined,
};

// https://astro.build/config
export default defineConfig({
  output: config.output,
  adapter: config.output === 'server' ? node({ mode: 'standalone' }) : undefined,
  integrations: [
    react(),
    astroRemoteMdx({
      components: {
        Callout: './src/components/Callout.jsx#Callout',
        CodeBlock: './src/components/CodeBlock.jsx#CodeBlock',
        Counter: './src/components/Counter.jsx#Counter',
        LazyChart: './src/components/LazyChart.jsx#LazyChart',
        PropTable: './src/components/PropTable.jsx#PropTable',
      },
    }),
  ],
  vite: {},
});
