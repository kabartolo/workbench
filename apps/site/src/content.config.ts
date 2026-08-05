import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { packageDocsLoader } from './github-loader.js';

import { devToLoaderBase, devToLoaderRehype } from './markdown-loaders.js';

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

const packageDocs = defineCollection({
  loader: packageDocsLoader([
    {
      repo: 'kabartolo/astro-mdx-remote',
      path: 'docs/api',
    },
  ]),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      markdown: z.string(),
      slug: z.string(),
    }),
});

export const collections = {
  packageDocs,
  docs,
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
};
