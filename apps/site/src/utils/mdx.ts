import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { MDXContent } from 'mdx/types';

export async function compileMdx(content: string): Promise<MDXContent> {
  const compiled = String(
    await compile(content, {
      outputFormat: 'function-body',
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'prepend' }],
      ],
    }),
  );

  const { default: MDXContent } = await run(compiled, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return MDXContent;
}
