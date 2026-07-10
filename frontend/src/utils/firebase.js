import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxY_vPxWDrxcpuEaghfE9iD8gZs2Gwu3M",
  authDomain: "she-shield-133de.firebaseapp.com",
  projectId: "she-shield-133de",
  storageBucket: "she-shield-133de.firebasestorage.app",
  messagingSenderId: "743838007655",
  appId: "1:743838007655:web:d0be17e45324b025b96fc2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;