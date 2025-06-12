"use client";
import { useState, useEffect } from "react";
import StatsDashboard from "./StatsDashboard";

// Tipi per custom workout e challenge
interface CustomExercise {
  name: string;
  desc: string;
  MET: number;
  serie: number;
  reps: number;
  durata: number;
}

// --- STATE E VARIABILI GLOBALI ---
const WORKOUT_DAYS = 28;

// Funzione per caricare i dati utente da localStorage
function getUserDataFromStorage() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('userData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
  }
  return null;
}

const obiettiviList = [
	{ label: "Dimagrire", value: "dimagrire" },
	{ label: "Tonificare", value: "tonificare" },
	{ label: "Aumentare massa", value: "massa" },
	{ label: "Benessere generale", value: "benessere" },
	{ label: "Resistenza", value: "resistenza" },
];

// Sposta la dichiarazione di eserciziBase PRIMA di Home, fuori dal componente, per evitare errori di variabile usata prima della dichiarazione.
const eserciziBase: CustomExercise[] = [
  { name: 'Squat', desc: 'In piedi, gambe divaricate larghezza spalle, piega le ginocchia portando il bacino indietro come per sederti, poi risali.', MET: 5, serie: 3, reps: 15, durata: 10 },
  { name: 'Push Up', desc: 'Mani a terra sotto le spalle, corpo in linea, piega i gomiti abbassando il petto e poi spingi per tornare su.', MET: 8, serie: 3, reps: 12, durata: 10 },
  { name: 'Plank', desc: 'Appoggia avambracci e punte dei piedi a terra, corpo in linea, addome contratto, mantieni la posizione.', MET: 4, serie: 3, reps: 1, durata: 5 },
  { name: 'Jumping Jack', desc: 'In piedi, salta aprendo gambe e braccia, poi ritorna in posizione iniziale.', MET: 7, serie: 3, reps: 20, durata: 5 },
  { name: 'Affondi', desc: 'In piedi, fai un passo avanti piegando entrambe le ginocchia a 90°, poi ritorna e alterna gamba.', MET: 6, serie: 3, reps: 12, durata: 8 },
  { name: 'Crunch', desc: 'Sdraiato a pancia in su, ginocchia piegate, solleva le spalle verso le ginocchia contraendo l’addome.', MET: 5, serie: 3, reps: 20, durata: 6 },
  { name: 'Burpees', desc: 'Da in piedi, accovacciati, porta i piedi indietro in plank, fai un push up, ritorna e salta verso l’alto.', MET: 10, serie: 3, reps: 10, durata: 8 },
  { name: 'Mountain Climber', desc: 'In posizione plank, porta velocemente le ginocchia al petto alternando le gambe.', MET: 8, serie: 3, reps: 20, durata: 6 },
  { name: 'Dip', desc: 'Mani su una sedia dietro di te, gambe avanti, piega i gomiti abbassando il corpo e poi risali.', MET: 6, serie: 3, reps: 12, durata: 6 },
  { name: 'Wall Sit', desc: 'Schiena contro il muro, scivola in basso fino a formare un angolo di 90° con le ginocchia, mantieni.', MET: 5, serie: 3, reps: 1, durata: 5 },
  { name: 'Skipping', desc: 'Corri sul posto sollevando le ginocchia il più possibile verso il petto.', MET: 7, serie: 3, reps: 30, durata: 5 },
  { name: 'Side Plank', desc: 'Sdraiato su un fianco, appoggia avambraccio e piede, solleva il bacino mantenendo il corpo in linea.', MET: 4, serie: 3, reps: 1, durata: 5 },
  { name: 'Russian Twist', desc: 'Seduto, schiena inclinata, piedi sollevati, ruota il busto a destra e sinistra toccando il pavimento.', MET: 6, serie: 3, reps: 20, durata: 6 },
  { name: 'Ponte Glutei', desc: 'Sdraiato, piedi a terra, solleva il bacino contraendo i glutei, poi abbassa lentamente.', MET: 5, serie: 3, reps: 15, durata: 6 },
  { name: 'Bear Crawl', desc: 'A quattro zampe, ginocchia sollevate, cammina avanti e indietro mantenendo il busto basso.', MET: 7, serie: 3, reps: 10, durata: 5 },
  { name: 'Calf Raise', desc: 'In piedi, sollevati sulle punte dei piedi e poi ritorna lentamente sui talloni.', MET: 4, serie: 3, reps: 20, durata: 5 },
  { name: 'Leg Raise', desc: 'Sdraiato, gambe distese, sollevale unite verso l’alto e poi abbassale senza toccare terra.', MET: 6, serie: 3, reps: 15, durata: 6 },
  { name: 'Superman', desc: 'Sdraiato a pancia in giù, solleva contemporaneamente braccia e gambe mantenendo la posizione.', MET: 5, serie: 3, reps: 15, durata: 6 },
  { name: 'Step Up', desc: 'Sali e scendi da un gradino alternando le gambe, schiena dritta.', MET: 6, serie: 3, reps: 15, durata: 8 },
  { name: 'High Knees', desc: 'Corri sul posto portando le ginocchia il più in alto possibile, ritmo sostenuto.', MET: 8, serie: 3, reps: 30, durata: 5 },
  { name: 'Butt Kicks', desc: 'Corri sul posto cercando di toccare i glutei con i talloni.', MET: 7, serie: 3, reps: 30, durata: 5 },
  { name: 'Lateral Lunge', desc: 'In piedi, fai un passo laterale piegando la gamba d’appoggio, l’altra resta tesa, poi ritorna.', MET: 6, serie: 3, reps: 12, durata: 8 },
  { name: 'Reverse Crunch', desc: 'Sdraiato, gambe piegate, porta le ginocchia al petto sollevando il bacino da terra.', MET: 5, serie: 3, reps: 15, durata: 6 },
  { name: 'V-Up', desc: 'Sdraiato, solleva contemporaneamente gambe e busto cercando di toccare le punte dei piedi.', MET: 7, serie: 3, reps: 12, durata: 6 },
  { name: 'Inchworm', desc: 'In piedi, piegati in avanti, cammina con le mani fino a plank e ritorna.', MET: 6, serie: 3, reps: 10, durata: 6 },
  { name: 'Shoulder Tap', desc: 'In plank, tocca con una mano la spalla opposta alternando i lati, mantenendo il corpo fermo.', MET: 6, serie: 3, reps: 20, durata: 5 },
  { name: 'Climber Twist', desc: 'In plank, porta il ginocchio verso il gomito opposto alternando le gambe.', MET: 8, serie: 3, reps: 20, durata: 6 },
  { name: 'Jump Squat', desc: 'Esegui uno squat e poi salta esplosivamente verso l’alto, atterra dolcemente e ripeti.', MET: 9, serie: 3, reps: 12, durata: 6 },
  { name: 'Plank Up Down', desc: 'Alterna plank su avambracci e plank su mani, mantenendo il corpo in linea.', MET: 7, serie: 3, reps: 12, durata: 6 },
  { name: 'Tuck Jump', desc: 'Salta verso l’alto portando le ginocchia al petto, atterra dolcemente.', MET: 10, serie: 3, reps: 10, durata: 5 },
  { name: 'Boxer Shuffle', desc: 'In piedi, sposta il peso da un piede all’altro rapidamente, muovendo leggermente le braccia.', MET: 6, serie: 3, reps: 30, durata: 5 },
  { name: 'Reverse Lunge', desc: 'In piedi, fai un passo indietro piegando entrambe le ginocchia a 90°, poi ritorna e alterna.', MET: 6, serie: 3, reps: 12, durata: 8 },
  { name: 'Flutter Kick', desc: 'Sdraiato, gambe distese, sollevale leggermente e alterna piccoli calci su e giù.', MET: 6, serie: 3, reps: 20, durata: 5 },
  { name: 'Donkey Kick', desc: 'A quattro zampe, slancia una gamba verso l’alto mantenendo il ginocchio piegato, poi alterna.', MET: 5, serie: 3, reps: 15, durata: 6 },
  { name: 'Bird Dog', desc: 'A quattro zampe, estendi contemporaneamente un braccio e la gamba opposta, poi alterna.', MET: 5, serie: 3, reps: 12, durata: 6 },
  { name: 'Heel Touch', desc: 'Sdraiato, ginocchia piegate, tocca i talloni alternando i lati contraendo gli addominali obliqui.', MET: 5, serie: 3, reps: 20, durata: 5 },
  { name: 'Sumo Squat', desc: 'In piedi, gambe molto larghe e punte aperte, esegui uno squat mantenendo la schiena dritta.', MET: 6, serie: 3, reps: 15, durata: 8 },
  { name: 'Diamond Push Up', desc: 'Push up con mani unite a formare un diamante sotto il petto, gomiti vicini al corpo.', MET: 9, serie: 3, reps: 10, durata: 6 },
  { name: 'Triceps Dip', desc: 'Mani su una sedia, gambe avanti, piega i gomiti tenendoli stretti e risali.', MET: 6, serie: 3, reps: 12, durata: 6 },
  { name: 'Lunge Jump', desc: 'Alterna affondi saltando e cambiando gamba a ogni salto.', MET: 10, serie: 3, reps: 10, durata: 6 },
  { name: 'Side Kick', desc: 'In piedi, solleva una gamba lateralmente mantenendo il busto fermo, poi alterna.', MET: 7, serie: 3, reps: 15, durata: 6 },
  { name: 'Standing Crunch', desc: 'In piedi, porta il ginocchio verso il petto e avvicina il gomito opposto, alterna i lati.', MET: 5, serie: 3, reps: 20, durata: 5 },
  { name: 'Oblique Crunch', desc: 'Sdraiato, ginocchia piegate, porta il gomito verso il ginocchio opposto sollevando la spalla.', MET: 6, serie: 3, reps: 15, durata: 6 },
  { name: 'Hip Thrust', desc: 'Schiena su una sedia, piedi a terra, solleva il bacino contraendo i glutei.', MET: 6, serie: 3, reps: 15, durata: 6 },
  { name: 'Frog Jump', desc: 'Accovacciati, tocca terra con le mani e salta in avanti come una rana.', MET: 9, serie: 3, reps: 12, durata: 6 },
  { name: 'Arm Circle', desc: 'In piedi, braccia tese lateralmente, esegui piccoli cerchi in avanti e indietro.', MET: 4, serie: 3, reps: 30, durata: 5 },
  { name: 'Toe Touch', desc: 'In piedi, gambe tese, piegati in avanti e tocca le punte dei piedi con le mani.', MET: 5, serie: 3, reps: 20, durata: 5 },
  { name: 'Pistol Squat', desc: 'Squat su una gamba, l’altra tesa in avanti, scendi lentamente e risali.', MET: 10, serie: 3, reps: 6, durata: 8 },
  { name: 'Wall Push Up', desc: 'Push up con le mani appoggiate al muro, corpo in linea, piega i gomiti e spingi.', MET: 5, serie: 3, reps: 15, durata: 6 },
  { name: 'Bridge March', desc: 'In posizione ponte glutei, solleva alternativamente un piede da terra come se marciassi.', MET: 6, serie: 3, reps: 20, durata: 6 },
  { name: 'Plank Jack', desc: 'In plank, salta aprendo e chiudendo le gambe come un jumping jack.', MET: 8, serie: 3, reps: 15, durata: 6 },
  { name: 'Side Lunge', desc: 'Fai un passo laterale piegando la gamba d’appoggio, l’altra resta tesa, poi ritorna.', MET: 6, serie: 3, reps: 12, durata: 8 },
  { name: 'Seated Knee Tuck', desc: 'Seduto, mani a terra dietro, porta le ginocchia al petto e distendile senza toccare terra.', MET: 6, serie: 3, reps: 15, durata: 6 },
  { name: 'Reverse Plank', desc: 'Seduto, mani dietro, solleva il bacino mantenendo il corpo in linea, sguardo verso l’alto.', MET: 5, serie: 3, reps: 1, durata: 5 },
  { name: 'Star Jump', desc: 'Accovacciato, salta esplodendo in aria con braccia e gambe aperte a stella.', MET: 10, serie: 3, reps: 10, durata: 5 },
  { name: 'Scissor Jump', desc: 'Salta alternando avanti e indietro le gambe come una forbice.', MET: 9, serie: 3, reps: 12, durata: 6 },
  { name: 'Shoulder Bridge', desc: 'Sdraiato, piedi a terra, solleva il bacino e mantieni la posizione, spalle ben appoggiate.', MET: 5, serie: 3, reps: 15, durata: 6 },
  { name: 'Plank Reach', desc: 'In plank, allunga un braccio in avanti alternando i lati, addome contratto.', MET: 7, serie: 3, reps: 12, durata: 6 },
  { name: 'Squat Pulse', desc: 'Esegui uno squat e rimani in basso eseguendo piccoli molleggi.', MET: 7, serie: 3, reps: 20, durata: 6 },
  { name: 'Cossack Squat', desc: 'Gambe molto larghe, piega una gamba e scendi lateralmente, l’altra resta tesa, poi alterna.', MET: 8, serie: 3, reps: 10, durata: 8 },
  { name: 'Reverse Fly', desc: 'In piedi, busto inclinato avanti, braccia tese, apri lateralmente le braccia stringendo le scapole.', MET: 5, serie: 3, reps: 15, durata: 6 },
  { name: 'Plank Twist', desc: 'In plank, ruota il bacino verso destra e sinistra toccando quasi il pavimento.', MET: 7, serie: 3, reps: 12, durata: 6 },
  { name: 'Side Leg Raise', desc: 'Sdraiato su un fianco, solleva la gamba superiore verso l’alto e abbassala lentamente.', MET: 6, serie: 3, reps: 15, durata: 6 },
  { name: 'Standing Oblique Crunch', desc: 'In piedi, porta il gomito verso il ginocchio sollevato lateralmente, alterna i lati.', MET: 6, serie: 3, reps: 15, durata: 6 },
  { name: 'Heel Drop', desc: 'In piedi su un gradino, abbassa i talloni sotto il livello del gradino e risali sulle punte.', MET: 5, serie: 3, reps: 20, durata: 5 },
  { name: 'Plank Shoulder Tap', desc: 'In plank, tocca con una mano la spalla opposta alternando i lati.', MET: 6, serie: 3, reps: 20, durata: 5 },
  { name: 'Squat Kick', desc: 'Esegui uno squat e, risalendo, dai un calcio in avanti alternando le gambe.', MET: 8, serie: 3, reps: 12, durata: 6 },
  { name: 'Bridge Hold', desc: 'Sdraiato, piedi a terra, solleva il bacino e mantieni la posizione.', MET: 5, serie: 3, reps: 1, durata: 5 },
  { name: 'Push Up Rotation', desc: 'Push up, poi ruota il busto verso un lato sollevando il braccio, alterna i lati.', MET: 8, serie: 3, reps: 10, durata: 6 },
  { name: 'Lateral Step', desc: 'In piedi, fai passi laterali a destra e sinistra mantenendo le ginocchia leggermente piegate.', MET: 5, serie: 3, reps: 30, durata: 5 },
  { name: 'Reverse Tabletop', desc: 'Seduto, mani dietro, piedi a terra, solleva il bacino fino a formare un tavolo con il corpo.', MET: 5, serie: 3, reps: 1, durata: 5 },
  { name: 'Single Leg Glute Bridge', desc: 'Sdraiato, una gamba piegata e una tesa, solleva il bacino spingendo con la gamba piegata.', MET: 7, serie: 3, reps: 10, durata: 6 },
  { name: 'Plank Leg Lift', desc: 'In plank, solleva una gamba verso l’alto mantenendo il corpo in linea, alterna.', MET: 7, serie: 3, reps: 12, durata: 6 },
  { name: 'Squat Hold', desc: 'Esegui uno squat e mantieni la posizione in basso per il tempo indicato.', MET: 6, serie: 3, reps: 1, durata: 5 },
  { name: 'Oblique Twist', desc: 'Seduto, schiena inclinata, ruota il busto a destra e sinistra mantenendo l’addome contratto.', MET: 6, serie: 3, reps: 20, durata: 6 },
  { name: 'Standing Calf Raise', desc: 'In piedi, sollevati sulle punte dei piedi e ritorna lentamente sui talloni.', MET: 4, serie: 3, reps: 20, durata: 5 },
  { name: 'Push Up Knee', desc: 'Push up con le ginocchia a terra, corpo in linea, piega i gomiti e spingi.', MET: 6, serie: 3, reps: 15, durata: 6 },
  { name: 'Squat Side Kick', desc: 'Esegui uno squat e, risalendo, dai un calcio laterale alternando le gambe.', MET: 8, serie: 3, reps: 12, durata: 6 },
  { name: 'Bridge Abduction', desc: 'In ponte glutei, apri e chiudi le ginocchia mantenendo il bacino sollevato.', MET: 6, serie: 3, reps: 15, durata: 6 },
  { name: 'Plank Hip Dip', desc: 'In plank su avambracci, ruota il bacino verso destra e sinistra toccando quasi il pavimento.', MET: 7, serie: 3, reps: 12, durata: 6 },
  { name: 'Reverse Lunge Kick', desc: 'Fai un affondo indietro e, risalendo, dai un calcio in avanti con la stessa gamba.', MET: 8, serie: 3, reps: 12, durata: 8 },
  { name: 'Standing Glute Kickback', desc: 'In piedi, slancia una gamba indietro contraendo i glutei, poi alterna.', MET: 6, serie: 3, reps: 15, durata: 6 },
  { name: 'Plank Toe Tap', desc: 'In plank, tocca con il piede il pavimento lateralmente alternando le gambe.', MET: 7, serie: 3, reps: 12, durata: 6 },
  { name: 'Squat Jump Pulse', desc: 'Esegui uno squat, salta e, atterrando, esegui piccoli molleggi in basso.', MET: 10, serie: 3, reps: 10, durata: 6 },
  { name: 'Push Up Shoulder Tap', desc: 'Push up, poi tocca con una mano la spalla opposta alternando i lati.', MET: 8, serie: 3, reps: 12, durata: 6 },
  { name: 'Bridge March Hold', desc: 'In ponte glutei, solleva un piede e mantieni la posizione, poi alterna.', MET: 6, serie: 3, reps: 15, durata: 6 },
  { name: 'Side Plank Reach', desc: 'In side plank, allunga il braccio libero sopra la testa e ritorna.', MET: 6, serie: 3, reps: 12, durata: 6 },
  { name: 'Squat Calf Raise', desc: 'Esegui uno squat e, risalendo, sollevati sulle punte dei piedi.', MET: 7, serie: 3, reps: 15, durata: 6 },
  { name: 'Reverse Crunch Twist', desc: 'Sdraiato, porta le ginocchia al petto e ruota il bacino a destra e sinistra.', MET: 6, serie: 3, reps: 15, durata: 6 },
  { name: 'Plank Knee To Elbow', desc: 'In plank, porta il ginocchio verso il gomito dello stesso lato alternando le gambe.', MET: 7, serie: 3, reps: 12, durata: 6 },
  { name: 'Squat Narrow', desc: 'Squat con piedi uniti, scendi mantenendo le ginocchia allineate.', MET: 6, serie: 3, reps: 15, durata: 8 },
  { name: 'Push Up Wide', desc: 'Push up con mani più larghe delle spalle, scendi e risali mantenendo il corpo in linea.', MET: 8, serie: 3, reps: 12, durata: 6 },
  { name: 'Bridge Squeeze', desc: 'In ponte glutei, stringi le ginocchia tra loro durante la salita.', MET: 6, serie: 3, reps: 15, durata: 6 },
  { name: 'Plank Toe Touch', desc: 'In plank, tocca con la mano la punta del piede opposto alternando i lati.', MET: 7, serie: 3, reps: 12, durata: 6 },
  { name: 'Squat Curtsy', desc: 'In piedi, incrocia una gamba dietro l’altra piegando il ginocchio, poi alterna.', MET: 7, serie: 3, reps: 12, durata: 8 },
  { name: 'Push Up Pike', desc: 'In posizione a V rovesciata, piega i gomiti portando la testa verso terra e risali.', MET: 9, serie: 3, reps: 10, durata: 6 },
  { name: 'Bridge Leg Extension', desc: 'In ponte glutei, estendi una gamba in avanti e mantieni, poi alterna.', MET: 7, serie: 3, reps: 12, durata: 6 },
  { name: 'Plank Side Step', desc: 'In plank, sposta lateralmente un piede alla volta e ritorna.', MET: 7, serie: 3, reps: 12, durata: 6 },
  { name: 'Squat Hold Pulse', desc: 'Mantieni lo squat in basso e esegui piccoli molleggi.', MET: 7, serie: 3, reps: 20, durata: 6 },
  { name: 'Push Up Clap', desc: 'Push up esplosivo con battito delle mani a mezz’aria.', MET: 10, serie: 3, reps: 8, durata: 6 },
  { name: 'Bridge March Pulse', desc: 'In ponte glutei, solleva un piede e molleggia con il bacino, poi alterna.', MET: 6, serie: 3, reps: 15, durata: 6 },
  { name: 'Plank Cross', desc: 'In plank, porta il ginocchio verso il gomito opposto alternando i lati.', MET: 7, serie: 3, reps: 12, durata: 6 },
  { name: 'Squat Sumo Pulse', desc: 'Squat sumo e, in basso, esegui piccoli molleggi.', MET: 8, serie: 3, reps: 15, durata: 8 },
  { name: 'Push Up Staggered', desc: 'Push up con una mano più avanti dell’altra, alterna la posizione.', MET: 8, serie: 3, reps: 10, durata: 6 },
  { name: 'Bridge Hold Pulse', desc: 'Mantieni il ponte glutei e molleggia con il bacino.', MET: 6, serie: 3, reps: 1, durata: 5 },
  { name: 'Plank Spider', desc: 'In plank, porta il ginocchio verso il gomito dello stesso lato, alterna.', MET: 8, serie: 3, reps: 12, durata: 6 },
  { name: 'Squat Jump Hold', desc: 'Esegui uno squat, salta e mantieni la posizione in basso dopo l’atterraggio.', MET: 10, serie: 3, reps: 10, durata: 6 },
  { name: 'Push Up Decline', desc: 'Push up con piedi sollevati su un supporto, corpo in linea.', MET: 9, serie: 3, reps: 10, durata: 6 },
  { name: 'Bridge Hip Abduction', desc: 'In ponte glutei, apri e chiudi le ginocchia mantenendo il bacino sollevato.', MET: 7, serie: 3, reps: 15, durata: 6 },
  { name: 'Plank Pike', desc: 'In plank, solleva il bacino verso l’alto formando una V rovesciata e ritorna.', MET: 7, serie: 3, reps: 12, durata: 6 },
  { name: 'Squat Jump Twist', desc: 'Esegui uno squat, salta e ruota il busto in aria, atterra dolcemente.', MET: 10, serie: 3, reps: 10, durata: 6 },
  { name: 'Push Up Archer', desc: 'Push up spostando il peso su un braccio, l’altro teso lateralmente, alterna.', MET: 10, serie: 3, reps: 8, durata: 6 },
  { name: 'Bridge Leg Curl', desc: 'In ponte glutei, fai scivolare i talloni avanti e indietro mantenendo il bacino sollevato.', MET: 7, serie: 3, reps: 12, durata: 6 },
  { name: 'Plank Dolphin', desc: 'In plank su avambracci, solleva il bacino verso l’alto e ritorna in posizione.', MET: 7, serie: 3, reps: 12, durata: 6 },
];

