import { initializeApp } from "firebase/app";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALIacvjsJZ8_OuYqpe-6vQoiIddVlwTzA",
  authDomain: "auth-firebase-projeto-au-7913a.firebaseapp.com",
  projectId: "auth-firebase-projeto-au-7913a",
  storageBucket: "auth-firebase-projeto-au-7913a.firebasestorage.app",
  messagingSenderId: "271482231363",
  appId: "1:271482231363:web:4d1e0dc34d4cf1bd99d2f6",
  measurementId: "G-2JFSRK4QMC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
    db,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
};