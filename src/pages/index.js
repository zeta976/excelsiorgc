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
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Featured (first) article */}
        {articles[0] && (
          <div className="md:col-span-3 md:row-span-2 bg-white border border-neutral-200 rounded-lg shadow-sm p-6 flex flex-col justify-between">
            {articles[0].featured_image && (
              <img src={articles[0].featured_image} alt="Featured" className="w-full h-48 object-cover rounded mb-4" />
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
        {/* Next two articles as medium cards */}
        {articles.slice(1, 3).map(article => (
          <div key={article.slug} className="md:col-span-3 bg-white border border-neutral-200 rounded-lg shadow-sm p-5 flex flex-col">
            {article.featured_image && (
              <img src={article.featured_image} alt="Featured" className="w-full h-32 object-cover rounded mb-3" />
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
        {/* Remaining articles as small cards */}
        {articles.slice(3).map(article => (
          <div key={article.slug} className="md:col-span-2 bg-white border border-neutral-200 rounded-lg shadow-sm p-4 flex flex-col">
            {article.featured_image && (
              <img src={article.featured_image} alt="Featured" className="w-full h-24 object-cover rounded mb-2" />
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
    </main>
  );
}