export default function Home() {
	const [step, setStep] = useState(0);
	const [userName, setUserName] = useState("");
	const [age, setAge] = useState("");
	const [weight, setWeight] = useState("");
	const [height, setHeight] = useState("");
	const [goals, setGoals] = useState<string[]>([]);
	const [activeStep, setActiveStep] = useState(0);
	const [flip, setFlip] = useState(false);
	const [showStats, setShowStats] = useState(false);
	const [progress, setProgress] = useState(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('progress');
			if (saved) return JSON.parse(saved);
		}
		return { completed: Array(WORKOUT_DAYS).fill(false), skipped: Array(WORKOUT_DAYS).fill(false) };
	});
	const [workoutDay, setWorkoutDay] = useState<number|null>(null);
	const [showWorkoutModal, setShowWorkoutModal] = useState(false);
	const [workoutStep, setWorkoutStep] = useState<'preparazione'|'allenamento'|'riepilogo'>('preparazione');
	const [customWorkout, setCustomWorkout] = useState<CustomExercise[]|null>(null);
	const [showCustomModal, setShowCustomModal] = useState(false);
	const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
	const [resting, setResting] = useState(false);
	const [restTimer, setRestTimer] = useState(30);
	const [serieDone, setSerieDone] = useState<{[key:number]:number[]}>({});
	const [showSkipModal, setShowSkipModal] = useState(false);
	const [skipLog, setSkipLog] = useState<{day:number,date:string,reason:string}[]>(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('skipLog');
			if (saved) return JSON.parse(saved);
		}
		return [];
	});
	const [expandedExercise, setExpandedExercise] = useState<string|null>(null);
	// --- STATE per la modale di condivisione ---
	const [showShareModal, setShowShareModal] = useState(false);
	// --- STATE per la modale modifica dati utente ---
	const [showEditUserModal, setShowEditUserModal] = useState(false);
	// Utilizzo showEditUserModal per evitare warning
	if (typeof window !== 'undefined' && showEditUserModal === null) {
		// no-op
	}

	const [pendingRest, setPendingRest] = useState<{show: boolean; seconds: number}>({show: false, seconds: 0});

	// Cambia frase motivazionale ogni 90s
	useEffect(() => {
		if (step === 0 && flip) {
			const t = setTimeout(() => {
				setStep(1);
				setFlip(false);
			}, 700);
			return () => clearTimeout(t);
		}
	}, [flip, setStep, step]);

	useEffect(() => {
		function closeStatsListener() {
			setShowStats(false);
		}
		window.addEventListener('closeStats', closeStatsListener);
		return () => window.removeEventListener('closeStats', closeStatsListener);
	}, [setShowStats]);

	// Caricamento dati utente da localStorage all'avvio
	useEffect(() => {
  if (typeof window !== 'undefined') {
    const userData = getUserDataFromStorage();
    if (userData && userData.userName && userData.age && userData.weight && userData.height && userData.goals) {
      setUserName(userData.userName);
      setAge(userData.age);
      setWeight(userData.weight);
      setHeight(userData.height);
      setGoals(userData.goals);
      setStep(2);
    }
  }
}, []);

