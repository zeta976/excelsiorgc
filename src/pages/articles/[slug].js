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
  // Ensure date is a string (not a Date object)
  if (data.date && typeof data.date !== 'string') {
    data.date = String(data.date);
  }
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
      <div className="border-t border-neutral-200 mb-8"></div>
      {frontmatter.section && (
        <div className="mb-2">
          <span className="uppercase tracking-wide font-bold text-primary mr-2 text-sm">{frontmatter.section}</span>
        </div>
      )}
      <h1 className="text-4xl font-serif font-black mb-2 tracking-tight text-neutral-900">{frontmatter.title}</h1>
      <div className="text-neutral-500 text-sm mb-4">
        {frontmatter.author && <span>By {frontmatter.author} | </span>}
        {frontmatter.date && <span>{new Date(frontmatter.date).toLocaleDateString()}</span>}
      </div>
      {frontmatter.tags && (
        <div className="mb-4">
          {frontmatter.tags.map(tag => (
            <span key={tag} className="inline-block bg-neutral-200 rounded px-2 py-1 text-xs mr-2">{tag}</span>
          ))}
        </div>
      )}
      {frontmatter.featured_image && (
        <img src={frontmatter.featured_image} alt="Featured" className="mb-6 rounded shadow" />
      )}
      <article className="prose max-w-none text-neutral-900" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}
