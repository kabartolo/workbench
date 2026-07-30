import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
  // Load Markdown and MDX files in the `src/content/docs/` directory.
  loader: glob({ base: './src/content/docs', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
    }),
});

export const collections = {
  docs,
};