// Salva i dati utente su localStorage quando vengono confermati
useEffect(() => {
  if (
    step === 0 &&
    userName &&
    age &&
    weight &&
    height &&
    goals.length > 0 &&
    activeStep === 4 &&
    flip
  ) {
    localStorage.setItem('userData', JSON.stringify({ userName, age, weight, height, goals }));
    setStep(2); // Passa direttamente alla schermata allenamento
  }
}, [step, userName, age, weight, height, goals, activeStep, flip]);

	// Step 0: inserimento dati con stepper animato a schede e flip 3D
	if (step === 0) {
		const steps = [
			{
				label: "Come ti chiami?",
				input: (
					<input
						className="px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 outline-none text-lg text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
						required
						maxLength={32}
						placeholder="Nome"
					/>
				),
				valid: !!userName.trim(),
			},
			{
				label: "Quanti anni hai?",
				input: (
					<input
						className="px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 outline-none text-lg text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
						value={age}
						onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
						required
						maxLength={2}
						placeholder="Età"
						inputMode="numeric"
					/>
				),
				valid: !!age,
			},
			{
				label: "Quanto pesi?",
				input: (
					<input
						className="px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 outline-none text-lg text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
						value={weight}
						onChange={(e) => setWeight(e.target.value.replace(/\D/g, ""))}
						required
						maxLength={3}
						placeholder="Peso (kg)"
						inputMode="numeric"
					/>
				),
				valid: !!weight,
			},
			{
				label: "Quanto sei alto?",
				input: (
					<input
						className="px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 outline-none text-lg text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
						value={height}
						onChange={(e) => setHeight(e.target.value.replace(/\D/g, ""))}
						required
						maxLength={3}
						placeholder="Altezza (cm)"
						inputMode="numeric"
					/>
				),
				valid: !!height,
			},
			{
				label: "Quali sono i tuoi obiettivi?",
				input: (
					<div className="flex flex-wrap gap-2 justify-center">
						{obiettiviList.map((obj) => (
							<button
								type="button"
								key={obj.value}
								className={`px-4 py-2 rounded-full font-bold border-2 transition-all duration-200 text-sm ${
									goals.includes(obj.value)
										? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-cyan-400"
										: "bg-white dark:bg-gray-800 text-cyan-700 border-cyan-200"
								}`}
								onClick={() =>
									setGoals((g) =>
										g.includes(obj.value)
											? g.filter((x) => x !== obj.value)
											: [...g, obj.value]
									)
								}
							>
								{obj.label}
							</button>
						))}
					</div>
				),
				valid: goals.length > 0,
			},
		];

		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-400 to-lime-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-fadein">
				<div className="flex-1 flex flex-col items-center justify-center py-8 px-2 md:px-8 animate-fadein">
					<div className="relative w-full max-w-md mx-auto">
						<div className="flex justify-center mb-8">
							{steps.map((_, i) => (
								<div
									key={i}
									className={`h-2 w-8 mx-1 rounded-full transition-all duration-300 ${
										i <= activeStep
											? "bg-gradient-to-r from-blue-500 to-cyan-400"
											: "bg-gray-300 dark:bg-gray-700"
									}`}
								/>
							))}
						</div>
						<div
							className={`relative perspective-1000 w-full`}
							style={{ minHeight: 320 }}
						>
							<div
								className={`transition-transform duration-700 transform-gpu ${
									flip ? "rotate-y-180" : ""
								}`}
								style={{
									transformStyle: "preserve-3d",
									minHeight: 320,
								}}
							>
								{/* Front: stepper */}
								<div
									className={`absolute inset-0 w-full h-full bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border-4 border-cyan-300 flex flex-col items-center justify-center gap-8 transition-opacity duration-500 ${
										flip ? "opacity-0 pointer-events-none" : "opacity-100"
									}`}
									style={{ backfaceVisibility: "hidden" }}
								>
									<h1 className="text-4xl font-extrabold text-center text-cyan-600 tracking-widest drop-shadow-lg select-none mb-2">
										GYM 28
									</h1>
									<h2 className="text-xl font-bold text-center text-blue-800 mb-2 animate-fadein">
										{steps[activeStep].label}
									</h2>
									<form
										className="flex flex-col gap-6 w-full items-center justify-center"
										onSubmit={(e) => {
											e.preventDefault();
											if (activeStep < steps.length - 1) {
												setActiveStep((s) => s + 1);
											} else if (steps.every((s) => s.valid)) {
												setFlip(true);
											}
										}}
									>
										<div className="w-full flex justify-center">{steps[activeStep].input}</div>
										<div className="flex gap-2 w-full justify-between">
											<button
												type="button"
												className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-800 text-cyan-700 font-bold shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
												onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
												disabled={activeStep === 0}
											>
												Indietro
											</button>
											<button
												type="submit"
												className={`px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 text-lg tracking-wide ${
													!steps[activeStep].valid ? "opacity-50 cursor-not-allowed" : ""
												}`}
												disabled={!steps[activeStep].valid}
											>
												{activeStep === steps.length - 1 ? "Conferma" : "Avanti"}
											</button>
										</div>
									</form>
								</div>
								{/* Back: transizione flip */}
								<div
									className={`absolute inset-0 w-full h-full bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border-4 border-cyan-300 flex flex-col items-center justify-center gap-8 transition-opacity duration-500 ${
										flip ? "opacity-100" : "opacity-0 pointer-events-none"
									}`}
									style={{
										backfaceVisibility: "hidden",
										transform: "rotateY(180deg)",
									}}
								>
									<h2 className="text-2xl font-bold text-center text-blue-800 mb-2 animate-fadein">
										Caricamento...
									</h2>
									<div className="text-lg text-cyan-700 font-semibold text-center mb-4 animate-fadein">
										Attendi un attimo...
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Step 1: suggerimento livello e conferma
	// RIMOSSO: non mostrare più suggerimento livello o selezione livello
	if (step === 1) {
		return null;
	}

	// Step 2: mostra calendario e allenamento
	if (step === 2) {
		return (
			<>
				<button
					className="fixed top-4 right-4 z-50 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 text-lg tracking-wide"
					onClick={() => setShowStats((s) => !s)}
					aria-label="Mostra statistiche"
				>
					{showStats ? "Chiudi Statistiche" : "Statistiche"}
				</button>
				{showStats && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein">
    <div className="relative w-full max-w-2xl h-[90vh] max-h-[600px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-4 border-cyan-300 flex flex-col animate-pop overflow-hidden">
      <button
        className="absolute top-4 right-4 text-cyan-600 hover:text-pink-500 text-2xl font-bold focus:outline-none z-10"
        onClick={() => setShowStats(false)}
        aria-label="Chiudi Statistiche"
      >×</button>
      <div className="flex-1 overflow-y-auto px-4 py-8 md:py-10">
        <StatsDashboard />
      </div>
    </div>
  </div>
)}

				{/* HEADER UTENTE ENERGICO */}
				<div className="w-full max-w-3xl mx-auto mt-8 mb-6 px-6 py-6 rounded-3xl shadow-2xl border-4 border-cyan-300 bg-gradient-to-r from-cyan-400 via-blue-300 to-lime-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col md:flex-row items-center gap-4 md:gap-8 animate-pop">
					<div className="flex-1 flex flex-col items-center md:items-start gap-1">
						<div className="text-2xl font-extrabold text-cyan-900 dark:text-cyan-200 tracking-wide flex items-center gap-2">
							<span className="inline-block text-3xl">👤</span>{userName}
						</div>
						<div className="text-base text-blue-900 dark:text-cyan-100 font-semibold flex gap-4 mt-1">
							<span title="Età" className="flex items-center gap-1">🎂 {age} anni</span>
							<span title="Peso" className="flex items-center gap-1">⚖️ {weight} kg</span>
							<span title="Altezza" className="flex items-center gap-1">📏 {height} cm</span>
						</div>
						<button
							className="mt-2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold shadow hover:scale-105 transition-all text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
							onClick={() => setShowEditUserModal(true)}
							aria-label="Modifica dati utente"
							tabIndex={0}
							type="button"
						>
							Modifica dati
						</button>
						{showEditUserModal && (
  <EditUserModal
    userName={userName}
    age={age}
    weight={weight}
    height={height}
    goals={goals}
    obiettiviList={obiettiviList}
    onClose={() => setShowEditUserModal(false)}
    onSave={(data) => {
      setUserName(data.userName);
      setAge(data.age);
      setWeight(data.weight);
      setHeight(data.height);
      setGoals(data.goals);
      localStorage.setItem('userData', JSON.stringify(data));
      setShowEditUserModal(false);
    }}
  />
)}
					</div>
					<div className="flex-1 flex flex-col items-center md:items-end gap-1">
						<div className="text-base font-bold text-cyan-900 dark:text-cyan-200">Obiettivi:</div>
						<div className="flex flex-wrap gap-2 mt-1">
							{goals.map((g) => {
								const obj = obiettiviList.find(o => o.value === g);
								return (
									<span key={g} className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-400 to-yellow-300 text-white font-bold text-xs shadow animate-pop" aria-label={obj?.label || g}>{obj?.label || g}</span>
								);
							})}
						</div>
					</div>
				</div>

				<div className="w-full flex-1 flex items-center justify-center">
					<div className="w-full max-w-7xl grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-6 px-4 pb-8">
						{Array.from({ length: WORKOUT_DAYS }, (_, i) => {
							const dayStatus = progress.completed[i]
								? "completato"
								: progress.skipped[i]
								? "saltato"
								: "attivo";
							return (
								<div key={i} className="flex flex-col gap-2">
									<button
										className={`group flex flex-col items-center justify-center aspect-square rounded-3xl shadow-xl border-2 transition-all duration-200 font-bold text-lg select-none relative overflow-hidden
											${progress.completed[i]
												? "bg-gradient-to-br from-green-400 to-cyan-300 border-green-600 text-white animate-bounce"
												: progress.skipped[i]
												? "bg-gray-200 border-gray-400 text-gray-500 opacity-60"
												: "bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 border-cyan-300 hover:scale-105 hover:border-blue-500"}
										`}
										onClick={() => {
											setWorkoutDay(i);
											setShowWorkoutModal(true);
											setWorkoutStep('preparazione');
											setCustomWorkout(null); // reset personalizzazione
										}}
										disabled={progress.completed[i]}
										aria-label={`Giorno ${i + 1} ${dayStatus}`}
									>
										<span className="text-3xl font-extrabold mb-1">{i + 1}</span>
										<span className="text-xs font-semibold mb-2">
											{progress.completed[i] ? "Completato" : progress.skipped[i] ? "Saltato" : "Allenati!"}
										</span>
										<div className="absolute bottom-2 right-2">
											{progress.completed[i] ? "✅" : progress.skipped[i] ? "⏭️" : ""}
										</div>
										{/* Badge settimanali */}
										{(i + 1) % 7 === 0 && (
											<span className={`absolute top-2 left-2 text-2xl ${progress.completed[i] ? 'animate-bounce' : ''}`}>{i === 27 ? '🏆' : '🏅'}</span>
										)}
									</button>
									{!progress.completed[i] && !progress.skipped[i] && (
										<button
											className="w-full mt-1 py-1 rounded-full bg-gradient-to-r from-pink-400 to-yellow-300 text-white font-bold shadow hover:scale-105 transition-all text-xs"
											onClick={() => openSkipModal(i)}
											aria-label="Salta giorno"
										>
											Salta giorno
										</button>
									)}
								</div>
							);
						})}
					</div>
				</div>
				{/* Modale allenamento dinamico */}
				{showWorkoutModal && workoutDay !== null && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein">
						<div className="relative w-full max-w-lg h-[90vh] max-h-[600px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-4 border-cyan-300 flex flex-col animate-pop overflow-y-auto p-4 md:p-8">
							<button
								className="absolute top-4 right-4 text-cyan-600 hover:text-pink-500 text-2xl font-bold focus:outline-none z-10"
								onClick={closeWorkoutModal}
								aria-label="Chiudi"
							>×</button>
							{workoutStep === 'preparazione' && (
								<div className="flex flex-col items-center gap-4 animate-fadein w-full">
									<h2 className="text-2xl font-bold text-cyan-700 mb-2">Allenamento Giorno {workoutDay! + 1}</h2>
									<div className="w-full flex flex-col gap-2 mb-2">
										{(customWorkout ? customWorkout : getWorkoutForDay(workoutDay!)).map((ex) => (
											<div key={ex.name} className="rounded-xl p-3 border-2 shadow bg-cyan-50 dark:bg-gray-800 flex flex-col gap-1">
												<div className="font-bold text-cyan-800 dark:text-cyan-200 text-base flex items-center gap-2">
													{ex.name}
													<span className="ml-2 px-2 py-1 rounded-full bg-orange-400 text-white text-xs font-bold animate-pop" title="Calorie per serie">
														🔥 {calcolaCalorie(ex.MET, Number(weight) || 60, ex.durata / ex.serie)} kcal/serie
													</span>
												</div>
												<div className="text-xs text-gray-500">MET: {ex.MET}</div>
												<div className="text-xs text-gray-700 dark:text-gray-200">Serie: {ex.serie} | Ripetizioni: {ex.reps}</div>
											</div>
										))}
									</div>
									<button
										className="mb-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 to-yellow-400 text-white font-bold shadow hover:scale-105 transition-all text-sm"
										onClick={() => {
											setCustomWorkout((customWorkout || getWorkoutForDay(workoutDay!)).map(ex => ({ ...ex })));
											setShowCustomModal(true);
										}}
										aria-label="Personalizza allenamento"
									>Personalizza</button>
									<button
										className="mb-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-cyan-400 text-white font-bold shadow hover:scale-105 transition-all text-lg"
										onClick={() => setWorkoutStep('allenamento')}
										aria-label="Inizia allenamento"
									>Inizia allenamento</button>
								</div>
							)}
							{workoutStep === 'allenamento' && (
								<div className="flex flex-col items-center gap-4 animate-fadein w-full">
									<h2 className="text-2xl font-bold text-cyan-700 mb-2">Allenamento Giorno {workoutDay + 1}</h2>
									{/* Descrizione esercizio attivo sempre visibile */}
									<div className="w-full mb-4 p-4 rounded-xl bg-gradient-to-r from-cyan-200 to-blue-100 dark:from-gray-800 dark:to-gray-900 border-2 border-cyan-300 shadow animate-fadein">
										<div className="font-bold text-cyan-800 dark:text-cyan-200 text-lg flex items-center gap-2">
											<span className="text-2xl">
												{getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Squat') ? '🏋️' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Push') ? '🤸' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Plank') ? '🧘' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Jump') ? '🤾' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Crunch') ? '💪' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Burpees') ? '🔥' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Affondi') ? '🚶' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Dip') ? '🪑' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Wall') ? '🧱' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Skipping') ? '🏃' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Side') ? '↔️' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Russian') ? '🔄' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Ponte') ? '🦵' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Bear') ? '🐻' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Calf') ? '🦶' : getWorkoutForDay(workoutDay)[currentExerciseIdx].name.includes('Leg') ? '🦵' : '🏃‍♂️'}
											</span>
											{getWorkoutForDay(workoutDay)[currentExerciseIdx].name}
										</div>
										<div className="text-sm text-gray-500 mb-1">MET: {getWorkoutForDay(workoutDay)[currentExerciseIdx].MET}</div>
										<div className="text-sm text-gray-700 dark:text-gray-200 mb-2">Serie: {getWorkoutForDay(workoutDay)[currentExerciseIdx].serie} | Ripetizioni: {getWorkoutForDay(workoutDay)[currentExerciseIdx].reps}</div>
									</div>
									<div className="w-full flex flex-col gap-4">
										{getWorkoutWithCalories(workoutDay, Number(weight) || 60).map((ex, exIdx) => (
											<div key={ex.name} className={`rounded-xl p-4 border-2 shadow transition-all ${exIdx === currentExerciseIdx ? 'border-cyan-400 bg-cyan-50 dark:bg-gray-800' : 'border-gray-200 bg-gray-100 dark:bg-gray-900 opacity-60'}`}>
												<div className="font-bold text-cyan-800 dark:text-cyan-200 text-lg flex items-center gap-2">
													{ex.name}
													<span className="ml-2 px-2 py-1 rounded-full bg-orange-400 text-white text-xs font-bold animate-pop" title="Calorie per serie">
														🔥 {ex.caloriePerSerie} kcal/serie
													</span>
												</div>
												<div className="text-xs text-gray-500 mb-1">MET: {ex.MET}</div>
												<div className="text-sm text-gray-700 dark:text-gray-200 mb-2">Serie: {ex.serie} | Ripetizioni: {ex.reps}</div>
												{exIdx === currentExerciseIdx && (
													<div className="flex flex-col gap-2">
														{Array.from({ length: ex.serie }, (_, s) => (
															<button
																key={s}
																className={`w-full py-2 rounded-lg font-bold border-2 transition-all duration-200 flex items-center justify-between ${serieDone[exIdx]?.includes(s + 1) ? 'bg-green-400/80 border-green-600 text-white line-through' : 'bg-cyan-100 dark:bg-gray-800 border-cyan-300 hover:scale-105 hover:border-blue-500'}`}
																disabled={resting || serieDone[exIdx]?.includes(s + 1)}
																onClick={() => handleSerieDone(exIdx, s + 1, ex.serie)}
																aria-label={`Completa serie ${s + 1}`}
															>
																<span>{`Serie ${s + 1}`}</span>
																<span className="ml-2 px-2 py-1 rounded-full bg-orange-400 text-white text-xs font-bold animate-pop" title="Calorie stimate">
																	{ex.caloriePerSerie} kcal
																</span>
																{serieDone[exIdx]?.includes(s + 1) ? '✓' : ''}
															</button>
														))}
													</div>
												)}
											</div>
										))}
									</div>
									{/* RestTimer overlay */}
    {pendingRest.show && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-4 border-cyan-300 p-8 flex flex-col items-center animate-pop">
          <RestTimer
            seconds={restTimer}
            setRestTimer={setRestTimer}
            onComplete={() => {
              setResting(false);
              setPendingRest({show: false, seconds: 0});
              setRestTimer(30);
            }}
          />
        </div>
      </div>
    )}
								</div>
							)}
							{workoutStep === 'riepilogo' && (
								<div className="flex flex-col items-center gap-4 animate-fadein">
									<h2 className="text-2xl font-bold text-green-600 animate-bounce">Complimenti!</h2>
									<div className="text-lg text-cyan-700 font-semibold text-center">Hai completato l&apos;allenamento del giorno {workoutDay + 1}!</div>
									<span className="text-5xl">🎉</span>
									{/* Riepilogo calorie totali */}
									<div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold text-xl shadow-lg border-4 border-orange-300 animate-pop">
										<span className="text-3xl mr-2">🔥</span>
										Calorie totali stimate: {getWorkoutWithCalories(workoutDay, Number(weight) || 60).reduce((acc, ex) => acc + ex.calorieTotali, 0)} kcal
									</div>
									<button
										className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-cyan-400 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 text-lg tracking-wide"
										onClick={closeWorkoutModal}
									>Chiudi</button>
								</div>
							)}
						</div>
					</div>
				)}
				{/* Modale skip giorno */}
				{showSkipModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein">
						<div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-4 border-pink-300 p-8 max-w-md w-full flex flex-col items-center gap-6 animate-pop relative">
							<button
								className="absolute top-4 right-4 text-pink-600 hover:text-cyan-500 text-2xl font-bold focus:outline-none"
								onClick={() => setShowSkipModal(false)}
								aria-label="Chiudi"
							>×</button>
							<h2 className="text-2xl font-bold text-pink-700 mb-2 text-center">Vuoi saltare questo giorno?</h2>
							<div className="w-full">
								<label className="block text-sm font-bold mb-2 text-pink-700">Motivo (opzionale):</label>
								<div className="flex flex-wrap gap-2 mb-2">
								</div>
								<input
									className="w-full px-3 py-2 rounded-lg border-2 border-pink-200 focus:border-pink-500 outline-none text-sm text-pink-900 dark:text-white bg-white dark:bg-gray-800 shadow"
									placeholder="Altro..."
								/>
							</div>
							<button
								className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 text-lg tracking-wide"
								onClick={confirmSkip}
							>Conferma e Salta</button>
						</div>
					</div>
				)}
				{/* Log skip visualizzazione */}
				<div className="mt-8 w-full max-w-2xl mx-auto flex flex-col items-center justify-center">
					<h4 className="text-lg font-bold text-pink-700 mb-2 text-center">Giorni saltati</h4>
					<ul className="divide-y divide-pink-200 dark:divide-pink-800 w-full text-center">
						{skipLog.length === 0 && <li className="text-sm text-gray-500 py-4">Nessun giorno saltato!</li>}
						{skipLog.map((log, idx) => (
							<li key={idx} className="py-2 flex justify-between items-center text-sm">
								<span>Giorno {log.day} ({log.date})</span>
								<span className="italic text-pink-600">{log.reason}</span>
							</li>
						))}
					</ul>
				</div>
				{/* Elenco esercizi come schede espandibili... */}
				<div className="mt-16 w-full max-w-7xl mx-auto">
					<h3 className="text-2xl font-bold text-cyan-700 mb-6 text-center">Tutti gli esercizi del programma</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
						{eserciziBase.map((ex: CustomExercise) => (
							<div
								key={ex.name}
								className={`group relative transition-all duration-300 rounded-2xl shadow-xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden hover:scale-105 focus-within:scale-105 ${expandedExercise === ex.name ? 'ring-4 ring-cyan-400' : ''}`}
								tabIndex={0}
								onMouseEnter={() => setExpandedExercise(ex.name)}
								onMouseLeave={() => setExpandedExercise(null)}
								onFocus={() => setExpandedExercise(ex.name)}
								onBlur={() => setExpandedExercise(null)}
								aria-expanded={expandedExercise === ex.name}
								aria-controls={`desc-${ex.name}`}
							>
								<button
									className="w-full flex items-center gap-3 px-6 py-4 text-lg font-bold text-cyan-800 dark:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
									onClick={() => setExpandedExercise(expandedExercise === ex.name ? null : ex.name)}
									aria-expanded={expandedExercise === ex.name}
									aria-controls={`desc-${ex.name}`}
								>
									<span className="inline-block text-2xl mr-2">
										{/* Icona dinamica per ogni esercizio (placeholder emoji) */}
										{ex.name.includes('Squat') ? '🏋️' : ex.name.includes('Push') ? '🤸' : ex.name.includes('Plank') ? '🧘' : ex.name.includes('Jump') ? '🤾' : ex.name.includes('Crunch') ? '💪' : ex.name.includes('Burpees') ? '🔥' : ex.name.includes('Affondi') ? '🚶' : ex.name.includes('Dip') ? '🪑' : ex.name.includes('Wall') ? '🧱' : ex.name.includes('Skipping') ? '🏃' : ex.name.includes('Side') ? '↔️' : ex.name.includes('Russian') ? '🔄' : ex.name.includes('Ponte') ? '🦵' : ex.name.includes('Bear') ? '🐻' : ex.name.includes('Calf') ? '🦶' : ex.name.includes('Leg') ? '🦵' : '🏃‍♂️'}
									</span>
									<span>{ex.name}</span>
									<span className="ml-auto transition-transform duration-200 group-hover:rotate-90 group-focus:rotate-90">
										▼
									</span>
								</button>
								<div
									id={`desc-${ex.name}`}
									className={`transition-all duration-300 px-6 pb-4 text-sm text-gray-700 dark:text-gray-200 text-center ${expandedExercise === ex.name ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
									aria-hidden={expandedExercise !== ex.name}
								>
									<div className="pt-2 animate-fadein">{ex.desc}</div>
									<div className="mt-2 flex flex-col items-center gap-1">
										<span className="px-2 py-1 rounded-full bg-orange-400 text-white text-xs font-bold animate-pop" title="MET">MET: {ex.MET}</span>
										<span className="px-2 py-1 rounded-full bg-pink-400 text-white text-xs font-bold animate-pop" title="Stima calorie per 1 serie (20min, 60kg)">
											Stima: {calcolaCalorie(ex.MET, 60, 5)} kcal/serie
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				{/* Modale personalizzazione workout aggiornata */}
				{showCustomModal && customWorkout && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein">
						<div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-4 border-cyan-300 p-8 max-w-md w-full flex flex-col items-center gap-6 animate-pop relative">
							<button
								className="absolute top-4 right-4 text-cyan-600 hover:text-pink-500 text-2xl font-bold focus:outline-none"
								onClick={() => setShowCustomModal(false)}
								aria-label="Chiudi"
							>×</button>
							<h2 className="text-2xl font-bold text-cyan-700 mb-2">Personalizza il tuo allenamento</h2>
							<div className="w-full flex flex-col gap-4">
								{customWorkout.map((ex, idx) => (
									<div key={ex.name} className="rounded-xl p-4 border-2 shadow bg-cyan-50 dark:bg-gray-800">
										<div className="font-bold text-cyan-800 dark:text-cyan-200 text-lg mb-2">{ex.name}</div>
										<div className="flex gap-2 items-center mb-2">
											<label className="text-sm font-semibold">Serie:</label>
											<input type="number" min={1} max={8} value={ex.serie} onChange={e => updateCustomWorkout(idx, 'serie', Number(e.target.value))} className="w-16 px-2 py-1 rounded border-2 border-cyan-300 text-center" />
											<label className="text-sm font-semibold ml-4">Ripetizioni:</label>
											<input type="number" min={1} max={50} value={ex.reps} onChange={e => updateCustomWorkout(idx, 'reps', Number(e.target.value))} className="w-16 px-2 py-1 rounded border-2 border-cyan-300 text-center" />
										</div>
										<div className="text-xs text-gray-500">MET: {ex.MET}</div>
										<div className="mt-1 px-2 py-1 rounded-full bg-orange-400 text-white text-xs font-bold inline-block animate-pop">
											Calorie stimate: {calcolaCalorie(ex.MET, Number(weight) || 60, (ex.durata / ex.serie) * ex.serie)} kcal
										</div>
									</div>
								))}
							</div>
							<button
								className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-cyan-400 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 text-lg tracking-wide"
								onClick={() => {
									setWorkoutStep('allenamento');
									closeWorkoutModal();
								}}
							>Inizia allenamento personalizzato</button>
						</div>
					</div>
				)}
				{/* Condivisione progressi */}
				<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
					<button
						className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
						onClick={() => setShowShareModal(true)}
						aria-label="Condividi progressi"
					>
						📈 Condividi i miei progressi
					</button>
				</div>

				{/* MODALE CONDIVISIONE SOCIAL */}
				{showShareModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein">
						<div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-4 border-purple-400 p-8 max-w-xs w-full flex flex-col items-center gap-6 animate-pop relative">
							<button
								className="absolute top-4 right-4 text-purple-600 hover:text-pink-500 text-2xl font-bold focus:outline-none"
								onClick={() => setShowShareModal(false)}
								aria-label="Chiudi"
							>×</button>
																									<h2 className="text-xl font-bold text-purple-700 mb-2 text-center">Condividi i tuoi progressi</h2>
							<div className="flex flex-col gap-3 w-full">
								<button
									className="w-full py-2 rounded-full bg-green-500 text-white font-bold shadow hover:scale-105 transition-all flex items-center justify-center gap-2"
									onClick={() => {
										const completed = progress.completed.filter(Boolean).length;
										const text = `🏅 Ho completato ${completed}/28 giorni di allenamento su GYM28! 💪🔥`;
										window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
										setShowShareModal(false);
									}}
								>
									<span>🟢 WhatsApp</span>
								</button>
								<button
									className="w-full py-2 rounded-full bg-blue-600 text-white font-bold shadow hover:scale-105 transition-all flex items-center justify-center gap-2"
									onClick={() => {
										const completed = progress.completed.filter(Boolean).length;
										const text = `🏅 Ho completato ${completed}/28 giorni di allenamento su GYM28! 💪🔥`;
										window.open(`https://www.facebook.com/sharer/sharer.php?u=&quote=${encodeURIComponent(text)}`);
										setShowShareModal(false);
									}}
								>
									<span>🔵 Facebook</span>
								</button>
								<button
									className="w-full py-2 rounded-full bg-black text-white font-bold shadow hover:scale-105 transition-all flex items-center justify-center gap-2"
									onClick={() => {
										const completed = progress.completed.filter(Boolean).length;
										const text = `🏅 Ho completato ${completed}/28 giorni di allenamento su GYM28! 💪🔥`;
										window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
										setShowShareModal(false);
									}}
								>
									<span>✖️ X / Twitter</span>
								</button>
								<button
									className="w-full py-2 rounded-full bg-gray-300 text-gray-800 font-bold shadow hover:scale-105 transition-all flex items-center justify-center gap-2"
									onClick={() => {
										const completed = progress.completed.filter(Boolean).length;
										const text = `🏅 Ho completato ${completed}/28 giorni di allenamento su GYM28! 💪🔥`;
										navigator.clipboard.writeText(text);
										setShowShareModal(false);
										alert('Testo copiato negli appunti!');
									}}
								>
									<span>📋 Copia testo</span>
								</button>
							</div>
						</div>
					</div>
				)}
				{/* FOOTER ENERGICO */}
				<footer className="w-full mt-24 py-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-lime-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-center text-sm font-semibold text-cyan-900 dark:text-cyan-200 shadow-inner animate-fadein">
  © {new Date().getFullYear()} GYM28. Tutti i diritti riservati.
