// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHhlxZe3XOrapRMS9GIrmSZ25cVgbTKVs",
  authDomain: "visitor-tracker-fbd45.firebaseapp.com",
  projectId: "visitor-tracker-fbd45",
  storageBucket: "visitor-tracker-fbd45.firebasestorage.app",
  messagingSenderId: "130496005379",
  appId: "1:130496005379:web:999f53938699b69b85d536"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);