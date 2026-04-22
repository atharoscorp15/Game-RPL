"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, Reorder, AnimatePresence } from "framer-motion";

const DATA_SOAL = [
  {
    r: 1,
    judul: "Filter Sembako",
    inst: "Bantu Pak RT: Penghasilan < 1.5jt DAN Anak > 2",
    items: [
      { id: "1", c: "for warga in daftar_warga:" },
      { id: "2", c: "    if penghasilan < 1500000 and anak > 2:" },
      { id: "3", c: '        print("Layak Terima")' },
      { id: "4", c: "    else:" },
      { id: "5", c: '        print("Belum Layak")' },
    ],
  },
  {
    r: 2,
    judul: "Sistem Diskon",
    inst: "Diskon 10% jika belanja > 500rb",
    items: [
      { id: "a", c: "total = int(input())" },
      { id: "b", c: "if total > 500000:" },
      { id: "c", c: "    diskon = total * 0.1" },
      { id: "d", c: "    bayar = total - diskon" },
      { id: "e", c: "else:" },
      { id: "f", c: "    bayar = total" },
    ],
  },
  {
    r: 3,
    judul: "Login Berlapis",
    inst: "Nested IF: Cek User 'admin' & Pass '1234'",
    items: [
      { id: "x", c: 'if user == "admin":' },
      { id: "y", c: '    if pass == "1234":' },
      { id: "z", c: '        print("Ok")' },
      { id: "w", c: "    else:" },
      { id: "v", c: '        print("No")' },
      { id: "m", c: "else:" },
      { id: "n", c: '    print("Null")' },
    ],
  },
];

export default function GamePage() {
  const [ronde, setRonde] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [confirm, setConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data);
      setItems([...DATA_SOAL[0].items].sort(() => Math.random() - 0.5));
    };
    init();
  }, [router]);

  // Fungsi menyimpan jawaban ronde saat ini ke database (upsert)
  const saveCurrentRonde = async () => {
    if (!profile) return;
    setIsSaving(true);
    const rondeNum = ronde + 1; // karena ronde state dimulai dari 0
    const jawabanStr = items.map((i) => i.c).join("\n");

    try {
      // Cek apakah sudah ada jawaban untuk user dan ronde ini
      const { data: existing } = await supabase
        .from("jawaban")
        .select("id")
        .eq("user_id", profile.id)
        .eq("ronde", rondeNum)
        .maybeSingle();

      if (existing) {
        // Update jawaban yang sudah ada
        await supabase
          .from("jawaban")
          .update({ jawaban: jawabanStr })
          .eq("id", existing.id);
      } else {
        // Insert jawaban baru
        await supabase.from("jawaban").insert({
          user_id: profile.id,
          kelompok: profile.kelompok,
          ronde: rondeNum,
          jawaban: jawabanStr,
        });
      }
    } catch (error) {
      console.error("Gagal menyimpan jawaban:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const goNext = async () => {
    if (isSaving) return;

    // Simpan jawaban ronde saat ini sebelum pindah
    await saveCurrentRonde();

    if (ronde < 2) {
      // Pindah ke ronde berikutnya
      setRonde((r) => r + 1);
      setItems(
        [...DATA_SOAL[ronde + 1].items].sort(() => Math.random() - 0.5)
      );
    } else {
      // Ronde terakhir, tampilkan konfirmasi
      setConfirm(true);
    }
  };

  const submitFinal = async () => {
    if (isSaving) return;
    // Simpan jawaban ronde terakhir (ronde 3)
    await saveCurrentRonde();
    // Redirect ke lobby setelah sukses
    router.push("/lobby");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-32">
      <div className="max-w-2xl mx-auto mt-10">
        <div className="flex justify-between items-center mb-12 bg-slate-900/50 p-8 rounded-[40px] border border-white/5 backdrop-blur-xl">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black">
              {ronde + 1}
            </div>
            <div>
              <p className="font-black text-lg italic tracking-tighter">
                KELOMPOK {profile?.kelompok}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                {profile?.nama}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full ${
                  i <= ronde
                    ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    : "bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          key={ronde}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-black mb-3 tracking-tighter italic uppercase">
            {DATA_SOAL[ronde].judul}
          </h1>
          <p className="text-slate-500 font-medium italic">
            "{DATA_SOAL[ronde].inst}"
          </p>
        </motion.div>

        <div className="bg-slate-900/80 p-8 rounded-[50px] border border-white/5 shadow-3xl">
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={setItems}
            className="space-y-4"
          >
            {items.map((item) => (
              <Reorder.Item
                key={item.id}
                value={item}
                className="bg-slate-950 p-6 rounded-3xl border border-slate-800 cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-all group"
              >
                <div className="flex gap-6 font-mono text-sm sm:text-base text-emerald-400">
                  <span className="text-slate-800 group-hover:text-blue-500 font-bold transition-colors">
                    ☰
                  </span>
                  {item.c}
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        <div className="fixed bottom-10 left-0 right-0 px-6 max-w-2xl mx-auto flex gap-6">
          {ronde > 0 && (
            <button
              onClick={() => setRonde((r) => r - 1)}
              disabled={isSaving}
              className="flex-1 py-6 bg-slate-800 rounded-3xl font-black text-slate-400 hover:text-white transition disabled:opacity-50"
            >
              KEMBALI
            </button>
          )}
          <button
            onClick={goNext}
            disabled={isSaving}
            className="flex-[2] py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[30px] font-black text-xl shadow-2xl disabled:opacity-50"
          >
            {isSaving
              ? "MENYIMPAN..."
              : ronde < 2
              ? "SIMPAN & LANJUT"
              : "KIRIM SEKARANG"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {confirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white text-slate-900 p-12 rounded-[60px] text-center max-w-sm"
            >
              <div className="text-8xl mb-8">🚀</div>
              <h3 className="text-3xl font-black mb-2 tracking-tighter italic uppercase">
                Selesai?
              </h3>
              <p className="text-slate-400 font-medium mb-10">
                Data akan dikirim ke guru. Tidak ada jalan kembali setelah ini!
              </p>
              <button
                onClick={submitFinal}
                disabled={isSaving}
                className="w-full py-6 bg-blue-600 text-white rounded-[30px] font-black text-xl mb-4 shadow-xl disabled:opacity-50"
              >
                {isSaving ? "MENYIMPAN..." : "YA, KIRIM!"}
              </button>
              <button
                onClick={() => setConfirm(false)}
                className="text-slate-400 font-bold hover:text-slate-900"
              >
                Periksa Ulang
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}