</footer>
<div className="flex justify-center mt-12 mb-8">
  <a
    href="/personal-trainer"
    className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 text-xl tracking-wide focus:outline-none focus:ring-4 focus:ring-cyan-300 animate-bounce"
    aria-label="Consulenza Personal Trainer"
  >
    Consulenza Personal Trainer
  </a>
</div>
			</>
		);
	}

	// --- FUNZIONI UTILI ---
	function calcolaCalorie(MET:number, peso:number, durata:number) {
	  // durata in minuti
	  return Math.round((MET * 3.5 * peso / 200) * durata);
	}
	
	function getWorkoutForDay(day:number): CustomExercise[] {
	  // Semplice shuffle per esempio, sostituire con logica reale
	  const seed = day;
	  const shuffled = eserciziBase.slice().sort((a: CustomExercise, b: CustomExercise) => ((seed + a.name.length) % 7) - ((seed + b.name.length) % 7));
	  return shuffled.slice(0, 4).map((ex: CustomExercise) => ({ ...ex }));
	}
	
	function getWorkoutWithCalories(day:number, peso:number): (CustomExercise & {caloriePerSerie:number, calorieTotali:number})[] {
	  return getWorkoutForDay(day).map((ex: CustomExercise) => {
	    const caloriePerSerie = calcolaCalorie(ex.MET, peso, ex.durata / ex.serie);
	    const calorieTotali = caloriePerSerie * ex.serie;
	    return { ...ex, caloriePerSerie, calorieTotali };
	  });
	}
	
	function updateCustomWorkout(idx:number, field:'serie'|'reps', value:number) {
	  setCustomWorkout((prev) => {
	    if (!prev) return prev;
	    const updated = [...prev];
	    updated[idx] = { ...updated[idx], [field]: value };
	    return updated;
	  });
	}
	
	function openSkipModal(day:number) {
	  setWorkoutDay(day);
	  setShowSkipModal(true);
	}
	
	function confirmSkip() {
	  if (workoutDay === null) return;
	  const newProgress = { ...progress };
	  newProgress.skipped[workoutDay] = true;
	  localStorage.setItem('progress', JSON.stringify(newProgress));
	  setProgress(newProgress);
	  const newLog = [...skipLog, { day: workoutDay+1, date: new Date().toLocaleDateString(), reason: '' }];
	  setSkipLog(newLog);
	  localStorage.setItem('skipLog', JSON.stringify(newLog));
	  setShowSkipModal(false);
	}
	
	function closeWorkoutModal() {
	  setShowWorkoutModal(false);
	  setWorkoutStep('preparazione');
	  setWorkoutDay(null);
	}
	
	// Funzione handleSerieDone per gestione avanzamento serie
	function handleSerieDone(exIdx: number, serieNum: number, totalSerie: number) {
	  setSerieDone((prev) => {
	    const updated = { ...prev };
	    if (!updated[exIdx]) updated[exIdx] = [];
	    updated[exIdx].push(serieNum);
	    return updated;
	  });
	  // Se non è l'ultima serie di questo esercizio
	  if (serieNum < totalSerie) {
	    // Prendi il tempo di recupero personalizzato per l'esercizio corrente (se presente)
	    let restSec = 30;
	    if (customWorkout && customWorkout[exIdx] && customWorkout[exIdx].durata) {
	      restSec = customWorkout[exIdx].durata;
	    } else if (getWorkoutForDay(workoutDay!)[exIdx]?.durata) {
	      restSec = getWorkoutForDay(workoutDay!)[exIdx].durata;
	    }
	    setPendingRest({show: true, seconds: restSec});
	  } else {
	    // Passa al prossimo esercizio o fine allenamento
	    if (workoutDay !== null && currentExerciseIdx < getWorkoutWithCalories(workoutDay, Number(weight) || 60).length - 1) {
	      setCurrentExerciseIdx(currentExerciseIdx + 1);
	      setResting(false);
	      setRestTimer(30);
	    } else {
	      // Fine allenamento
	      setWorkoutStep('riepilogo');
	      setShowWorkoutModal(false);
	      setTimeout(() => setShowWorkoutModal(true), 300); // Per animazione modale riepilogo
	      // Feedback sonoro/vibrazione
	      try {
	        const audio = new Audio('/congrats.mp3');
	        audio.play();
	        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
	      } catch {}
	      if (workoutDay !== null) {
	        const newProgress = { ...progress };
	        newProgress.completed[workoutDay] = true;
	        localStorage.setItem('progress', JSON.stringify(newProgress));
	        setProgress(newProgress);
	      }
	    }
	  }
	}
}

