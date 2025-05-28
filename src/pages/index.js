import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';
import AdSlot from '../components/AdSlot';
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
      {/* Top row: featured + 2 right */}
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8 gap-10 mb-8">
        {/* Featured (first) article */}
        {articles[0] && (
          <div className="md:col-span-7 border-b border-neutral-300 pb-4 mb-4 md:mb-0 md:pb-0 md:border-b-0 md:border-r md:pr-8">
            {articles[0].featured_image && (
              <Image src={articles[0].featured_image} alt="Featured" className="w-full h-64 object-cover mb-2" width={900} height={320} style={{objectFit: 'cover'}} />
            )}
            <Link href={`/articles/${articles[0].slug}`} className="text-3xl font-serif font-black text-neutral-900 hover:text-primary transition-colors mb-1 block">
              {articles[0].title}
            </Link>
            <div className="text-neutral-500 text-sm mb-1 mt-1">
              {articles[0].section && <span className="uppercase tracking-wide font-bold text-primary mr-2">{articles[0].section}</span>}
              {articles[0].author && <span>By {articles[0].author} | </span>}
              {articles[0].date && <span>{new Date(articles[0].date).toLocaleDateString()}</span>}
            </div>
            <div className="mb-1 text-neutral-800 text-base prose max-w-none" dangerouslySetInnerHTML={{ __html: articles[0].excerptHtml }} />
            {articles[0].tags && articles[0].tags.length > 0 && (
              <div className="mb-1">
                {articles[0].tags.map(tag => (
                  <span key={tag} className="inline-block bg-neutral-200 rounded px-2 py-1 text-xs mr-2">{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Next two articles stacked on the right */}
        {/* Right column: next two articles stacked */}
        <div className="md:col-span-5 flex flex-col gap-4 border-b md:border-b-0 md:border-l border-neutral-300 md:pl-8 pb-6 md:pb-0">
          {articles[1] && (
            <div>
              {articles[1].featured_image && (
                <Image src={articles[1].featured_image} alt="Featured" className="w-full h-32 object-cover mb-3" width={600} height={128} style={{objectFit: 'cover'}} />
              )}
              <Link href={`/articles/${articles[1].slug}`} className="text-xl font-serif font-bold text-neutral-900 hover:text-primary transition-colors mb-1 block">
                {articles[1].title}
              </Link>
              <div className="text-neutral-500 text-xs mb-1 mt-0.5">
                {articles[1].section && <span className="uppercase tracking-wide font-bold text-primary mr-2">{articles[1].section}</span>}
                {articles[1].author && <span>By {articles[1].author} | </span>}
                {articles[1].date && <span>{new Date(articles[1].date).toLocaleDateString()}</span>}
              </div>
              <div className="mb-1 text-neutral-800 text-sm prose max-w-none">
                {(() => {
                  // Strip HTML tags and limit to 35 words
                  const plainText = articles[1].excerptHtml.replace(/<[^>]+>/g, '');
                  const words = plainText.split(/\s+/).slice(0, 35).join(' ');
                  return words + (plainText.split(/\s+/).length > 35 ? '…' : '');
                })()}
              </div>
            </div>
          )}
          {articles[2] && (
            <div>
              {articles[2].featured_image && (
                <Image src={articles[2].featured_image} alt="Featured" className="w-full h-32 object-cover mb-3" width={600} height={128} style={{objectFit: 'cover'}} />
              )}
              <Link href={`/articles/${articles[2].slug}`} className="text-xl font-serif font-bold text-neutral-900 hover:text-primary transition-colors mb-1 block">
                {articles[2].title}
              </Link>
              <div className="text-neutral-500 text-xs mb-1 mt-0.5">
                {articles[2].section && <span className="uppercase tracking-wide font-bold text-primary mr-2">{articles[2].section}</span>}
                {articles[2].author && <span>By {articles[2].author} | </span>}
                {articles[2].date && <span>{new Date(articles[2].date).toLocaleDateString()}</span>}
              </div>
              <div className="mb-1 text-neutral-800 text-sm prose max-w-none">
                {(() => {
                  // Strip HTML tags and limit to 35 words
                  const plainText = articles[2].excerptHtml.replace(/<[^>]+>/g, '');
                  const words = plainText.split(/\s+/).slice(0, 35).join(' ');
                  return words + (plainText.split(/\s+/).length > 35 ? '…' : '');
                })()}
              </div>
            </div>
          )}
        </div>  

        {/* Homepage Banner Ad */}
        <div className="md:col-span-12">
          <AdSlot position="homepage-banner" />
        </div>
      </div>
      {/* Lower grid for remaining articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-neutral-300 pt-8">
        {articles.slice(3).map(article => (
          <div key={article.slug} className="">
            {article.featured_image && (
              <Image src={article.featured_image} alt="Featured" className="w-full h-24 object-cover mb-2" width={600} height={96} style={{objectFit: 'cover'}} />
            )}
            <Link href={`/articles/${article.slug}`} className="text-lg font-serif font-bold text-neutral-900 hover:text-primary transition-colors mb-1 block">
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
