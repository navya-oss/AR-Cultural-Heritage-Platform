import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAkN3uCB5T1Kiw9fUfNsQvv5ShPmpM18nM",
  authDomain: "temple-ar.firebaseapp.com",
  projectId: "temple-ar",
  storageBucket: "temple-ar.firebasestorage.app",
  messagingSenderId: "839695733604",
  appId: "1:839695733604:web:eedb7c241b895e8867a071",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
