"use client";
import { useState, useEffect, useRef } from "react";
import { salvaProgressiUtente } from "./supabaseUtils";

// Fix: tipizza userData per evitare errori TS su obiettivi
interface UserData {
  nome: string;
  eta: string;
  peso: string;
  altezza: string;
  obiettivi: string[];
}

const obiettiviList = [
	{ label: "Dimagrire", value: "dimagrire" },
	{ label: "Tonificare", value: "tonificare" },
	{ label: "Aumentare massa", value: "massa" },
	{ label: "Benessere generale", value: "benessere" },
	{ label: "Resistenza", value: "resistenza" },
];

const emptyUserData: UserData = {
	nome: "",
	eta: "",
	peso: "",
	altezza: "",
	obiettivi: [],
};

export default function UserSummaryHeader() {
	const [userData, setUserData] = useState<UserData>(emptyUserData);
	const [showEdit, setShowEdit] = useState(false);
	const [userEmail, setUserEmail] = useState<string>("");

	// Carica da localStorage all'avvio (compatibile con entrambi i formati)
	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				const saved = localStorage.getItem("userData");
				if (saved) {
					const parsed = JSON.parse(saved);
					// Compatibilità: accetta sia {nome,eta,peso,altezza,obiettivi} sia {userName,age,weight,height,goals}
					if (
						parsed && typeof parsed === "object" &&
						((typeof parsed.nome === "string" && typeof parsed.eta === "string") ||
						(typeof parsed.userName === "string" && typeof parsed.age === "string"))
					) {
						const userDataFixed: UserData = {
							nome: parsed.nome ?? parsed.userName ?? "",
							eta: parsed.eta ?? parsed.age ?? "",
							peso: parsed.peso ?? parsed.weight ?? "",
							altezza: parsed.altezza ?? parsed.height ?? "",
							obiettivi: parsed.obiettivi ?? parsed.goals ?? [],
						};
						setUserData(userDataFixed);
					}
				}
			} catch {
				localStorage.removeItem("userData");
				setUserData(emptyUserData);
			}
		}
	}, []);

	// Carica email da localStorage all'avvio
	useEffect(() => {
		if (typeof window !== "undefined") {
			const savedEmail = localStorage.getItem("userEmail");
			if (savedEmail) setUserEmail(savedEmail);
		}
	}, []);

	// Salva email su localStorage quando cambia
	useEffect(() => {
		if (userEmail) {
			localStorage.setItem("userEmail", userEmail);
		}
	}, [userEmail]);

	// Salva progressi automaticamente quando userData cambia e email è presente
	const firstSave = useRef(true);
	useEffect(() => {
		if (
			userEmail &&
			userData.nome &&
			userData.eta &&
			userData.peso &&
			userData.altezza &&
			Array.isArray(userData.obiettivi)
		) {
			if (firstSave.current) {
				firstSave.current = false;
				return;
			}
			salvaProgressiUtente({
				nome: userData.nome,
				eta: Number(userData.eta),
				peso: Number(userData.peso),
				altezza: Number(userData.altezza),
				obiettivo: (userData.obiettivi && userData.obiettivi[0]) || "",
				email: userEmail,
				completed_days: [] // Qui non hai accesso a progress.completed, quindi passo array vuoto
			});
		}
	}, [userData, userEmail]);

	// Salva su localStorage solo se tutti i campi sono compilati
	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			userData.nome &&
			userData.eta &&
			userData.peso &&
			userData.altezza &&
			Array.isArray(userData.obiettivi)
		) {
			localStorage.setItem("userData", JSON.stringify(userData));
		}
	}, [userData]);

	return (
		<div className="flex flex-col items-center flex-1">
			<span className="font-extrabold text-xl text-cyan-700">
				{userData.nome || <span className="text-gray-400">Nome</span>}
			</span>
			<span className="text-gray-700 dark:text-gray-200 text-base">
				Età: {userData.eta || <span className="text-gray-400">--</span>} &nbsp;|&nbsp; Peso: {userData.peso || <span className="text-gray-400">--</span>} kg &nbsp;|&nbsp; Altezza: {userData.altezza || <span className="text-gray-400">--</span>} cm
			</span>
			<span className="italic text-pink-600 text-base">
				{(userData.obiettivi ?? []).length > 0
					? (userData.obiettivi ?? [])
						.map((g) => {
							const obj = obiettiviList.find((o) => o.value === g);
							return obj?.label || g;
						})
						.join(", ")
					: <span className="text-gray-400">Nessun obiettivo</span>}
			</span>
			<div className="flex flex-row gap-2 items-center mt-2">
				<button
					className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold shadow hover:scale-105 transition-all text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
					onClick={() => setShowEdit(true)}
					aria-label="Modifica dati utente"
					type="button"
				>
					Modifica dati
				</button>
				<button
					className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold shadow hover:scale-105 transition-all text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
					onClick={async () => {
						let email = userEmail;
						if (!email) {
							email = prompt('Inserisci la tua email per salvare i progressi:') || "";
							if (!email) return alert('Email obbligatoria!');
							setUserEmail(email);
						}
						const res = await salvaProgressiUtente({
							nome: userData.nome,
							eta: Number(userData.eta),
							peso: Number(userData.peso),
							altezza: Number(userData.altezza),
							obiettivo: (userData.obiettivi && userData.obiettivi[0]) || '',
							email,
							completed_days: [] // Qui non hai accesso a progress.completed, quindi passo array vuoto
						});
						if (res.error) {
							alert('Errore nel salvataggio: ' + res.error.message);
						} else {
							alert('Progressi salvati! Da ora il salvataggio sarà automatico.');
						}
					}}
					aria-label="Salva Progressi"
					tabIndex={0}
					type="button"
				>
					Salva Progressi
				</button>
			</div>
			{/* Modale modifica dati */}
			{showEdit && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein">
					<div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-4 border-cyan-300 flex flex-col animate-pop overflow-hidden p-8">
						<button
							className="absolute top-4 right-4 text-cyan-600 hover:text-pink-500 text-2xl font-bold focus:outline-none z-10"
							onClick={() => setShowEdit(false)}
							aria-label="Chiudi Modifica"
						>
							×
						</button>
						<h2 className="text-2xl font-bold text-cyan-700 mb-4 text-center">
							Modifica dati utente
						</h2>
						<form
							className="flex flex-col gap-4"
							onSubmit={(/* e */) => {
								setShowEdit(false);
							}}
						>
							<input
								className="px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 outline-none text-lg text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
								value={userData.nome}
								onChange={(e) => setUserData((d) => ({ ...d, nome: e.target.value }))}
								required
								maxLength={32}
								placeholder="Nome"
							/>
							<input
								className="px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 outline-none text-lg text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
								value={userData.eta}
								onChange={(e) => setUserData((d) => ({ ...d, eta: e.target.value.replace(/\D/g, "") }))}
								required
								maxLength={2}
								placeholder="Età"
								inputMode="numeric"
							/>
							<input
								className="px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 outline-none text-lg text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
								value={userData.peso}
								onChange={(e) => setUserData((d) => ({ ...d, peso: e.target.value.replace(/\D/g, "") }))}
								required
								maxLength={3}
								placeholder="Peso (kg)"
								inputMode="numeric"
							/>
							<input
								className="px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 outline-none text-lg text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
								value={userData.altezza}
								onChange={(e) => setUserData((d) => ({ ...d, altezza: e.target.value.replace(/\D/g, "") }))}
								required
								maxLength={3}
								placeholder="Altezza (cm)"
								inputMode="numeric"
							/>
							<div className="flex flex-wrap gap-2 justify-center">
								{obiettiviList.map((obj) => (
									<button
										type="button"
										key={obj.value}
										className={`px-4 py-2 rounded-full font-bold border-2 transition-all duration-200 text-sm ${
											(userData.obiettivi ?? []).includes(obj.value)
												? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-cyan-400"
												: "bg-white dark:bg-gray-800 text-cyan-700 border-cyan-200"
										}`}
										onClick={() =>
											setUserData((d) => ({
												...d,
												obiettivi: (d.obiettivi ?? []).includes(obj.value)
													? (d.obiettivi ?? []).filter((x) => x !== obj.value)
													: [...(d.obiettivi ?? []), obj.value],
											}))
										}
									>
										{obj.label}
									</button>
								))}
							</div>
							<button
								type="submit"
								className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-cyan-400 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 text-lg tracking-wide"
							>
								Salva modifiche
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
