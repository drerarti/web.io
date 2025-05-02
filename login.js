// login.js


  

document.getElementById('loginBtn').addEventListener('click', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const error = document.getElementById('error');
  
    if (!email || !password) {
      error.textContent = 'Por favor, completa ambos campos.';
      return;
    }
  
    try {
      const cred = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = cred.user;
  
      const docRef = firebase.firestore().collection("usuarios").doc(user.email);
      const docSnap = await docRef.get();
  
      if (docSnap.exists) {
        const rol = docSnap.data().rol;
        if (rol === "admin" || rol === "arquitecto") {
          window.location.href = "admin.html";
        } else {
          error.textContent = "No tienes permisos para acceder a esta sección.";
          firebase.auth().signOut();
        }
      } else {
        error.textContent = "No se encontró tu información de rol.";
        firebase.auth().signOut();
      }
    } catch (err) {
      console.error(err);
      error.textContent = "Error: " + err.message;
    }
  });
  