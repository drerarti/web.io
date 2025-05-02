
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-terreno');
  const lista = document.getElementById('lista-terrenos');
  const imagenInput = document.getElementById('imagen');
  const tablaBody = document.getElementById('tabla-body');

  const db = firebase.firestore();
  const storage = firebase.storage();
  let editId = null;
  let listaTerrenos = [];

  async function cargarTerrenos() {
    lista.innerHTML = '<h2>Lista de Terrenos</h2>';
    const contenedor = document.createElement('div');
    contenedor.className = 'cards-terrenos';

    const snapshot = await db.collection('terrenos').orderBy('creado', 'desc').get();
    listaTerrenos = [];
    if (snapshot.empty) {
      contenedor.innerHTML = '<p>No hay terrenos registrados.</p>';
    }

    snapshot.forEach(doc => {
      const terreno = doc.data();
      terreno.id = doc.id;
      listaTerrenos.push(terreno);

      const card = document.createElement('div');
      card.className = 'terreno-card';
      card.innerHTML = `
        <img src="${terreno.imagenes?.[0] || 'img/placeholder.jpg'}" alt="terreno">
        <div class="info">
          <h3>${terreno.titulo}</h3>
          <p>${terreno.descripcion}</p>
          <p><strong>Estado:</strong> ${terreno.estado}</p>
          <div class="acciones">
            <button class="btn-editar" data-id="${doc.id}">✏️ Editar</button>
            <button class="btn-eliminar" data-id="${doc.id}">🗑 Eliminar</button>
          </div>
        </div>
      `;
      contenedor.appendChild(card);
    });

    lista.appendChild(contenedor);

    document.querySelectorAll('.btn-eliminar').forEach(btn =>
      btn.addEventListener('click', eliminarTerreno)
    );
    document.querySelectorAll('.btn-editar').forEach(btn =>
      btn.addEventListener('click', cargarTerrenoEnFormulario)
    );

    renderizarTabla();
  }

  function renderizarTabla() {
    if (!tablaBody) return;
    tablaBody.innerHTML = '';

    listaTerrenos.forEach((terreno, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td><input type="text" value="${terreno.titulo}" data-campo="titulo" data-id="${terreno.id}"></td>
        <td><input type="text" value="${terreno.descripcion}" data-campo="descripcion" data-id="${terreno.id}"></td>
        <td>
          <select data-campo="estado" data-id="${terreno.id}">
            <option value="disponible" ${terreno.estado === 'disponible' ? 'selected' : ''}>Disponible</option>
            <option value="reservado" ${terreno.estado === 'reservado' ? 'selected' : ''}>Reservado</option>
            <option value="vendido" ${terreno.estado === 'vendido' ? 'selected' : ''}>Vendido</option>
          </select>
        </td>
        <td>
          <button class="boton-guardar" data-id="${terreno.id}">Guardar</button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });

    document.querySelectorAll('.boton-guardar').forEach(btn =>
      btn.addEventListener('click', guardarDesdeTabla)
    );
  }

  function guardarDesdeTabla(e) {
    const id = e.target.dataset.id;
    const inputs = document.querySelectorAll(`[data-id="${id}"]`);
    const camposActualizados = {};
    inputs.forEach(input => {
      const campo = input.dataset.campo;
      camposActualizados[campo] = input.value;
    });

    db.collection('terrenos').doc(id).update(camposActualizados)
      .then(() => {
        alert('Terreno actualizado correctamente');
        cargarTerrenos();
      })
      .catch(err => {
        console.error('Error al actualizar:', err);
        alert('Error al actualizar terreno');
      });
  }

  async function eliminarTerreno(e) {
    const id = e.target.dataset.id;
    if (confirm('¿Estás seguro de eliminar este terreno?')) {
      await db.collection('terrenos').doc(id).delete();
      cargarTerrenos();
    }
  }

  async function cargarTerrenoEnFormulario(e) {
    const id = e.target.dataset.id;
    const doc = await db.collection('terrenos').doc(id).get();
    if (doc.exists) {
      const terreno = doc.data();
      document.getElementById('titulo').value = terreno.titulo;
      document.getElementById('descripcion').value = terreno.descripcion;
      document.getElementById('estado').value = terreno.estado;
      document.getElementById('medidas').value = terreno.medidas;
      document.getElementById('area').value = terreno.area;
      document.getElementById('ubicacion').value = terreno.ubicacion;
      document.getElementById('documentacion').value = terreno.documentacion;
      document.getElementById('pago').value = terreno.pago;
      document.getElementById('beneficios').value = terreno.beneficios;
      editId = id;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  cargarTerrenos();
});



