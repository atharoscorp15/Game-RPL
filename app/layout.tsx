import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Logic Flow Challenge',
  description: 'Unplugged Programming Game by Dahril Falah',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 min-h-screen flex flex-col">
        {/* Navbar akan selalu muncul di atas di semua halaman */}
        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Footer sederhana untuk identitas */}
        <footer className="py-4 text-center border-t border-slate-200 bg-white">
          <p className="text-slate-400 text-[10px]">
            Dahril Falah Ramadhan Mufa - 24050974015
          </p>
        </footer>
      </body>
    </html>
  );
}