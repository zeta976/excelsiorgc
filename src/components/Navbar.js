import Link from 'next/link';

export default function Navbar({ sections }) {
  return (
    <nav className="w-full bg-white shadow mb-8">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="font-bold text-xl text-blue-800">
          <Link href="/">Excelsior</Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/articles" className="hover:underline font-medium">Articles</Link>
          {sections && sections.map(section => (
            <Link
              key={section}
              href={`/section/${section.toLowerCase()}`}
              className="hover:underline capitalize text-gray-700"
            >
              {section}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