// --- COMPONENTE MODALE MODIFICA DATI UTENTE ---
import React from "react";
type EditUserModalProps = {
  userName: string;
  age: string;
  weight: string;
  height: string;
  goals: string[];
  obiettiviList: { label: string; value: string }[];
  onClose: () => void;
  onSave: (data: { userName: string; age: string; weight: string; height: string; goals: string[] }) => void;
};
const EditUserModal: React.FC<EditUserModalProps> = ({ userName, age, weight, height, goals, obiettiviList, onClose, onSave }) => {
  const [form, setForm] = React.useState({ userName, age, weight, height, goals });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-4 border-cyan-300 flex flex-col animate-pop overflow-hidden p-8">
        <button
          className="absolute top-4 right-4 text-cyan-600 hover:text-pink-500 text-2xl font-bold focus:outline-none z-10"
          onClick={onClose}
          aria-label="Chiudi Modifica"
        >×</button>
        <h2 className="text-2xl font-bold text-cyan-700 mb-4 text-center">Modifica dati utente</h2>
        <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <input
            className="px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 outline-none text-lg text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
            value={form.userName}
            onChange={e => setForm(d => ({ ...d, userName: e.target.value }))}
            required
            maxLength={32}
            placeholder="Nome"
          />
          <input
            className="px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 outline-none text-lg text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
            value={form.age}
            onChange={e => setForm(d => ({ ...d, age: e.target.value.replace(/\D/g, "") }))}
            required
            maxLength={2}
            placeholder="Età"
            inputMode="numeric"
          />
          <input
            className="px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 outline-none text-lg text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
            value={form.weight}
            onChange={e => setForm(d => ({ ...d, weight: e.target.value.replace(/\D/g, "") }))}
            required
            maxLength={3}
            placeholder="Peso (kg)"
            inputMode="numeric"
          />
          <input
            className="px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 outline-none text-lg text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
            value={form.height}
            onChange={e => setForm(d => ({ ...d, height: e.target.value.replace(/\D/g, "") }))}
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
                className={`px-4 py-2 rounded-full font-bold border-2 transition-all duration-200 text-sm ${form.goals.includes(obj.value) ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-cyan-400" : "bg-white dark:bg-gray-800 text-cyan-700 border-cyan-200"}`}
                onClick={() => setForm(d => ({ ...d, goals: d.goals.includes(obj.value) ? d.goals.filter((x: string) => x !== obj.value) : [...d.goals, obj.value] }))}
              >
                {obj.label}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-cyan-400 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 text-lg tracking-wide"
          >Salva modifiche</button>
        </form>
      </div>
    </div>
  );
};

// --- COMPONENTE TIMER RECUPERO ---
type RestTimerProps = {
  seconds: number;
  onComplete: () => void;
  setRestTimer: React.Dispatch<React.SetStateAction<number>>;
};
const RestTimer: React.FC<RestTimerProps> = ({ seconds, onComplete, setRestTimer }) => {
  React.useEffect(() => {
    if (seconds <= 0) {
      onComplete();
      return;
    }
    const interval = setInterval(() => {
      setRestTimer((s: number) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, onComplete, setRestTimer]);
  return (
    <div className="flex flex-col items-center gap-2 mt-4 animate-fadein">
      <span className="text-cyan-600 font-bold">Recupero...</span>
      <span className="text-3xl font-extrabold text-blue-500 animate-pulse">{seconds}s</span>
    </div>
  );
}