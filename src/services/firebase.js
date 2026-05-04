// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbmwwOcqF37ewx_ac0f46wiUUP_aBslMQ",
  authDomain: "tasker1-6ba59.firebaseapp.com",
  projectId: "tasker1-6ba59",
  storageBucket: "tasker1-6ba59.firebasestorage.app",
  messagingSenderId: "793377268972",
  appId: "1:793377268972:web:00eed07279037a74fbf1c9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);