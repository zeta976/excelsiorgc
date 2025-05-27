import Link from 'next/link';
import Image from 'next/image';

function getToday() {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Navbar({ sections }) {
  return (
    <nav className="navbar w-full bg-white border-b border-neutral-200 mb-8">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center pt-6 pb-4">
        {/* Top Row: Date & Search */}
        <div className="w-full flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <span>{getToday()}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-500 text-sm cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
            <span className="hidden sm:inline">Search</span>
          </div>
        </div>
        {/* Centered Logo */}
        <Link href="/" className="flex items-center justify-center w-full">
          <Image src="/excelsior.png" alt="Excelsior Newspaper Logo" width={360} height={360} className="rounded object-contain max-h-[120px] max-w-[340px] mx-auto" priority />
        </Link>
        {/* Section Links */}
        <div className="w-full flex flex-wrap justify-center gap-6 mt-4">
          <Link href="/articles" className="font-serif text-lg font-bold text-neutral-900 border-b-2 border-transparent hover:border-primary transition-all pb-1">Articles</Link>
          {sections && sections.map(section => (
            <Link
              key={section}
              href={`/section/${section.toLowerCase()}`}
              className="capitalize font-serif text-lg text-neutral-800 font-bold border-b-2 border-transparent hover:border-primary hover:text-primary transition-all pb-1"
            >
              {section}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
