"use client"
import { motion } from 'framer-motion';

export default function LobbyPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      {/* Efek Lingkaran Berdenyut di Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 text-center max-w-md">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl mb-8"
        >
          🛰️
        </motion.div>
        
        <h1 className="text-4xl font-black mb-4 tracking-tighter">DATA TERKIRIM!</h1>
        <p className="text-slate-400 text-lg mb-10">
          Kelompokmu telah menyelesaikan tantangan. Sekarang, harap tenang dan tunggu pengumuman dari <span className="text-blue-400 font-bold">Admin/Guru</span> di depan kelas.
        </p>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-3 h-3 bg-blue-500 rounded-full" />
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-3 h-3 bg-blue-500 rounded-full" />
            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-3 h-3 bg-blue-500 rounded-full" />
          </div>
          <span className="text-xs text-slate-500 font-mono tracking-[0.3em] uppercase">Menunggu Sesi Reveal...</span>
        </div>
      </div>
      
      <footer className="absolute bottom-8 text-slate-600 text-[10px] font-mono">
        LOGIC FLOW SYSTEM V.1.04 // STATUS: WAIT_FOR_ADMIN_COMMAND
      </footer>
    </div>
  );
}