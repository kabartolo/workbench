export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  for (const line of markdown.split('\n')) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const text = match[2].trim();
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      headings.push({ depth: match[1].length, slug, text });
    }
  }
  return headings;
}
