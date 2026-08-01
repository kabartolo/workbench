import graymatter from 'gray-matter';

export function mdxParser(rawContent: string) {
  const { data, content } = graymatter(rawContent);

  return { frontmatter: data, content };
}
