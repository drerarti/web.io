
const db = firebase.firestore();
const contenedor = document.getElementById("terrenos-container");
const estadoFiltro = document.getElementById("estadoFiltro");

function cargarTerrenos() {
    let query = db.collection("terrenos");
    const estado = estadoFiltro.value;
    if (estado !== "todos") {
        query = query.where("estado", "==", estado);
    }

    query.get().then(snapshot => {
        contenedor.innerHTML = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const div = document.createElement("div");
            div.className = "terreno-card";
            div.innerHTML = `
                <h3>${data.titulo}</h3>
                <img src="${data.imagenes?.[0] || ''}" alt="Imagen de terreno">
                <p>${data.descripcion}</p>
                <p><strong>Estado:</strong> ${data.estado}</p>
            `;
            contenedor.appendChild(div);
        });
    });
}

estadoFiltro.addEventListener("change", cargarTerrenos);
window.addEventListener("DOMContentLoaded", cargarTerrenos);
