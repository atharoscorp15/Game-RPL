"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [jawabanList, setJawabanList] = useState<any[]>([]);
  const [pemenang, setPemenang] = useState<any>(null);
  const [showWinner, setShowWinner] = useState(false);

  // Kunci Jawaban untuk Ronde Terakhir (Ronde 3)
  const kunciRonde3 = [
    'if username == "admin":',
    '    if password == "1234":',
    '        print("Berhasil")',
    '    else:',
    '        print("Pass Salah")',
    'else:',
    '    print("User Tidak Ada")'
  ].join('\n');

  useEffect(() => {
    const fetchJawaban = async () => {
      const { data } = await supabase
        .from('jawaban')
        .select('*, profiles(nama)')
        .order('created_at', { ascending: true });
      if (data) setJawabanList(data);
    };

    fetchJawaban();
    // Opsional: Gunakan Realtime Supabase di sini jika ingin otomatis update
  }, []);

  const handleReveal = (data: any) => {
    setPemenang(data);
    setShowWinner(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-blue-500">CONTROL CENTER</h1>
          <p className="text-slate-400 text-sm">Monitoring Logika & Penentuan Pemenang</p>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
          <span className="text-green-500 animate-pulse">●</span> LIVE SESSION
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: DAFTAR JAWABAN MASUK (4/12) */}
        <div className="col-span-4 flex flex-col gap-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Jawaban Masuk</h2>
          <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
            {jawabanList.length === 0 && <p className="text-slate-600 italic">Menunggu kiriman data...</p>}
            {jawabanList.map((j, i) => (
              <div key={i} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded">KELOMPOK {j.kelompok}</span>
                  <button 
                    onClick={() => handleReveal(j)}
                    className="text-[10px] bg-white text-black px-3 py-1 rounded-lg font-bold hover:bg-yellow-400 transition"
                  >
                    PILIH JUARA
                  </button>
                </div>
                <p className="text-sm font-bold mb-2">{j.profiles?.nama}</p>
                <pre className="text-[10px] font-mono text-emerald-500 bg-black/40 p-3 rounded-xl overflow-x-hidden">
                  {j.jawaban.substring(0, 100)}...
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* KOLOM TENGAH: PUSAT REVEAL (4/12) */}
        <div className="col-span-4 flex flex-col items-center justify-center border-x border-slate-800 px-8">
          {!showWinner ? (
            <div className="text-center">
              <div className="text-6xl mb-6 opacity-20">🏆</div>
              <h3 className="text-xl font-bold text-slate-600">Pilih salah satu kelompok di samping untuk ditampilkan di proyektor.</h3>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="text-center w-full"
            >
              <div className="bg-gradient-to-b from-yellow-400 to-orange-600 p-1 rounded-[40px] shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                <div className="bg-slate-900 rounded-[38px] p-8">
                  <p className="text-yellow-500 font-bold tracking-[0.3em] text-xs mb-4 uppercase">The Champion</p>
                  <h2 className="text-4xl font-black mb-2">KELOMPOK {pemenang?.kelompok}</h2>
                  <p className="text-slate-400 mb-6">{pemenang?.profiles?.nama}</p>
                  
                  <div className="bg-black/50 p-4 rounded-2xl border border-slate-800 text-left mb-6">
                    <pre className="text-emerald-400 font-mono text-xs">{pemenang?.jawaban}</pre>
                  </div>

                  <button 
                    onClick={() => setShowWinner(false)}
                    className="text-xs text-slate-500 hover:text-white underline"
                  >
                    Reset Tampilan
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* KOLOM KANAN: KUNCI JAWABAN GURU (4/12) */}
        <div className="col-span-4 flex flex-col gap-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Acuan Guru (Ronde 3)</h2>
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
            <pre className="text-sm font-mono text-blue-400 leading-relaxed">
              {kunciRonde3}
            </pre>
          </div>
          <div className="mt-4 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <p className="text-xs text-blue-400 leading-relaxed">
              <strong>Catatan:</strong> Kelompok yang menang adalah yang memiliki urutan identik dengan kunci di atas dan paling cepat mengumpulkan data.
            </p>
          </div>
        </div>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
}