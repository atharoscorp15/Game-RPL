"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import GroupSelector from '@/components/GroupSelector';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  // --- STATE MANAGEMENT ---
  const [nama, setNama] = useState('');
  const [kelompok, setKelompok] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  // --- 🔥 FIX AUTO-LOGIN (FORCE LOGOUT) ---
  useEffect(() => {
    const forceLogout = async () => {
      // Kita paksa keluar dari sesi lama agar form login muncul bersih
      await supabase.auth.signOut();
      localStorage.clear(); 
      console.log("Sesi dibersihkan, siap login baru.");
    };
    forceLogout();
  }, []);

  // --- LOGIKA AUTHENTICATION ---
  const handleLogin = async () => {
    setErrorMsg('');
    
    // Validasi Input Dasar
    if (!nama.trim() || nama.length < 3) {
      setErrorMsg('Nama lengkap minimal 3 karakter!');
      return;
    }
    if (!kelompok) {
      setErrorMsg('Silakan pilih nomor kelompokmu!');
      return;
    }

    setIsLoading(true);

    try {
      // 1. CEK LOCK KELOMPOK (Database Integrity)
      // Cek apakah nomor kelompok ini sudah terdaftar atas nama orang lain
      const { data: profileCheck } = await supabase
        .from('profiles')
        .select('nama')
        .eq('kelompok', kelompok)
        .maybeSingle();

      if (profileCheck) {
        if (profileCheck.nama.toLowerCase() !== nama.toLowerCase()) {
          setIsLoading(false);
          setErrorMsg(`Kelompok ${kelompok} sudah ditempati oleh tim "${profileCheck.nama.toUpperCase()}"`);
          return;
        }
      }

      // 2. GENERATE AUTH CREDENTIALS
      // Email unik per kelompok: klp_1@arena.com, klp_2@arena.com, dst.
      const fakeEmail = `klp_${kelompok}_${nama.toLowerCase().replace(/\s/g, '')}@logicflow.app`;
      const fakePassword = `secure_pass_2026_${kelompok}`;

      // 3. PROSES LOGIN / SIGNUP
      const { data: authResult, error: authError } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: fakePassword,
      });

      // Jika user belum ada (Error: Invalid login credentials), kita buat baru
      if (authError) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: fakeEmail,
          password: fakePassword,
        });

        if (signUpError) throw signUpError;

        // Masukkan identitas ke tabel profiles
        if (signUpData.user) {
          const { error: insertError } = await supabase.from('profiles').insert([
            { 
              id: signUpData.user.id, 
              nama: nama.trim(), 
              kelompok: kelompok 
            }
          ]);
          if (insertError) throw insertError;
        }
      }

      // 4. SELESAI & REDIRECT
      router.push('/game');
      router.refresh();

    } catch (err: any) {
      console.error("Auth Error:", err.message);
      setErrorMsg(err.message || "Terjadi kesalahan saat menghubungi server.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      {/* Container Utama */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-white p-12 rounded-[50px] shadow-2xl border border-slate-100 relative overflow-hidden"
      >
        {/* Dekorasi Aksesoris UI */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-50 rounded-full -ml-12 -mb-12" />

        {/* Brand Section */}
        <div className="text-center mb-12 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-6">
            <span className="text-white text-3xl font-black italic tracking-tighter">LF</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Arena Logic</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3">Platform Microteaching 2026</p>
        </div>

        {/* Form Section */}
        <div className="space-y-8 relative z-10">
          {/* Input Nama */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Nama Peserta / Tim
            </label>
            <input 
              type="text" 
              placeholder="Ketik namamu..." 
              autoComplete="off"
              className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[30px] outline-none transition-all font-bold text-slate-800 shadow-inner"
              value={nama} 
              onChange={e => setNama(e.target.value)}
            />
          </div>

          {/* Group Selector */}
          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest text-center block">
              Tentukan Nomor Kelompok
            </label>
            <div className="bg-slate-50/50 p-2 rounded-[35px] border border-slate-100">
              <GroupSelector selectedGroup={kelompok} onSelectGroup={setKelompok} />
            </div>
          </div>

          {/* Alert Error Message */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 p-5 rounded-[25px] border-l-[6px] border-red-500"
              >
                <p className="text-red-600 text-[11px] font-black uppercase italic tracking-wide">
                  ⚠️ {errorMsg}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button 
            onClick={handleLogin} 
            disabled={isLoading}
            className="w-full py-6 bg-slate-900 hover:bg-blue-600 text-white rounded-[35px] font-black text-xl shadow-2xl transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "MENGUNCI SESI..." : "MASUK KE GAME"}
          </button>
        </div>

        <div className="mt-14 text-center">
          <p className="text-slate-300 text-[9px] font-black uppercase tracking-[0.4em]">
            Developed by Dahril Falah • PTI-A 2024
          </p>
        </div>
      </motion.div>
    </div>
  );
}