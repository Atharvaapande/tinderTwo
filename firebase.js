import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCn4JVZk24nmsaDuk9_DUadNR4w4ltJZwY",
  authDomain: "tindertwo-58410.firebaseapp.com",
  projectId: "tindertwo-58410",
  storageBucket: "tindertwo-58410.appspot.com",
  messagingSenderId: "412657239923",
  appId: "1:412657239923:web:5627ea5caa8bbda5db6706",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage };
