import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBLaw5xjOC7UZn_fwdj3WDF5027j5dJvLg",
    authDomain: "blogging-app-cf098.firebaseapp.com",
    projectId: "blogging-app-cf098",
    storageBucket: "blogging-app-cf098.firebasestorage.app",
    messagingSenderId: "75480584266",
    appId: "1:75480584266:web:e9d441352c0ca0faee16b3",
    measurementId: "G-GRMR5Y3S1X"
  };
                        
  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const auth =  getAuth(app);
  export const db = getFirestore(app);