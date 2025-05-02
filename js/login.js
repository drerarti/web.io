function iniciarSesion() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const email = userCredential.user.email;
      return db.collection("usuarios").doc(email).get();
    })
    .then(doc => {
      if (!doc.exists) {
        alert("No tiene un rol asignado.");
        return;
      }
      const rol = doc.data().rol;
      localStorage.setItem("usuarioLogueado", email);
      localStorage.setItem("rol", rol);
      if (rol === "arquitecto" || rol === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "terrenos.html";
      }
    })
    .catch(err => alert("Error al iniciar sesión: " + err.message));
}