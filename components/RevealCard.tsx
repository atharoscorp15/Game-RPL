"use client"
import { motion } from 'framer-motion';

export default function RevealCard({ isRevealed, kelompok, jawaban }: { isRevealed: boolean, kelompok: number, jawaban: string }) {
  if (!isRevealed) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-gradient-to-br from-blue-600 to-purple-700 p-1 rounded-2xl shadow-2xl"
    >
      <div className="bg-slate-900 p-8 rounded-xl relative">
        <div className="absolute -top-10 -right-6 text-7xl">👑</div>
        <h3 className="text-3xl text-white font-extrabold mb-2">Kelompok {kelompok} Menang!</h3>
        <pre className="text-blue-300 font-mono text-sm bg-black/30 p-4 rounded-lg border border-slate-700">{jawaban}</pre>
      </div>
    </motion.div>
  );
}