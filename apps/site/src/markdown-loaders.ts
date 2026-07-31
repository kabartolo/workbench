import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeComponentMarkers from './plugins/rehype-component-markers';
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
      title: article.title,
      slug: article.slug,
      description: article.description,
      publishedAt: new Date(article.published_at),
      markdown: article.body_markdown,
      html: article.body_html,
    },
  });

  return { id: String(article.id), data, digest: generateDigest(data) };
}

// --- Loaders ---

export function devToLoaderBase(username: string): Loader {
  return {
    name: 'devto-loader-baseline',
    load: async ({ store, parseData, generateDigest, renderMarkdown }) => {
      const articles = await fetchDevToArticles(username);
      store.clear();

      for (const article of articles) {
        const { id, data, digest } = await parseArticle(article, {
          parseData,
          generateDigest,
        });
        store.set({
          id,
          data,
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
      const articles = await fetchDevToArticles(username);
      store.clear();

      for (const article of articles) {
        const { id, data, digest } = await parseArticle(article, {
          parseData,
          generateDigest,
        });

        const file = await unified()
          .use(remarkParse)
          .use(remarkRehype)
          .use(rehypeComponentMarkers)
          .use(rehypeStringify)
          .process(article.body_markdown);

        store.set({
          id,
          data,
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

export function devToLoaderRawMdx(username: string): Loader {
  return {
    name: 'devto-loader-raw-mdx',
    load: async ({ store, parseData, generateDigest }) => {
      const articles = await fetchDevToArticles(username);
      store.clear();

      for (const article of articles) {
        const { id, data, digest } = await parseArticle(article, {
          parseData,
          generateDigest,
        });

        store.set({
          id,
          data,
          digest,
          // Store raw Markdown, rendered at page level
          body: article.body_markdown,
        });
      }
    },
  };
}
