import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export async function getStaticPaths() {
  const articlesDir = path.join(process.cwd(), 'src', 'content', 'articles');
  const filenames = fs.readdirSync(articlesDir);
  const sections = new Set();

  filenames.forEach(filename => {
    if (filename.endsWith('.md')) {
      const filePath = path.join(articlesDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      if (data.section) {
        sections.add(data.section);
      }
    }
  });

  const paths = Array.from(sections).map(section => ({
    params: { section: section.toLowerCase() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const articlesDir = path.join(process.cwd(), 'src', 'content', 'articles');
  const filenames = fs.readdirSync(articlesDir);
  const sectionName = params.section;
  const articles = filenames
    .filter(fn => fn.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(articlesDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      // Ensure date is a string
      if (data.date && typeof data.date !== 'string') {
        data.date = String(data.date);
      }
      return {
        slug: filename.replace(/\.md$/, ''),
        ...data,
        excerpt: content.substr(0, 200) + (content.length > 200 ? '...' : ''),
      };
    })
    .filter(article => article.section && article.section.toLowerCase() === sectionName)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return {
    props: {
      section: sectionName,
      articles,
    },
  };
}

export default function SectionPage({ section, articles }) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif font-black mb-8 tracking-tight text-neutral-900 capitalize">{section} Articles</h1>
      <ul>
        {articles.map(article => (
          <li key={article.slug} className="mb-10 border-b border-neutral-200 pb-8">
            <Link href={`/articles/${article.slug}`}
              className="text-2xl font-serif font-extrabold text-neutral-900 hover:text-primary transition-colors">
              {article.title}
            </Link>
            <div className="text-neutral-500 text-sm mb-2 mt-1">
              {article.section && <span className="uppercase tracking-wide font-bold text-primary mr-2">{article.section}</span>}
              {article.author && <span>By {article.author} | </span>}
              {article.date && <span>{new Date(article.date).toLocaleDateString()}</span>}
            </div>
            <div className="mb-2 text-neutral-800 text-base prose max-w-none">
              {article.excerpt}
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="mb-2">
                {article.tags.map(tag => (
                  <span key={tag} className="inline-block bg-neutral-200 rounded px-2 py-1 text-xs mr-2">{tag}</span>
                ))}
              </div>
            )}
            {article.featured_image && (
              <img src={article.featured_image} alt="Featured" className="mb-2 rounded shadow max-h-48" />
            )}
          </li>
        ))}
        {articles.length === 0 && (
          <li>No articles found in this section.</li>
        )}
      </ul>
    </main>
  );
}
