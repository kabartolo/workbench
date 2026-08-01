/lab/remote-markdown/baseline — what you have now: renderMarkdown → set:html. The naive solution, fully working, no component control.
/lab/remote-markdown/rehype-transform — rehype plugin that enriches the HTML (e.g. adds class, data- attributes, wraps things) before it's stored. Shows what rehype can do, and where it hits the wall.
/lab/remote-markdown/raw-mdx — store raw Markdown, coerce to MDX at render time, use components prop with Astro components.
/lab/remote-markdown/client-islands — rehype plugin emitting marker nodes, client-side JSX components mounted into them. Shows the island escape hatch.
/lab/remote-markdown/ssr-pipeline — SSR variant where you skip the store's rendered field and process on request, showing what that unlocks vs static.