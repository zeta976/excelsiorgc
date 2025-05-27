import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export async function getStaticProps() {
  const articlesDir = path.join(process.cwd(), 'src', 'content', 'articles');
  const filenames = fs.readdirSync(articlesDir);
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
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return {
    props: {
      articles,
    },
  };
}

export default function ArticlesIndex({ articles }) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Articles</h1>
      <ul>
        {articles.map(article => (
          <li key={article.slug} className="mb-8 border-b pb-6">
            <Link href={`/articles/${article.slug}`}
              className="text-2xl font-semibold text-blue-700 hover:underline">
              {article.title}
            </Link>
            <div className="text-gray-500 text-sm mb-2">
              {article.author && <span>By {article.author} | </span>}
              {article.date && <span>{new Date(article.date).toLocaleDateString()}</span>}
              {article.section && <span> | {article.section}</span>}
            </div>
            <div className="mb-2 text-gray-700 text-sm">
              {article.excerpt}
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="mb-2">
                {article.tags.map(tag => (
                  <span key={tag} className="inline-block bg-gray-200 rounded px-2 py-1 text-xs mr-2">{tag}</span>
                ))}
              </div>
            )}
            {article.featured_image && (
              <img src={article.featured_image} alt="Featured" className="mb-2 rounded shadow max-h-48" />
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
