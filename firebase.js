// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrlX2Qg2v1GYfwC6TLaP4EaBm7MQ4vPVQ",
  authDomain: "inventory-management-6526b.firebaseapp.com",
  projectId: "inventory-management-6526b",
  storageBucket: "inventory-management-6526b.appspot.com",
  messagingSenderId: "292663008384",
  appId: "1:292663008384:web:3be8a2e9c5410aa93eda65",
  measurementId: "G-J2EXYEDXG7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { firestore, auth, storage };
