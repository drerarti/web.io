import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { app } from './firebaseConfig.js'; // si tienes un archivo separado de configuración

const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('emailLogin').value;
  const password = document.getElementById('passwordLogin').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docRef = doc(db, "usuarios", user.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const rol = docSnap.data().rol;
      if (rol === "admin" || rol === "arquitecto") {
        window.location.href = "admin.html";
      } else {
        alert("No tienes permisos para acceder a esta sección.");
      }
    } else {
      alert("No tienes permisos para acceder a esta sección.");
    }
  } catch (error) {
    alert("Error de inicio de sesión: " + error.message);
  }
});
