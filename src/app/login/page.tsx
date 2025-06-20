"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://seweuyiyvicoqvtgjwss.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNld2V1eWl5dmljb3F2dGdqd3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODkxMDQsImV4cCI6MjA1OTc2NTEwNH0.VmAIM06-p4MZz8fxB3HbTzo1QiA9-JBoabp-Aehu2ko';
const supabase = createClient(supabaseUrl, supabaseKey);

interface UserProgress {
  nome: string;
  eta: number;
  peso: number;
  altezza: number;
  obiettivo: string;
  email: string;
  completed_days?: number[];
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<UserProgress | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUserData(null);
    const { data, error } = await supabase
      .from('utenti_progressi')
      .select('*')
      .eq('email', email)
      .single();
    setLoading(false);
    if (error || !data) {
      setError("Nessun utente trovato con questa email.");
    } else {
      setUserData(data);
      localStorage.setItem("userData", JSON.stringify({
        nome: data.nome,
        eta: data.eta,
        peso: data.peso,
        altezza: data.altezza,
        obiettivi: data.obiettivo ? [data.obiettivo] : [],
      }));
      localStorage.setItem("userEmail", data.email);
      if (data.completed_days) {
        localStorage.setItem("progress", JSON.stringify({
          completed: Array.isArray(data.completed_days) ? Array(28).fill(false).map((_,i) => data.completed_days.includes(i+1)) : Array(28).fill(false),
          skipped: Array(28).fill(false)
        }));
      }
      setTimeout(() => router.push("/"), 1200);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-200 to-blue-300 dark:from-gray-900 dark:to-gray-800 animate-fadein">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-cyan-300 animate-pop">
        <h1 className="text-3xl font-extrabold text-cyan-700 mb-6 text-center">Accedi ai tuoi progressi</h1>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            className="px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 outline-none text-lg text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
            placeholder="Inserisci la tua email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          <button
            type="submit"
            className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 text-lg tracking-wide disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Caricamento..." : "Accedi"}
          </button>
          <button
            type="button"
            className="mt-2 px-8 py-2 rounded-full border-2 border-cyan-400 text-cyan-700 dark:text-cyan-200 bg-white dark:bg-gray-900 font-semibold shadow hover:bg-cyan-50 dark:hover:bg-gray-800 transition-all duration-200 text-base"
            onClick={() => { window.location.href = "/"; }}
          >
            Prima volta qui?
          </button>
        </form>
        {error && <div className="mt-4 text-red-500 text-center font-bold animate-fadein">{error}</div>}
        {userData && (
          <div className="mt-6 p-4 rounded-xl bg-cyan-50 dark:bg-gray-800 border border-cyan-200 text-cyan-900 dark:text-cyan-100 animate-fadein">
            <div className="font-bold text-lg mb-2">Benvenuto, {userData.nome}!</div>
            <div>Età: {userData.eta} | Peso: {userData.peso} kg | Altezza: {userData.altezza} cm</div>
            <div>Obiettivo: {userData.obiettivo || "-"}</div>
            <div className="mt-2 text-sm text-cyan-700 dark:text-cyan-200">I tuoi progressi sono stati caricati 🎉</div>
          </div>
        )}
      </div>
    </div>
  );
}
