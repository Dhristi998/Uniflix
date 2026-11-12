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
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "",
  appId: ""
};

export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("PASTE_");
