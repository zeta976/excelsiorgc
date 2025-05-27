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
        // Get first non-heading, non-empty, non-comment paragraph as excerpt
        let excerptMd = '';
        const paragraphs = content.split(/\n\s*\n/);
        for (let p of paragraphs) {
          const trimmed = p.trim();
          if (!trimmed) continue;
          if (trimmed.startsWith('#')) continue; // skip headings
          if (trimmed.startsWith('<!--')) continue; // skip comments
          excerptMd = trimmed;
          break;
        }
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
      <div className="md:grid md:grid-cols-12 md:gap-8 flex flex-col gap-10">
        {/* Featured (first) article */}
        {articles[0] && (
          <div className="md:col-span-7 border-b border-neutral-300 pb-6 mb-6 md:mb-0 md:pb-0 md:border-b-0 md:border-r md:pr-8">
            {articles[0].featured_image && (
              <img src={articles[0].featured_image} alt="Featured" className="w-full h-64 object-cover mb-4" />
            )}
            <Link href={`/articles/${articles[0].slug}`}
              className="text-3xl font-serif font-black text-neutral-900 hover:text-primary transition-colors mb-2 block">
              {articles[0].title}
            </Link>
            <div className="text-neutral-500 text-sm mb-2 mt-1">
              {articles[0].section && <span className="uppercase tracking-wide font-bold text-primary mr-2">{articles[0].section}</span>}
              {articles[0].author && <span>By {articles[0].author} | </span>}
              {articles[0].date && <span>{new Date(articles[0].date).toLocaleDateString()}</span>}
            </div>
            <div className="mb-2 text-neutral-800 text-base prose max-w-none" dangerouslySetInnerHTML={{ __html: articles[0].excerptHtml }} />
            {articles[0].tags && articles[0].tags.length > 0 && (
              <div className="mb-2">
                {articles[0].tags.map(tag => (
                  <span key={tag} className="inline-block bg-neutral-200 rounded px-2 py-1 text-xs mr-2">{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Homepage Banner Ad */}
        <div className="md:col-span-12">
          <AdSlot position="homepage-banner" />
        </div>
        {/* Next two articles in a column */}
        <div className="md:col-span-5 flex flex-col gap-8">
          {articles.slice(1, 3).map(article => (
            <div key={article.slug} className="border-b md:border-b-0 md:border-l border-neutral-300 md:pl-8 pb-6 md:pb-0">
              {article.featured_image && (
                <img src={article.featured_image} alt="Featured" className="w-full h-32 object-cover mb-3" />
              )}
              <Link href={`/articles/${article.slug}`}
                className="text-xl font-serif font-bold text-neutral-900 hover:text-primary transition-colors mb-1 block">
                {article.title}
              </Link>
              <div className="text-neutral-500 text-xs mb-1 mt-0.5">
                {article.section && <span className="uppercase tracking-wide font-bold text-primary mr-2">{article.section}</span>}
                {article.author && <span>By {article.author} | </span>}
                {article.date && <span>{new Date(article.date).toLocaleDateString()}</span>}
              </div>
              <div className="mb-1 text-neutral-800 text-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: article.excerptHtml }} />
            </div>
          ))}
        </div>
        {/* Remaining articles in a row (or stacked on mobile) */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 border-t border-neutral-300 pt-8">
          {articles.slice(3).map(article => (
            <div key={article.slug} className="">
              {article.featured_image && (
                <img src={article.featured_image} alt="Featured" className="w-full h-24 object-cover mb-2" />
              )}
              <Link href={`/articles/${article.slug}`}
                className="text-lg font-serif font-bold text-neutral-900 hover:text-primary transition-colors mb-1 block">
                {article.title}
              </Link>
              <div className="text-neutral-500 text-xs mb-1 mt-0.5">
                {article.section && <span className="uppercase tracking-wide font-bold text-primary mr-2">{article.section}</span>}
                {article.author && <span>By {article.author} | </span>}
                {article.date && <span>{new Date(article.date).toLocaleDateString()}</span>}
              </div>
              <div className="mb-1 text-neutral-800 text-xs prose max-w-none" dangerouslySetInnerHTML={{ __html: article.excerptHtml }} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
