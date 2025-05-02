function cargarTerrenos() {
  const contenedor = document.getElementById("lista-terrenos");
  contenedor.innerHTML = "";
  db.collection("terrenos").orderBy("fecha", "desc").get().then(snapshot => {
    snapshot.forEach(doc => {
      const t = doc.data();
      const div = document.createElement("div");
      div.innerHTML = `<h3>${t.titulo}</h3><p>${t.descripcion}</p>`;
      contenedor.appendChild(div);
    });
  });
}
function filtrarTerrenos(estado) {
  if (estado === "todos") return cargarTerrenos();
  const contenedor = document.getElementById("lista-terrenos");
  contenedor.innerHTML = "";
  db.collection("terrenos").where("estado", "==", estado).get().then(snapshot => {
    snapshot.forEach(doc => {
      const t = doc.data();
      const div = document.createElement("div");
      div.innerHTML = `<h3>${t.titulo}</h3><p>${t.descripcion}</p>`;
      contenedor.appendChild(div);
    });
  });
}
cargarTerrenos();