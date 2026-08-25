import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAI6iHVE_0Og_hYSjCSs7xpRUxq_z0UwcQ",
  authDomain: "rongtuli-5ee3b.firebaseapp.com",
  databaseURL: "https://rongtuli-5ee3b-default-rtdb.firebaseio.com",
  projectId: "rongtuli-5ee3b",
  storageBucket: "rongtuli-5ee3b.firebasestorage.app",
  messagingSenderId: "702784968877",
  appId: "1:702784968877:web:2b0317308d88dfbf1d4e24",
  measurementId: "G-PM9G70LCFQ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export const analytics = getAnalytics(app);

export default app;