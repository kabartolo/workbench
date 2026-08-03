// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import rehypeComponentMarkers from './src/plugins/rehype-component-markers.js';
import astroRemoteMdx from 'astro-mdx-remote';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://katebartolo.dev',
  // output: 'server',
  adapter: vercel(),

  integrations: [
    mdx(),
    sitemap(),
    icon(),
    react(),
    astroRemoteMdx({
      configFilePath: './src/mdx-components.js',
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeComponentMarkers],
  },
});
