import type { AstroConfig } from 'astro';

const VIRTUAL_MODULE_ID = 'virtual:mdx-components';
const RESOLVED_ID = '\0virtual:mdx-components';

export function virtualMdxComponentsPlugin(
  configFilePath: string = './src/mdx-components.js',
  config: AstroConfig,
) {
  return {
    name: 'vite-plugin-virtual-mdx-components',
    
    resolveId(id: string) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_ID;
    },

    async load(id: string) {
      if (id === RESOLVED_ID) {
        // Use Vite's build context to resolve the path directly from the consumer's root.
        // This handles standard extensions (.js, .ts, .jsx, .tsx) automatically.
        const resolved = await this.resolve(configFilePath, undefined, { skipSelf: true });

        if (!resolved) {
          throw new Error(
            `[astro-mdx-remote] Could not find the component configuration file at "${configFilePath}". Ensure this file exists in your project root.`
          );
        }

        // Return a clean re-export using the fully resolved system path
        return `
          import { components } from '${resolved.id}';
          export default components;
        `;
      }
    },
  };
}