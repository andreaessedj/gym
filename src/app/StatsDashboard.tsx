"use client";
import { useEffect, useState } from "react";

// Semplice componente dashboard statistiche con grafici SVG animati
export default function StatsDashboard() {
  // Recupera dati da localStorage
  const [progress, setProgress] = useState<{ completed: boolean[]; skipped: boolean[] }>({ completed: [], skipped: [] });
  const [skipLog, setSkipLog] = useState<{ day: number; date: string; reason: string }[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = localStorage.getItem("progress");
      if (p) setProgress(JSON.parse(p));
      const log = localStorage.getItem("skipLog");
      if (log) setSkipLog(JSON.parse(log));
    }
  }, []);

  const completed = progress.completed.filter(Boolean).length;
  const skipped = progress.skipped.filter(Boolean).length;
  const total = progress.completed.length || 28;
  const weekData = Array(4).fill(0).map((_, w) => {
    const start = w * 7;
    const end = start + 7;
    return progress.completed.slice(start, end).filter(Boolean).length;
  });
  // Stima calorie: 120 kcal per workout completato
  const calories = completed * 120;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-4 border-cyan-400 p-8 max-w-2xl w-full flex flex-col items-center gap-6 animate-pop relative">
        <button
          className="absolute top-4 right-4 text-cyan-600 hover:text-pink-500 text-2xl font-bold focus:outline-none"
          onClick={() => window.dispatchEvent(new CustomEvent('closeStats'))}
          aria-label="Chiudi"
        >×</button>
        <h2 className="text-3xl font-extrabold text-cyan-700 mb-2">Statistiche & Risultati</h2>
        <div className="w-full flex flex-col md:flex-row gap-8 justify-between items-center">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-lg font-bold text-green-600">Completati</span>
            <span className="text-4xl font-extrabold text-green-500">{completed}</span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-lg font-bold text-pink-600">Saltati</span>
            <span className="text-4xl font-extrabold text-pink-400">{skipped}</span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-lg font-bold text-yellow-600">Calorie stimate</span>
            <span className="text-4xl font-extrabold text-yellow-400">{calories}</span>
          </div>
        </div>
        {/* Grafico settimanale barre */}
        <div className="w-full mt-6">
          <h3 className="text-lg font-bold text-cyan-700 mb-2">Costanza settimanale</h3>
          <svg width="100%" height="80" viewBox="0 0 320 80">
            {weekData.map((val, i) => (
              <g key={i}>
                <rect x={20 + i * 70} y={80 - val * 15} width="40" height={val * 15} rx="8" fill="#06b6d4" className="transition-all duration-700" />
                <text x={40 + i * 70} y={75} textAnchor="middle" fontSize="14" fill="#334155">W{i + 1}</text>
                <text x={40 + i * 70} y={80 - val * 15 - 5} textAnchor="middle" fontSize="16" fill="#0e7490" fontWeight="bold">{val}</text>
              </g>
            ))}
          </svg>
        </div>
        {/* Timeline giorni completati/skippati */}
        <div className="w-full mt-6">
          <h3 className="text-lg font-bold text-cyan-700 mb-2">Timeline 28 giorni</h3>
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: total }, (_, i) => (
              <span key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow border-2
                ${progress.completed[i] ? 'bg-green-400 border-green-600 text-white' : progress.skipped[i] ? 'bg-pink-300 border-pink-600 text-white' : 'bg-gray-200 border-gray-400 text-gray-500'}`}>{i + 1}</span>
            ))}
          </div>
        </div>
        {/* Badge */}
        <div className="w-full mt-6 flex flex-col items-center">
          <h3 className="text-lg font-bold text-cyan-700 mb-2">Badge sbloccati</h3>
          <div className="flex gap-4 text-3xl">
            {weekData.map((val, i) => val >= 5 ? <span key={i}>🏅</span> : <span key={i} className="opacity-30">🏅</span>)}
            {completed === total ? <span>🏆</span> : <span className="opacity-30">🏆</span>}
          </div>
        </div>
        {/* Log skip motivi */}
        <div className="w-full mt-6">
          <h3 className="text-lg font-bold text-pink-700 mb-2">Motivi giorni saltati</h3>
          <ul className="divide-y divide-pink-200 dark:divide-pink-800">
            {skipLog.length === 0 && <li className="text-sm text-gray-500">Nessun giorno saltato!</li>}
            {skipLog.map((log, idx) => (
              <li key={idx} className="py-2 flex justify-between items-center text-sm">
                <span>Giorno {log.day} ({log.date})</span>
                <span className="italic text-pink-600">{log.reason}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="mt-8 px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-700 text-white font-bold text-lg shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-cyan-300"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('closeStats'));
            window.location.href = '/';
          }}
          aria-label="Torna a Home"
        >
          Torna a Home
        </button>
      </div>
    </div>
  );
}
