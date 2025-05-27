import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { remark } from 'remark';
import html from 'remark-html';

export async function getStaticProps() {
  const articlesDir = path.join(process.cwd(), 'src', 'content', 'articles');
  const filenames = fs.readdirSync(articlesDir);
  const articles = await Promise.all(
    filenames
      .filter(fn => fn.endsWith('.md'))
      .map(async filename => {
        const filePath = path.join(articlesDir, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        // Ensure date is a string
        if (data.date && typeof data.date !== 'string') {
          data.date = String(data.date);
        }
        // Get first paragraph or first 200 chars for excerpt
        let excerptMd = content.split(/\n\s*\n/)[0];
        if (!excerptMd) excerptMd = content.substr(0, 200);
        const processedExcerpt = await remark().use(html).process(excerptMd);
        const excerptHtml = processedExcerpt.toString();
        return {
          slug: filename.replace(/\.md$/, ''),
          ...data,
          excerptHtml,
        };
      })
  );
  articles.sort((a, b) => (a.date < b.date ? 1 : -1));

  // Get all unique sections
  const sections = Array.from(new Set(articles.map(a => a.section).filter(Boolean)));

  return {
    props: {
      articles: articles.slice(0, 5), // show latest 5
      sections,
    },
  };
}

export default function Home({ articles, sections }) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-serif font-black mb-2 tracking-tight text-neutral-900">Excelsior School Newspaper</h1>
      <p className="mb-8 text-xl text-neutral-700 font-sans max-w-2xl">Welcome to the student-run digital newspaper. Read the latest stories, opinions, humor, sports, and more!</p>
      <nav className="mb-10 flex flex-wrap gap-4">
        <Link href="/articles" className="font-semibold text-neutral-900 border-b-2 border-transparent hover:border-primary transition-all pb-1">All Articles</Link>
        {sections.map(section => (
          <Link
            key={section}
            href={`/section/${section.toLowerCase()}`}
            className="font-semibold text-neutral-900 border-b-2 border-transparent hover:border-primary hover:text-primary transition-all pb-1 capitalize"
          >
            {section}
          </Link>
        ))}
      </nav>
      <h2 className="text-2xl font-serif font-bold mb-6 text-neutral-900">Latest Articles</h2>
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
            <div className="mb-2 text-neutral-800 text-base prose max-w-none" dangerouslySetInnerHTML={{ __html: article.excerptHtml }} />
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
          <li>No articles found.</li>
        )}
      </ul>
    </main>
  );
}
