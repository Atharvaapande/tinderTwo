import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "yourAPI",
  authDomain: "yourDomain",
  projectId: "yourProjectID",
  storageBucket: "yourBucket",
  messagingSenderId: "yourMsgSenderID",
  appId: "yourAPPID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage };
