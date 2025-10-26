// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCisiAUXlKy4BcDCGnKn5fcDX2UuzwsU9M",
  authDomain: "wishlist-84fee.firebaseapp.com",
  projectId: "wishlist-84fee",
  storageBucket: "wishlist-84fee.firebasestorage.app",
  messagingSenderId: "869635472167",
  appId: "1:869635472167:web:6bb5157759dc8c81b40702",
  measurementId: "G-CFNF9K06F6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, analytics, db };
