// Firebase web config for UniFlix login.
//
// HOW TO FILL THIS IN:
// Firebase Console -> your project -> Project settings (gear icon) -> General
// -> "Your apps" -> Web app -> "SDK setup and configuration" -> Config.
// Copy the values into the object below.
//
// These values are safe to publish: a Firebase web config only identifies
// your project. Access is controlled by Firebase Authentication settings
// (Authorized domains), not by keeping this file secret.
 
export const firebaseConfig = {
  apiKey: "AIzaSyA0XmOQnGIeCudXH01uH8IXOR818Yblz-0",
  authDomain: "uniflix-ae08b.firebaseapp.com",
  projectId: "uniflix-ae08b",
  storageBucket: "uniflix-ae08b.firebasestorage.app",
  messagingSenderId: "263414485213",
  appId: "1:263414485213:web:c0405c5bf3c8a8532f4b34"
};
 
export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("PASTE_");
 
