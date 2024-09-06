
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyCKVCOYMbj63Sq0qjJErNb6g3pCUNOuuYs",
  authDomain: "fir-crud-b12bf.firebaseapp.com",
  projectId: "fir-crud-b12bf",
  storageBucket: "fir-crud-b12bf.appspot.com",
  messagingSenderId: "324445691357",
  appId: "1:324445691357:web:b5379fe94d23107efc6a34",
  measurementId: "G-SKTS821JVT"
};

const firebaseConfigApp= initializeApp(firebaseConfig);
export default firebaseConfigApp;