function renderizarVistaLista() {
  const contenedor = document.getElementById('lista-admin');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  firebase.firestore().collection('terrenos').orderBy('creado', 'desc').get()
    .then(snapshot => {
      if (snapshot.empty) {
        contenedor.innerHTML = '<p>No hay terrenos para mostrar.</p>';
        return;
      }

      snapshot.forEach(doc => {
        const terreno = doc.data();
        const id = doc.id;

        const card = document.createElement('div');
        card.className = 'card-admin';
        card.innerHTML = `
          <img src="${(terreno.imagenes?.[0]) || 'img/placeholder.jpg'}" alt="Terreno">
          <div class="card-info">
            <h3>${terreno.titulo}</h3>
            <p>${terreno.descripcion}</p>
            <p><strong>Estado:</strong></p>
            <select onchange="actualizarEstado('${id}', this.value)">
              <option value="disponible" ${terreno.estado === 'disponible' ? 'selected' : ''}>Disponible</option>
              <option value="reservado" ${terreno.estado === 'reservado' ? 'selected' : ''}>Reservado</option>
              <option value="vendido" ${terreno.estado === 'vendido' ? 'selected' : ''}>Vendido</option>
            </select>
            <div class="card-actions">
              <button class="editar" onclick="cargarTerrenoEnFormularioDesdeVista('${id}')">Editar</button>
              <button class="eliminar" onclick="eliminarTerrenoDesdeVista('${id}')">Eliminar</button>
            </div>
          </div>
        `;
        contenedor.appendChild(card);
      });
    });
}

function actualizarEstado(id, nuevoEstado) {
  firebase.firestore().collection('terrenos').doc(id).update({ estado: nuevoEstado })
    .then(() => {
      alert('Estado actualizado');
      renderizarVistaLista();
    })
    .catch(err => {
      console.error('Error al actualizar estado:', err);
      alert('Error al actualizar estado');
    });
}

function cargarTerrenoEnFormularioDesdeVista(id) {
  firebase.firestore().collection('terrenos').doc(id).get().then(doc => {
    if (doc.exists) {
      const terreno = doc.data();
      document.getElementById('titulo').value = terreno.titulo;
      document.getElementById('descripcion').value = terreno.descripcion;
      document.getElementById('estado').value = terreno.estado;
      document.getElementById('medidas').value = terreno.medidas;
      document.getElementById('area').value = terreno.area;
      document.getElementById('ubicacion').value = terreno.ubicacion;
      document.getElementById('documentacion').value = terreno.documentacion;
      document.getElementById('pago').value = terreno.pago;
      document.getElementById('beneficios').value = terreno.beneficios;
      editId = id;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

function eliminarTerrenoDesdeVista(id) {
  if (confirm('¿Seguro que deseas eliminar este terreno?')) {
    firebase.firestore().collection('terrenos').doc(id).delete()
      .then(() => {
        renderizarVistaLista();
        if (typeof cargarTerrenos === 'function') cargarTerrenos();
        if (typeof renderizarTabla === 'function') renderizarTabla();
      })
      .catch(err => {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar terreno');
      });
  }
}



// Parte 1: Agregar subida de documentación en el formulario
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-terreno');
  const imagenInput = document.getElementById('imagen');
  const archivoDocInput = document.getElementById('archivoDocumentacion');
  const db = firebase.firestore();
  const storage = firebase.storage();
  let editId = null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const estado = document.getElementById('estado').value;

    const nuevoTerreno = {
      titulo,
      descripcion,
      estado,
      medidas: document.getElementById('medidas').value,
      area: document.getElementById('area').value,
      ubicacion: document.getElementById('ubicacion').value,
      pago: document.getElementById('pago').value,
      beneficios: document.getElementById('beneficios').value,
      imagenes: [],
      creado: firebase.firestore.Timestamp.now()
    };

    const files = imagenInput.files;
    if (files.length > 0) {
      const urls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ref = storage.ref().child(`terrenos/${Date.now()}_${file.name}`);
        const snapshot = await ref.put(file);
        const url = await snapshot.ref.getDownloadURL();
        urls.push(url);
      }
      nuevoTerreno.imagenes = urls;
    }

    const archivoDoc = archivoDocInput?.files[0];
    if (archivoDoc) {
      const refDoc = storage.ref().child(`documentacion/${Date.now()}_${archivoDoc.name}`);
      const snap = await refDoc.put(archivoDoc);
      const docUrl = await snap.ref.getDownloadURL();
      nuevoTerreno.documentacion = docUrl;
    } else {
      nuevoTerreno.documentacion = '';
    }

    if (editId) {
      await db.collection('terrenos').doc(editId).update(nuevoTerreno);
      editId = null;
    } else {
      await db.collection('terrenos').add(nuevoTerreno);
    }

    form.reset();
    cargarTerrenos();
  });
});
