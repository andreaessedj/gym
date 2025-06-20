"use client";
import Link from "next/link";
import Image from "next/image";

export default function PersonalTrainer() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-100 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6 animate-fadein">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-4 border-cyan-300 max-w-lg w-full p-8 flex flex-col items-center gap-6 animate-pop">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/window.svg"
            alt="Personal Trainer Icon"
            width={80}
            height={80}
            className="mb-2 drop-shadow-lg"
            priority
          />
          <h1 className="text-3xl font-extrabold text-cyan-700 mb-2 text-center">Consulenza Personal Trainer</h1>
        </div>
        <div className="w-full flex flex-col items-center gap-4">
          <Image
            src="/globe.svg"
            alt="Allenamento Online"
            width={120}
            height={120}
            className="rounded-xl shadow-md border-2 border-cyan-200 dark:border-cyan-700"
          />
          <p className="text-lg text-gray-700 dark:text-gray-200 text-center">
            Ottieni un supporto professionale e personalizzato per raggiungere i tuoi obiettivi di fitness!<br />
            Il nostro servizio di consulenza ti mette in contatto con un <span className="font-bold text-cyan-700">Personal Trainer qualificato</span> che ti seguirà passo dopo passo.
          </p>
        </div>
        <div className="w-full flex flex-col gap-4 mt-2">
          <h2 className="text-xl font-bold text-pink-600 text-center">Come funziona?</h2>
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
              Dopo il pagamento, verrai messo in contatto con un Personal Trainer per una consulenza personalizzata, via email o videochiamata.
            </li>
          </ol>
        </div>
        <div className="w-full flex flex-col items-center gap-2 mt-4">
          <Image
            src="/file.svg"
            alt="Consulenza Online"
            width={60}
            height={60}
            className="mb-2"
          />
          <p className="text-base text-gray-600 dark:text-gray-300 text-center">
            <span className="font-bold text-cyan-700">Cosa include la consulenza?</span><br />
            • Analisi personalizzata del tuo stato di forma<br />
            • Programma di allenamento su misura<br />
            • Risposte a dubbi e domande<br />
            • Supporto motivazionale
          </p>
        </div>
        <div className="flex gap-4 mt-6">
          <Link href="/" className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 text-lg">Torna alla Home</Link>
        </div>
      </div>
    </div>
  );
}
