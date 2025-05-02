import { db, storage } from './firebase-init.js';
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

document.getElementById("form-terreno").addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value;
  const medidas = document.getElementById("medidas").value;
  const area = document.getElementById("area").value;
  const mapa = document.getElementById("mapa").value;
  const descripcion = document.getElementById("descripcion").value;
  const documentos = document.getElementById("documentos").value;
  const formaPago = document.getElementById("formaPago").value;
  const extras = document.getElementById("extras").value;
  const imagenes = document.getElementById("imagenes").files;

  const urls = [];
  for (const file of imagenes) {
    const imgRef = ref(storage, `terrenos/${file.name}`);
    await uploadBytes(imgRef, file);
    const url = await getDownloadURL(imgRef);
    urls.push(url);
  }

  await addDoc(collection(db, "terrenos"), {
    titulo, medidas, area, mapa, descripcion, documentos, formaPago, extras, imagenes: urls
  });

  alert("Terreno guardado correctamente");
});