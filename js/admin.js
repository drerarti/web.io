document.getElementById("guardar-btn").addEventListener("click", function (e) {
  e.preventDefault();
  guardarTerreno();
});

function guardarTerreno() {
  const titulo = document.getElementById("titulo").value;
  const medidas = document.getElementById("medidas").value;
  const area = document.getElementById("area").value;
  const ubicacion = document.getElementById("mapa").value;
  const descripcion = document.getElementById("descripcion").value;
  const documentos = document.getElementById("documentos").value;
  const formasPago = document.getElementById("formasPago").value;
  const beneficios = document.getElementById("acceso").value;
  const imagenes = document.getElementById("imagenes").files;

  const id = db.collection("terrenos").doc().id;
  const terreno = {
    titulo,
    medidas,
    area,
    ubicacion,
    descripcion,
    documentos,
    formasPago,
    beneficios,
    imagenes: [],
    fecha: new Date()
  };

  const tareas = [];
  for (let i = 0; i < imagenes.length; i++) {
    const archivo = imagenes[i];
    const ref = storage.ref(`terrenos/${id}/img${i + 1}`);
    tareas.push(ref.put(archivo).then(snap => snap.ref.getDownloadURL()));
  }

  Promise.all(tareas).then(urls => {
    terreno.imagenes = urls;
    return db.collection("terrenos").doc(id).set(terreno);
  }).then(() => {
    alert("Terreno guardado correctamente.");
    document.getElementById("form-terreno").reset();
    cargarTerrenos();
  }).catch(err => {
    console.error("Error al guardar:", err);
    alert("Ocurrió un error.");
  });
}

function cargarTerrenos() {
  const lista = document.getElementById("lista-terrenos");
  lista.innerHTML = "";
  db.collection("terrenos").orderBy("fecha", "desc").get().then(snapshot => {
    snapshot.forEach(doc => {
      const t = doc.data();
      const div = document.createElement("div");
      div.className = "terreno";
      div.innerHTML = `<h3>${t.titulo}</h3><p>${t.descripcion}</p>`;
      lista.appendChild(div);
    });
  });
}