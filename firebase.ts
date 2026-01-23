
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

/**
 * GUIDE D'INSTALLATION FIREBASE PAR ANGE STEPHANE SAWADOGO
 * 
 * 1. Créer un projet sur console.firebase.google.com
 * 2. Activer Cloud Messaging dans les paramètres du projet.
 * 3. Remplacer les clés ci-dessous.
 */

const firebaseConfig = {
  apiKey: "AIzaSyAQjzhtVWE4oZkGb5coS4-fnwatwgqKfzA",
  authDomain: "aubeshop-initialisation.firebaseapp.com",
  projectId: "aubeshop-initialisation",
  storageBucket: "aubeshop-initialisation.firebasestorage.app",
  messagingSenderId: "651473957516",
  appId: "1:651473957516:web:1ab1f2ebcba1c8468481a9",
  measurementId: "G-MNMJCLXK5P"
};

// Initialisation sécurisée
let app;
let db: any;
let auth: any;
let messaging: any;

try {
  app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  db = getFirestore(app);
  auth = getAuth(app);
  // Le messaging ne fonctionne que dans des contextes sécurisés (HTTPS)
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
  }
} catch (e) {
  console.warn("Firebase n'est pas encore configuré avec des clés valides.");
}

export { db, auth, messaging };

export const requestNotificationPermission = async () => {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'VOTRE_PUBLIC_VAPID_KEY' // À récupérer dans la console Firebase
      });
      console.log('FCM Token:', token);
      return token;
    }
  } catch (error) {
    console.error('Erreur permission notification:', error);
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
