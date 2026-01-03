import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC5vuCr2HQSyrR41a0_8PwVJ30zEDS69oM",
  authDomain: "project-management-app-9ad17.firebaseapp.com",
  projectId: "project-management-app-9ad17",
  storageBucket: "project-management-app-9ad17.firebasestorage.app",
  messagingSenderId: "454929254130",
  appId: "1:454929254130:web:b93ff75e6f95926458726b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };