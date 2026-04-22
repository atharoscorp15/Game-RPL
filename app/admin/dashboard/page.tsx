"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

// --- KUNCI JAWABAN (Harus sama persis dengan yang di Game) ---
const KUNCI = [
  'forwargaindaftar_warga:ifpenghasilan<1500000andanak>2:print("LayakTerima")else:print("BelumLayak")',
  'total=int(input())iftotal>500000:diskon=total*0.1bayar=total-diskonelse:bayar=total',
  'ifuser=="admin":ifpass=="1234":print("Ok")else:print("No")else:print("Null")',
];

export default function AdminDashboard() {
  const [jawabanSemua, setJawabanSemua] = useState<any[]>([]);
  const [rondeAktif, setRondeAktif] = useState(1);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showWinner, setShowWinner] = useState(false);

  // Fungsi ambil data dari Supabase
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("jawaban")
      .select("*, profiles(nama)")
      .order("created_at", { ascending: true });

    if (data) setJawabanSemua(data);
    if (error) console.error("Error fetch:", error);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Auto-refresh tiap 3 detik
    return () => clearInterval(interval);
  }, []);

  // Fungsi cek apakah jawaban benar (hapus spasi & enter)
  const cekBenar = (teks: string, ronde: number) => {
    if (!teks) return false;
    return teks.replace(/\s/g, "") === KUNCI[ronde - 1];
  };

  // Hitung Total Poin (Semua Ronde)
  const hitungSkor = (nomorKlp: number) => {
    const dataKlp = jawabanSemua.filter((j) => j.kelompok === nomorKlp);
    let skor = 0;
    dataKlp.forEach((j) => {
      if (cekBenar(j.jawaban, j.ronde)) skor += 100;
    });
    return skor;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 font-sans selection:bg-yellow-500">
      {/* --- HEADER COMPACT --- */}
      <div className="max-w-5xl mx-auto flex justify-between items-center bg-slate-900/80 backdrop-blur-md p-4 rounded-[25px] mb-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-xl font-black italic text-xs">
            ADMIN
          </div>
          <div className="flex gap-1 bg-black/40 p-1 rounded-xl">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setRondeAktif(n);
                  setIsRevealed(false);
                }}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                  rondeAktif === n
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                RONDE {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsRevealed(!isRevealed)}
            className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase italic transition-all ${
              isRevealed
                ? "bg-red-500 text-white"
                : "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
            }`}
          >
            {isRevealed ? "Hide Result" : "Reveal Now"}
          </button>
          {rondeAktif === 3 && (
            <button
              onClick={() => setShowWinner(true)}
              className="bg-white text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase italic"
            >
              🏆 Winner
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* --- MONITORING PANEL (dengan tampilan jawaban peserta) --- */}
        <div className="md:col-span-5 space-y-3">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">
            Live Progress Ronde {rondeAktif}
          </h2>

          {[1, 2, 3, 4].map((noKlp) => {
            const hasil = jawabanSemua.find(
              (j) => j.kelompok === noKlp && j.ronde === rondeAktif
            );
            const jawabanTeks = hasil?.jawaban || "";
            const benar = hasil && cekBenar(jawabanTeks, rondeAktif);

            return (
              <motion.div
                layout
                key={noKlp}
                className={`p-4 rounded-3xl border-2 transition-all duration-500 ${
                  isRevealed
                    ? benar
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-red-500 bg-red-500/10"
                    : "border-slate-800 bg-slate-900/50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-black text-sm uppercase tracking-tighter">
                        Kelompok {noKlp}
                      </h3>
                      {isRevealed && hasil && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`text-[10px] font-black px-3 py-1 rounded-full ${
                            benar ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        >
                          {benar ? "CORRECT" : "WRONG"}
                        </motion.span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">
                      {hasil?.profiles?.nama || "Belum submit..."}
                    </p>

                    {/* ===== MENAMPILKAN JAWABAN PESERTA ===== */}
                    {hasil && (
                      <div className="mt-3">
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                          Jawaban dikirim:
                        </p>
                        <pre
                          className={`mt-1 p-2 rounded-xl text-xs font-mono whitespace-pre-wrap break-words border ${
                            isRevealed
                              ? benar
                                ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                                : "bg-red-950/40 border-red-500/50 text-red-300"
                              : "bg-slate-800/50 border-slate-700 text-slate-300"
                          }`}
                        >
                          {jawabanTeks || "<kosong>"}
                        </pre>
                      </div>
                    )}
                  </div>

                  {!hasil && (
                    <div className="w-2 h-2 bg-slate-700 rounded-full animate-pulse mt-2" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* --- CODE REVIEW PANEL (kunci jawaban) --- */}
        <div className="md:col-span-7 bg-slate-900 rounded-[35px] border border-slate-800 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 font-black text-6xl italic">
            CODE
          </div>
          <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6">
            Kunci Jawaban Ronde {rondeAktif}
          </h2>

          <AnimatePresence mode="wait">
            {isRevealed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <pre className="bg-black/50 p-6 rounded-2xl border border-slate-700 font-mono text-sm text-emerald-400 leading-relaxed overflow-x-auto">
                  {KUNCI[rondeAktif - 1].replace(/:/g, ":\n  ")}
                </pre>
              </motion.div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl">
                <p className="text-slate-600 font-black text-xs uppercase italic tracking-widest animate-pulse">
                  Menunggu Reveal...
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- CHAMPION OVERLAY --- */}
      <AnimatePresence>
        {showWinner && (
          <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white text-black p-10 rounded-[50px] w-full max-w-md shadow-2xl text-center"
            >
              <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-8">
                Papan Skor Akhir
              </h1>
              <div className="space-y-3">
                {[1, 2, 3, 4]
                  .sort((a, b) => hitungSkor(b) - hitungSkor(a))
                  .map((no, idx) => (
                    <div
                      key={no}
                      className={`flex justify-between items-center p-5 rounded-3xl ${
                        idx === 0
                          ? "bg-yellow-400 border-2 border-black"
                          : "bg-slate-100"
                      }`}
                    >
                      <span className="font-black text-sm uppercase">
                        Klp {no} {idx === 0 && "👑"}
                      </span>
                      <span className="font-mono font-black">
                        {hitungSkor(no)} PTS
                      </span>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => setShowWinner(false)}
                className="mt-8 text-slate-400 font-black text-[10px] uppercase underline"
              >
                Tutup Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}