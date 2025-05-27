import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-50 border-t border-neutral-200 mt-16 py-8">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image src="/gc.png" alt="School Logo" width={200} height={200} className="object-contain" />
        </div>
        <div className="text-neutral-500 text-sm text-center">
          &copy; {new Date().getFullYear()} Gimnasio Campestre. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
