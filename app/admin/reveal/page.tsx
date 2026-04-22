"use client"
import { useState } from 'react';
import RevealCard from '@/components/RevealCard';

export default function RevealPage() {
  const [revealed, setRevealed] = useState(false);
  const acuanGuru = `for i in range(10):\n  if penghasilan < 1500000 and anak > 2:\n    print("Berhak")\n  else:\n    print("Tidak Berhak")`;

  return (
    <div className="min-h-screen bg-slate-900 p-10 flex flex-col items-center justify-center">
      {!revealed && (
        <button onClick={() => setRevealed(true)} className="bg-pink-600 text-white px-10 py-4 rounded-full font-bold text-xl shadow-[0_0_20px_rgba(219,39,119,0.5)] hover:scale-105 transition">
          👉 Reveal The Truth
        </button>
      )}
      <div className="flex gap-8 w-full max-w-6xl mt-10">
        <div className="w-1/2 bg-slate-800 p-8 rounded-2xl border-2 border-slate-700">
          <h3 className="text-slate-400 font-bold mb-4">Jawaban Acuan (Guru)</h3>
          <pre className="text-emerald-400 font-mono text-sm">{acuanGuru}</pre>
        </div>
        <div className="w-1/2">
           <RevealCard isRevealed={revealed} kelompok={2} jawaban={acuanGuru} />
        </div>
      </div>
    </div>
  );
}