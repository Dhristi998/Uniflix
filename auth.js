import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { firebaseConfig, isFirebaseConfigured } from "./js/firebase-config.js";

const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const main = document.getElementById("main");
const createacct = document.getElementById("create-acct");

const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");
const returnBtn = document.getElementById("return-btn");
const messageEl = document.getElementById("auth-message");

let auth = null;
if (isFirebaseConfigured) {
  auth = getAuth(initializeApp(firebaseConfig));
} else {
  showMessage("Accounts are not set up on this demo yet. Use \"Continue as guest\" to try UniFlix.");
}

function showMessage(text, isError = true) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? "#ff8080" : "#7dffa0";
}

// Turns Firebase error codes into plain-English messages.
function friendlyError(error) {
  const messages = {
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/email-already-in-use": "An account with this email already exists. Try signing in.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
    "auth/unauthorized-domain": "This website isn't authorised in Firebase yet.",
  };
  return messages[error.code] || "Something went wrong. Please try again.";
}

function requireAuth() {
  if (!auth) {
    showMessage("Accounts are not set up on this demo yet. Use \"Continue as guest\".");
    return false;
  }
  return true;
}

createacctbtn.addEventListener("click", function () {
  if (!requireAuth()) return;

  const signupEmail = signupEmailIn.value.trim();
  const confirmSignupEmail = confirmSignupEmailIn.value.trim();
  const signupPassword = signupPasswordIn.value;
  const confirmSignUpPassword = confirmSignUpPasswordIn.value;

  if (!signupEmail || !confirmSignupEmail || !signupPassword || !confirmSignUpPassword) {
    showMessage("Please fill out all required fields.");
    return;
  }
  if (signupEmail !== confirmSignupEmail) {
    showMessage("Email fields do not match.");
    return;
  }
  if (signupPassword !== confirmSignUpPassword) {
    showMessage("Password fields do not match.");
    return;
  }

  createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
    .then(() => {
      showMessage("Account created! Taking you in…", false);
      window.location.href = "./main.html";
    })
    .catch((error) => showMessage(friendlyError(error)));
});

submitButton.addEventListener("click", function () {
  if (!requireAuth()) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) {
    showMessage("Please enter your email and password.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      showMessage("Welcome back!", false);
      window.location.href = "./main.html";
    })
    .catch((error) => showMessage(friendlyError(error)));
});

signupButton.addEventListener("click", function () {
  main.style.display = "none";
  createacct.style.display = "block";
  messageEl.textContent = "";
});

returnBtn.addEventListener("click", function () {
  main.style.display = "block";
  createacct.style.display = "none";
  messageEl.textContent = "";
});
