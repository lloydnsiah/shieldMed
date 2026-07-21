import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDvXoQJcYeBpsDEovuYhRLIgG26OCAr0fA",
  authDomain: "shield-medical-center.firebaseapp.com",
  projectId: "shield-medical-center",
  storageBucket: "shield-medical-center.firebasestorage.app",
  messagingSenderId: "775766836948",
  appId: "1:775766836948:web:299c48953ef2fb7a0fdd41"
};

// Initialize Firebase ONCE
const app = initializeApp(firebaseConfig)

// Export services
export const db = getFirestore(app)
export const auth = getAuth(app)