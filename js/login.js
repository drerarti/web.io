import { auth } from './firebase-init.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

window.iniciarSesion = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login exitoso");
      window.location.href = "admin.html";
    })
    .catch((error) => {
      alert("Error al iniciar sesión: " + error.message);
    });
}