import type { Loader } from 'astro/loaders';
import { mdxParser } from 'astro-mdx-remote';

export function packageDocsLoader(
  repos: { repo: string; path: string }[],
): Loader {
  return {
    name: 'package-docs-loader',
    load: async ({ store }) => {
      store.clear();

      await Promise.all(
        repos.map(async ({ repo, path }) => {
          const files = await fetchFiles(repo, path);

          for (const file of files.filter(
            (f: { type: string; name: string }) =>
              f.type === 'file' && f.name !== 'globals.md',
          )) {
            const raw = await fetch(file.download_url).then((r) => r.text());

            const { frontmatter, content } = mdxParser(raw);
            const bodyWithoutH1 = content.replace(/^#\s+.+\n?/m, '');
            console.log(file.name);
            store.set({
              id: file.name.replace('.md', ''),
              data: {
                title: frontmatter.title,
                description: frontmatter.description || '',
                slug: frontmatter.slug,
                markdown: bodyWithoutH1,
              },
            });
          }
        }),
      );
    },
  };
}

async function fetchFiles(repo: string, path: string): Promise<any[]> {
  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    },
  );
  const entries = await response.json();

  const files = [];
  for (const entry of entries) {
    if (entry.type === 'file') {
      files.push(entry);
    } else if (entry.type === 'dir') {
      const nested = await fetchFiles(repo, entry.path);
      files.push(...nested);
    }
  }
  return files;
}
