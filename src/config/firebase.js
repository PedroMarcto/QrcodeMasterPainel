// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Configuração do Firebase do seu projeto
const firebaseConfig = {
  apiKey: "AIzaSyB-wj1YpoKy_v5f1v1wYsbweIriAVWgRMg",
  authDomain: "qrcodemaster-8e611.firebaseapp.com",
  projectId: "qrcodemaster-8e611",
  storageBucket: "qrcodemaster-8e611.firebasestorage.app",
  messagingSenderId: "528133505282",
  appId: "1:528133505282:web:db7db56d63077343ef021b",
  measurementId: "G-MEQSCMHPW7"
};

let app;
let db;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  analytics = getAnalytics(app);
  console.log("[FIREBASE] Inicializado com sucesso!");
} catch (error) {
  console.warn("[FIREBASE] Erro na configuração:", error);
  console.log("[FIREBASE] O app funcionará em modo offline/demo");
  app = null;
  db = null;
  analytics = null;
}

export { db, analytics };
export default app;
