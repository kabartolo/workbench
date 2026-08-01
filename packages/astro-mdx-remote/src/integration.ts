// packages/astro-remote-mdx/src/integration.ts
import type { AstroIntegration } from 'astro';

import { preamble } from './constants/preamble.js';
import { virtualMdxComponentsPlugin } from './plugins/virtual-components.js';

export interface RemoteMdxOptions {
  /** Path to the user's component map file relative to their project root */
  configFilePath?: string;
}

export function remoteMdxIntegration(
  options: RemoteMdxOptions = {},
): AstroIntegration {
  return {
    name: 'astro-remote-mdx',
    hooks: {
      'astro:config:setup': ({
        injectScript,
        command,
        updateConfig,
        config,
      }) => {
        // Only run the React Refresh preamble in local development
        if (command === 'dev') {
          try {
            injectScript('page', preamble);
          } catch (error) {
            console.error(
              '[astro-remote-mdx] Failed to read or inject React Refresh preamble:',
              error,
            );
          }
        }

        updateConfig({
          vite: {
            plugins: [
              virtualMdxComponentsPlugin(options.configFilePath, config)
            ],
          },
        });
      },
    },
  };
}