import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import {
  devToLoaderBase,
  devToLoaderRehype,
  devToLoaderRawMdx,
} from './markdown-loaders.js';

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
  devToBaseline: defineCollection({
    loader: devToLoaderBase('kabartolo'),
    schema: z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string(),
      publishedAt: z.date(),
      markdown: z.string(),
      html: z.string(),
    }),
  }),

  devToRehype: defineCollection({
    loader: devToLoaderRehype('kabartolo'),
    schema: z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string(),
      publishedAt: z.date(),
      markdown: z.string(),
      html: z.string(),
    }),
  }),
  devToRaw: defineCollection({
    loader: devToLoaderRawMdx('kabartolo'),
    schema: z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string(),
      publishedAt: z.date(),
      markdown: z.string(),
      html: z.string(),
    }),
  }),
  docs,
};
