"use client";
import Link from "next/link";

export default function PersonalTrainer() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-100 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6 animate-fadein">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-4 border-cyan-300 max-w-lg w-full p-8 flex flex-col items-center gap-6 animate-pop">
        <h1 className="text-3xl font-extrabold text-cyan-700 mb-2 text-center">Consulenza Personal Trainer</h1>
        <p className="text-lg text-gray-700 dark:text-gray-200 text-center">
          Vuoi un supporto professionale e personalizzato per il tuo allenamento? Prenota una consulenza con un Personal Trainer qualificato!
        </p>
        <ol className="text-left text-gray-700 dark:text-gray-200 list-decimal list-inside space-y-2">
          <li>
            Effettua il pagamento di <span className="font-bold text-pink-600">20 €</span> tramite PayPal al seguente link:
            <br />
            <a
              href="https://www.paypal.me/andreaesse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 underline font-bold hover:text-pink-500 transition-colors"
            >
              www.paypal.me/andreaesse
            </a>
          </li>
          <li>
            Nella causale del pagamento inserisci:
            <span className="block mt-1 p-2 bg-cyan-50 dark:bg-gray-800 rounded text-sm font-mono text-cyan-800 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-700">
              La tua email + &quot;Personal Trainer&quot;
            </span>
            <span className="block mt-1 text-xs text-gray-500">Esempio: mario.rossi@email.com Personal Trainer</span>
          </li>
          <li>
            Dopo il pagamento, verrai messo in contatto con un Personal Trainer per la tua consulenza personalizzata.
          </li>
        </ol>
        <div className="flex gap-4 mt-6">
          <Link href="/" className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 text-lg">Torna alla Home</Link>
        </div>
      </div>
    </div>
  );
}
