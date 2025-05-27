import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-50 border-t border-neutral-200 mt-16 py-8">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image src="/gc.png" alt="School Logo" width={48} height={48} className="object-contain" />
          <span className="text-neutral-700 font-serif text-lg font-semibold">Colegio Guadalajara</span>
        </div>
        <div className="text-neutral-500 text-sm text-center">
          &copy; {new Date().getFullYear()} Excelsior Newspaper. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
