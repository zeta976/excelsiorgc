import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export async function getStaticPaths() {
  const articlesDir = path.join(process.cwd(), 'src', 'content', 'articles');
  const filenames = fs.readdirSync(articlesDir);

  const paths = filenames.filter(fn => fn.endsWith('.md')).map(filename => ({
    params: { slug: filename.replace(/\.md$/, '') },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'src', 'content', 'articles', `${params.slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      frontmatter: data,
      contentHtml,
    },
  };
}

export default function ArticlePage({ frontmatter, contentHtml }) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{frontmatter.title}</h1>
      <div className="text-gray-500 text-sm mb-4">
        {frontmatter.author && <span>By {frontmatter.author} | </span>}
        {frontmatter.date && <span>{new Date(frontmatter.date).toLocaleDateString()}</span>}
      </div>
      {frontmatter.section && (
        <div className="mb-2"><span className="bg-blue-200 px-2 py-1 rounded text-xs font-semibold">{frontmatter.section}</span></div>
      )}
      {frontmatter.tags && (
        <div className="mb-4">
          {frontmatter.tags.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 rounded px-2 py-1 text-xs mr-2">{tag}</span>
          ))}
        </div>
      )}
      {frontmatter.featured_image && (
        <img src={frontmatter.featured_image} alt="Featured" className="mb-6 rounded shadow" />
      )}
      <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}
