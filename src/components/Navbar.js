import Link from 'next/link';
import Image from 'next/image';

export default function Navbar({ sections }) {
  return (
    <nav className="navbar w-full bg-white border-b border-neutral-200 mb-8">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-20">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src="/excelsior.png" alt="Excelsior Newspaper Logo" width={360} height={360} className="rounded object-contain max-h-[110px] max-w-[240px]" priority />
          </Link>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/articles" className="font-medium text-neutral-900 border-b-2 border-transparent hover:border-primary transition-all pb-1">Articles</Link>
          {sections && sections.map(section => (
            <Link
              key={section}
              href={`/section/${section.toLowerCase()}`}
              className="capitalize text-neutral-800 font-medium border-b-2 border-transparent hover:border-primary hover:text-primary transition-all pb-1"
            >
              {section}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
