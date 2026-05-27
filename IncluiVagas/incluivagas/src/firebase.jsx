// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSZL0BEbkf8Nw8D1ruumvXrjAevZnECQs",
  authDomain: "incluivagas.firebaseapp.com",
  projectId: "incluivagas",
  storageBucket: "incluivagas.firebasestorage.app",
  messagingSenderId: "758996141046",
  appId: "1:758996141046:web:a4de592d45f5f14ee73dd7",
  measurementId: "G-1BKZPZNMZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };