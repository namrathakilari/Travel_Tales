// Full frontend code

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
const admin = require('firebase-admin');


// 1. Firebase Config (your firebaseConfig)
const firebaseConfig = {
  apiKey: "AIzaSyBEaxmpuNHv1mpls_fn2Ph_JtmZHVE_hC4",
  authDomain: "travel-tales-40327.firebaseapp.com",
  projectId: "travel-tales-40327",
  storageBucket: "travel-tales-40327.firebasestorage.app",
  messagingSenderId: "553948671245",
  appId: "1:553948671245:web:cf61fc5fd61cd45c1ed444",
  measurementId: "G-X0X4KHHN71"
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// 3. Function to handle user login
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed in:', user.email);

    // After successful login, send email to backend
    sendWelcomeEmail(user.email);
  } catch (error) {
    console.error('Login error:', error.message);
  }
}

// 4. Function to send welcome email to backend
function sendWelcomeEmail(userEmail) {
  fetch('http://localhost:5000/send-welcome-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: userEmail }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Backend responded:', data);
    })
    .catch(error => {
      console.error('Error sending welcome email:', error);
    });
}

// 5. Example usage (you can call this from a button click)
document.getElementById('loginButton').addEventListener('click', () => {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  
  loginUser(email, password);
});
