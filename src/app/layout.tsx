"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import UserSummaryHeader from "./UserSummaryHeader";
import { useState } from "react";
import dynamic from "next/dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Stato per mostrare/nascondere la dashboard statistiche
  const [showStats, setShowStats] = useState(false);
  // Stato per mostrare/nascondere la modale di condivisione
  const [showShare, setShowShare] = useState(false);
  // Import dinamico per evitare problemi SSR
  const StatsDashboard = dynamic(() => import("./StatsDashboard"), { ssr: false });
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow flex items-center justify-between px-4 py-2 min-h-[120px] mb-8">
          {/* Logo a sinistra */}
          <div className="flex items-center min-w-[140px]">
            <Image
              src="/logo.png"
              alt="GYM KAPPA SIX Logo"
              width={110}
              height={110}
              className="rounded-full shadow-lg"
              priority
            />
          </div>
          {/* Riepilogo utente al centro (client) */}
          <UserSummaryHeader />
          {/* Bottoni a destra */}
          <div className="flex flex-col gap-2 items-end min-w-[160px]">
            <button className="btn-cyan mb-1" aria-label="Statistiche" onClick={() => setShowStats(true)}>
              Statistiche
            </button>
            <button className="btn-pink" aria-label="Condividi progressi" onClick={() => setShowShare(true)}>
              Condividi progressi
            </button>
          </div>
        </header>
        {showStats && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein">
            <div className="relative">
              <StatsDashboard />
              <button
                className="absolute top-2 right-2 text-3xl text-cyan-600 hover:text-pink-500 font-bold bg-white dark:bg-gray-900 rounded-full shadow p-2 focus:outline-none"
                aria-label="Chiudi Statistiche"
                onClick={() => setShowStats(false)}
              >
                ×
              </button>
            </div>
          </div>
        )}
        {showShare && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein">
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-4 border-pink-300 p-8 max-w-md w-full flex flex-col items-center animate-pop">
              <button
                className="absolute top-4 right-4 text-pink-600 hover:text-cyan-500 text-2xl font-bold focus:outline-none z-10"
                aria-label="Chiudi Condividi"
                onClick={() => setShowShare(false)}
              >×</button>
              <h2 className="text-2xl font-bold text-pink-700 mb-4 text-center">Condividi i tuoi progressi</h2>
              <p className="mb-4 text-center text-gray-700 dark:text-gray-200">Condividi i tuoi risultati sui social o copia il link!</p>
              <button
                className="w-full mb-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 text-lg tracking-wide"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'I miei progressi Gym Kappa Six',
                      text: 'Sto seguendo un programma di allenamento di 28 giorni! 💪🏆 Vieni a provarlo anche tu!',
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copiato negli appunti!');
                  }
                }}
                aria-label="Condividi sui social"
              >
                Condividi ora
              </button>
              <button
                className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 to-yellow-300 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 text-lg tracking-wide"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copiato negli appunti!');
                }}
                aria-label="Copia link"
              >
                Copia link
              </button>
            </div>
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
