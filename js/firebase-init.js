const firebaseConfig = {
  apiKey: "AIzaSyBxK_0Fa7OS5vgHc8SUhHDQBqvpK0uN_Pk",
  authDomain: "aylluweb-f9250.firebaseapp.com",
  projectId: "aylluweb-f9250",
  storageBucket: "aylluweb-f9250.appspot.com",
  messagingSenderId: "628363659588",
  appId: "1:628363659588:web:d2124d4537a0c2af392f11"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();