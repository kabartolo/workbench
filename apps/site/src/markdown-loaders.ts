import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeComponentMarkers from './plugins/rehype-component-markers';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import matter from 'gray-matter';

import type { Loader, LoaderContext } from 'astro/loaders';

// --- Shared ---

interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  published_at: string;
  body_markdown: string;
  body_html: string;
}

// Helper to fetch your draft article specifically
async function fetchDevToDraftArticle(id: string): Promise<Article[]> {
  // Get single draft directly by ID
  const res = await fetch(`https://dev.to/api/articles/${id}`, {
    headers: { 'api-key': import.meta.env.DEVTO_KEY },
  });

  if (!res.ok) {
    // Fallback if singular ID endpoint requires lookup
    const listRes = await fetch('https://dev.to/api/articles/me/unpublished', {
      headers: { 'api-key': import.meta.env.DEVTO_KEY },
    });
    const list = await listRes.json();
    return list.filter((item: Article) => String(item.id) === id);
  }

  const article = await res.json();
  return [article];
}

async function fetchDevToArticles(username: string): Promise<Article[]> {
  const listRes = await fetch(
    `https://dev.to/api/articles?username=${username}`,
  );
  const list = await listRes.json();

  return Promise.all(
    list.map(async (item: { id: number }) => {
      const res = await fetch(`https://dev.to/api/articles/${item.id}`);
      return res.json();
    }),
  );
}

async function parseArticle(
  article: Article,
  {
    parseData,
    generateDigest,
  }: Pick<LoaderContext, 'parseData' | 'generateDigest'>,
) {
  const data = await parseData({
    id: String(article.id),
    data: {
      title: article.title || 'Untitled Draft',
      // Fall back to article.id if slug is missing in draft
      slug: article.slug || String(article.id),
      description: article.description || '',
      publishedAt: article.published_at
        ? new Date(article.published_at)
        : new Date(),
      markdown: matter(article.body_markdown).content || '',
      html: article.body_html || '',
    },
  });

  return { id: String(article.id), data, digest: generateDigest(data) };
}

// --- Loaders ---

export function devToLoaderBase(username: string): Loader {
  return {
    name: 'devto-loader-baseline',
    load: async ({ store, parseData, generateDigest, renderMarkdown }) => {
      const articles = await fetchDevToDraftArticle('4254259');
      store.clear();

      for (const article of articles) {
        const { id, data, digest } = await parseArticle(article, {
          parseData,
          generateDigest,
        });
        store.set({
          id,
          data: {
            ...data,
            slug: 'rendering-remote-content',
          },
          digest,
          rendered: await renderMarkdown(article.body_markdown),
        });
      }
    },
  };
}

export function devToLoaderRehype(username: string): Loader {
  return {
    name: 'devto-loader-rehype',
    load: async ({ store, parseData, generateDigest }) => {
      const articles = await fetchDevToDraftArticle('4254259');
      store.clear();

      for (const article of articles) {
        const { id, data, digest } = await parseArticle(article, {
          parseData,
          generateDigest,
        });
        const { content } = matter(article.body_markdown);

        const file = await unified()
          .use(remarkParse)
          .use(remarkRehype)
          .use(rehypeComponentMarkers)
          .use(rehypeSlug)
          .use(rehypeAutolinkHeadings)
          .use(rehypeStringify)
          .process(content);

        store.set({
          id,
          data: {
            ...data,
            slug: 'rendering-remote-content',
          },
          digest,
          rendered: {
            html: String(file),
            metadata: { headings: [], imagePaths: [], frontmatter: {} },
          },
        });
      }
    },
  };
}
