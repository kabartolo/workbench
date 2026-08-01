# astro-remote-mdx

> Work in progress. Will update this spot when release is official!

Render remote MDX content in Astro with server-rendered, interactive React islands.

Highlights:

- Remote MDX content rendered to static HTML at build time
- React components embedded in MDX, server-rendered with *no flash*
- Selective client-side hydration via React islands
- Components registered once in a config file, not on every page

**React only.** Preact and Solid support may come in a future release.

## Why

Astro's built-in MDX tools are designed for local files known at build time.

## Who this is for

Your content either:

- Lives outside your Astro project (in a CMS, a database, a separate Git repo, or fetched at request time)
- Lives in your Astro project but involves too many files to handle at build time

Specific cases:

**The headless CMS**: Content lives in Contentful, Sanity, or Notion. You fetch it as a string at request time. You want to embed interactive components in that content, but Astro's built-in MDX only works with local files.

**The database-driven docs site**: Content is stored as MDX strings in Postgres or a similar store. Each page is a different row. You need to render it with interactive elements without knowing the content at build time.

**The multi-tenant platform**: Different customers have different content. You can't statically generate everything at build time because content changes frequently or is user-specific.

**The Git-as-CMS site**: You fetch raw .mdx files from a GitHub repo at runtime rather than checking them into your Astro project. You want the content to stay in a separate repo from your site.

---

## Installation

```bash
pnpm add astro-remote-mdx
```

or

```bash
npm i astro-remote-mdx
```

---

## Setup

### 1. Add the integration

Add both `@astrojs/react` and `astro-remote-mdx` to your `astro.config.mjs`. Point `configFilePath` at a components file relative to your project root.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import astroRemoteMdx from 'astro-remote-mdx';

export default defineConfig({
  integrations: [
    react(), // Must come first
    astroRemoteMdx({
      configFilePath: './src/mdx-components.js',
    }),
  ],
});
```

### 2. Create your components file

Export a `components` object from the file you pointed at above. Each key is either a component name used directly in MDX, or an HTML element you want to override.

```js
// src/mdx-components.js
import CodeBlock from './components/CodeBlock';

export const components = {
  // Used directly in MDX as <CodeBlock />
  CodeBlock: CodeBlock,

  // HTML element override — maps <pre> to CodeBlock with transformed props
  pre: {
    Component: CodeBlock,
    transform: (props) => ({
      code: props.children?.props?.children ?? '',
      language: props.children?.props?.className?.replace('language-', '') ?? '',
    }),
  },
};
```

For direct component usage, the value is just the component itself. For HTML overrides, pass an object with a `Component` and an optional `transform` function that reshapes the element's props into the ones your component expects.

### 3. Use MDXRenderer

```astro
---
import MDXRenderer from 'astro-remote-mdx/components/MDXRenderer.astro';

const content = `
# Hello World

<CodeBlock language="js" code="console.log('hi')" />
`;
---
<MDXRenderer content={content} />
```

---

## Getting Content

`MDXRenderer` accepts any MDX string without frontmatter. How you get that string is up to you. Use the included `mdxParser` utility to strip frontmatter before passing content in.

> The following examples are currently untested. Better tests coming soon.

### From a local file

```astro
---
import MDXRenderer from 'astro-remote-mdx/components/MDXRenderer.astro';
import { mdxParser } from 'astro-remote-mdx';
import { readFile } from 'node:fs/promises';

const raw = await readFile('./content/my-post.mdx', 'utf-8');
const { content } = mdxParser(raw);
---
<MDXRenderer content={content} />
```

### From a remote API

```astro
---
import MDXRenderer from 'astro-remote-mdx/components/MDXRenderer.astro';
import { mdxParser } from 'astro-remote-mdx';

const response = await fetch('https://your-cms.com/api/posts/my-post');
const { mdx } = await response.json();
const { content } = mdxParser(mdx);
---
<MDXRenderer content={content} />
```

### From a Git repository

```astro
---
import MDXRenderer from 'astro-remote-mdx/components/MDXRenderer.astro';
import { mdxParser } from 'astro-remote-mdx';

const response = await fetch(
  'https://raw.githubusercontent.com/your-org/your-repo/main/docs/guide.mdx'
);
const raw = await response.text();
const { content } = mdxParser(raw);
---
<MDXRenderer content={content} />
```

---

## How It Works

1. The integration registers your components via a virtual Vite module (`virtual:mdx-components`).
2. `MDXRenderer` compiles the MDX string at request or build time, maps each component to a hydration island (`<div class="remote-island">`), and server-renders it to static HTML.
3. A hydrator script picks up each island on the client and calls `hydrateRoot` to make it interactive.

Your page HTML is fully rendered on the server: no layout shift, no flash!

---

## Limitations

- React only (Preact/Solid not yet supported)
- Props passed to components must be JSON-serializable. Functions, class instances, and `undefined` values will be silently dropped
- Components must be registered in your components file. They cannot be passed dynamically at runtime.