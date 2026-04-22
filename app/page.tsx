import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-4 tracking-tighter">Logic Flow Challenge</h1>
      <p className="text-slate-500 max-w-md mb-8">Uji logika pemrogramanmu bersama tim! Susun kartu, pecahkan masalah Pak RT, dan jadilah juara.</p>
      <Link href="/login">
        <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-700 transition transform hover:-translate-y-1">
          Mulai Permainan
        </button>
      </Link>
    </div>
  );
}