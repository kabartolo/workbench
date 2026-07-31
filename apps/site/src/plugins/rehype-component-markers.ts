// src/plugins/rehype-component-markers.ts

// For experiments only

import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

export default function rehypeComponentMarkers() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      // --- IMG ---
      if (node.tagName === 'img') {
        node.properties = {
          ...node.properties,
          'data-component': 'image',
          // src and alt are already in properties
        };
      }

      // --- PRE / CODE BLOCKS ---
      // Markdown code fences produce <pre><code class="language-js">
      if (node.tagName === 'pre') {
        const codeChild = node.children.find(
          (child): child is Element =>
            child.type === 'element' && child.tagName === 'code',
        );
        const lang =
          codeChild?.properties?.className
            ?.toString()
            .replace('language-', '') ?? 'text';

        node.properties = {
          ...node.properties,
          'data-component': 'code-block',
          'data-language': lang,
        };
      }

      // --- BLOCKQUOTE (Note/Aside) ---
      // Convention: > **Note:** or > **Warning:** etc.
      if (node.tagName === 'blockquote') {
        // Try to detect the type from the first strong element
        let kind = 'note'; // default
        visit(node, 'element', (child: Element) => {
          if (child.tagName === 'strong') {
            const text = child.children
              .filter((n) => n.type === 'text')
              .map((n) => (n as { value: string }).value)
              .join('')
              .toLowerCase()
              .replace(':', '');
            if (['note', 'warning', 'tip', 'danger'].includes(text)) {
              kind = text;
            }
          }
        });

        node.properties = {
          ...node.properties,
          'data-component': 'note',
          'data-kind': kind,
        };
      }

      // --- LINKS ---
      if (node.tagName === 'a') {
        const href = node.properties?.href?.toString() ?? '';
        const isExternal = href.startsWith('http');

        node.properties = {
          ...node.properties,
          'data-component': 'link',
          'data-external': isExternal ? 'true' : 'false',
        };
      }
    });
  };
}
