// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBAdmKN5M94b02Jd6uABE9N1ES3PVkVzf8",
  authDomain: "legal-research-assistant-abc56.firebaseapp.com",
  projectId: "legal-research-assistant-abc56",
  storageBucket: "legal-research-assistant-abc56.firebasestorage.app",
  messagingSenderId: "118807555691",
  appId: "1:118807555691:web:9c0bd0896d85164c23cb2e",
  measurementId: "G-G7VQL8HQ54"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithEmailAndPassword, signInWithPopup };
