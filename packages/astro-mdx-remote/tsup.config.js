import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/renderer.ts', 'src/compiler.ts', 'src/hydrator.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  external: ['virtual:mdx-components'],
});
