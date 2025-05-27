import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { remark } from 'remark';
import html from 'remark-html';
import { useMemo } from 'react';

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
          content,
        };
      })
  );
  articles.sort((a, b) => (a.date < b.date ? 1 : -1));
  return { props: { articles } };
}

export default function SearchPage({ articles }) {
  const router = useRouter();
  const query = router.query.q ? String(router.query.q).toLowerCase() : '';

  const filtered = useMemo(() => {
    if (!query) return [];
    return articles.filter(article => {
      return (
        (article.title && article.title.toLowerCase().includes(query)) ||
        (article.author && article.author.toLowerCase().includes(query)) ||
        (article.section && article.section.toLowerCase().includes(query)) ||
        (article.content && article.content.toLowerCase().includes(query))
      );
    });
  }, [query, articles]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-black mb-8 tracking-tight text-neutral-900">Search Results</h1>
      {query && (
        <div className="mb-6 text-neutral-500 text-base">Results for: <span className="font-semibold text-neutral-800">{router.query.q}</span></div>
      )}
      {filtered.length === 0 ? (
        <div className="text-neutral-500">No articles found.</div>
      ) : (
        <ul>
          {filtered.map(article => (
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
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
