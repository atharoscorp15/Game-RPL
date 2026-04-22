"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center relative">
      
      {/* Container Kiri: Logo + Tombol Rahasia */}
      <div className="flex items-center">
        <div className="font-bold text-xl tracking-wider">
          <span className="text-blue-500">&lt;</span> LogicFlow <span className="text-blue-500">/&gt;</span>
        </div>

        {/* 🕵️ TOMBOL RAHASIA ADMIN (Biru Tua & Samar) */}
        {/* Posisinya agak ke tengah dari logo */}
        <button 
          onClick={() => router.push('/admin/dashboard')}
          className="ml-12 text-[10px] text-[#1e293b] hover:text-blue-900 transition-colors duration-1000 font-mono tracking-widest cursor-default"
          title="System Trace"
        >
          v.1.0.4-stable
        </button>
      </div>
      
      {/* Container Kanan: Navigasi Umum */}
      <div className="flex items-center">
        <Link href="/" className="text-sm font-medium hover:text-blue-400 transition">
          Beranda
        </Link>
      </div>
    </nav>
  );
}