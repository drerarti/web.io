import { db } from './firebase-init.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const lista = document.getElementById("usuarios-lista");
getDocs(collection(db, "usuarios")).then(snapshot => {
  snapshot.forEach(doc => {
    const div = document.createElement("div");
    div.textContent = JSON.stringify(doc.data());
    lista.appendChild(div);
  });
});