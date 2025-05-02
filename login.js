// Asegúrate de que Firebase ya esté inicializado en login.html antes de este script

document.getElementById('loginBtn').addEventListener('click', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
  
    if (!email || !password) {
      alert('Por favor, completa ambos campos.');
      return;
    }
  
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      const userDoc = await firebase.firestore().collection('usuarios').doc(user.email).get();
  
      if (userDoc.exists) {
        const rol = userDoc.data().rol;
  
        if (rol === 'admin' || rol === 'arquitecto') {
          window.location.href = 'admin.html';
        } else {
          alert('No tienes permisos para acceder a esta sección.');
          firebase.auth().signOut();
        }
      } else {
        alert('Tu cuenta no tiene un rol asignado.');
        firebase.auth().signOut();
      }
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      alert('Correo o contraseña incorrectos.');
    }
  });
  