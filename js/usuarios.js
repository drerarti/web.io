db.collection("usuarios").get().then(snapshot => {
  const tabla = document.getElementById("tabla-usuarios");
  snapshot.forEach(doc => {
    const usuario = doc.data();
    const div = document.createElement("div");
    div.innerHTML = `<strong>${doc.id}</strong> - ${usuario.rol}`;
    tabla.appendChild(div);
  });
});