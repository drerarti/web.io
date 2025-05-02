
document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("listaTerrenos");
  const estadoFiltro = document.getElementById("estadoFiltro");

  estadoFiltro.addEventListener("change", cargarTerrenos);

  function cargarTerrenos() {
    const filtro = estadoFiltro.value;
    lista.innerHTML = "";

    firebase.firestore().collection("terrenos").orderBy("creado", "desc").get()
      .then(snapshot => {
        if (snapshot.empty) {
          lista.innerHTML = "<p>No hay terrenos disponibles.</p>";
          return;
        }

        snapshot.forEach(doc => {
          const t = doc.data();
          const estado = t.estado || "disponible";
          if (filtro !== "todos" && estado !== filtro) return;

          const div = document.createElement("div");
          div.className = "tarjeta";
          div.onclick = () => mostrarModal(t);
          div.innerHTML = \`
            <img src="\${t.imagenes?.[0] || 'img/placeholder.jpg'}" />
            <h3>\${t.titulo}</h3>
            <p>\${t.descripcion.slice(0, 100)}...</p>
            <p><strong>Estado:</strong> \${estado}</p>
          \`;
          lista.appendChild(div);
        });
      })
      .catch(err => {
        console.error("Error al cargar terrenos:", err);
        lista.innerHTML = "<p>Error al cargar terrenos.</p>";
      });
  }

  function mostrarModal(t) {
    const modal = document.getElementById("modal");
    const content = document.getElementById("modalContent");
    const imagenes = t.imagenes || [];
    window.__imagenesModal = imagenes;
    window.__indexModal = 0;

    const imagenCarrusel = imagenes.length > 0 ? \`
      <div class="carrusel">
        <button onclick="navegarCarrusel(-1)">◀</button>
        <img id="carruselImg" src="\${imagenes[0]}" class="carrusel-img" />
        <button onclick="navegarCarrusel(1)">▶</button>
      </div>
    \` : "<p>Sin imágenes</p>";

    content.innerHTML = \`
      <span class="modal-close" onclick="cerrarModal()">×</span>
      \${imagenCarrusel}
      <h2>\${t.titulo}</h2>
      <p><strong>Área:</strong> \${t.area} m²</p>
      <p><strong>Medidas:</strong> \${t.medidas}</p>
      <p><strong>Ubicación:</strong> <a href="\${t.ubicacion}" target="_blank">Ver en mapa</a></p>
      <p><strong>Estado:</strong> \${t.estado || 'disponible'}</p>
      <p><strong>Descripción:</strong> \${t.descripcion}</p>
      <p><strong>Documentación:</strong> \${t.documentacion
        ? `<a href="\${t.documentacion}" target="_blank">Descargar archivo</a>`
        : "No hay archivo adjunto"}</p>
      <p><strong>Modalidades de pago:</strong> \${t.pago}</p>
      <p><strong>Beneficios:</strong> \${t.beneficios}</p>
    \`;

    modal.style.display = "flex";
  }

  window.cerrarModal = function () {
    document.getElementById("modal").style.display = "none";
  }

  window.navegarCarrusel = function (delta) {
    if (!window.__imagenesModal) return;
    const total = window.__imagenesModal.length;
    window.__indexModal = (window.__indexModal + delta + total) % total;
    document.getElementById("carruselImg").src = window.__imagenesModal[window.__indexModal];
  }

  cargarTerrenos();
});
