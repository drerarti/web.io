document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-terreno');
    const lista = document.getElementById('lista-terrenos');
  
    let terrenos = JSON.parse(localStorage.getItem('terrenos')) || [];
    let editIndex = -1;
  
    function renderizarTerrenos() {
      lista.innerHTML = '<h2>Lista de Terrenos</h2>';
      const contenedor = document.createElement('div');
      contenedor.className = 'cards-terrenos';
  
      if (terrenos.length === 0) {
        contenedor.innerHTML = '<p>No hay terrenos registrados.</p>';
      }
  
      terrenos.forEach((terreno, index) => {
        const card = document.createElement('div');
        card.className = 'terreno-card';
        card.innerHTML = `
          <img src="${(terreno.imagenes?.[0]) || 'img/placeholder.jpg'}" alt="terreno">

          <div class="info">
            <h3>${terreno.titulo}</h3>
            <p>${terreno.descripcion}</p>
            <p><strong>Estado:</strong> ${terreno.estado}</p>
            <div class="acciones">
              <button class="btn-editar" data-index="${index}">✏️ Editar</button>
              <button class="btn-eliminar" data-index="${index}">🗑 Eliminar</button>
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
    }
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const titulo = document.getElementById('titulo').value;
      const descripcion = document.getElementById('descripcion').value;
      const estado = document.getElementById('estado').value;
      const imagenInput = document.getElementById('imagen');

const nuevoTerreno = {
  titulo,
  descripcion,
  estado,
  medidas: document.getElementById('medidas').value,
  area: document.getElementById('area').value,
  ubicacion: document.getElementById('ubicacion').value,
  documentacion: document.getElementById('documentacion').value,
  pago: document.getElementById('pago').value,
  beneficios: document.getElementById('beneficios').value,
  imagenes: [] // ahora usamos un array
};

      
  
      const guardar = () => {
        if (editIndex === -1) {
          terrenos.push(nuevoTerreno);
        } else {
          terrenos[editIndex] = nuevoTerreno;
          editIndex = -1;
        }
        localStorage.setItem('terrenos', JSON.stringify(terrenos));
        form.reset();
        renderizarTerrenos();
      };
  
      const files = imagenInput.files;

if (files.length > 0) {
  const readers = [];
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    readers.push(
      new Promise(resolve => {
        reader.onload = function (e) {
          nuevoTerreno.imagenes.push(e.target.result);
          resolve();
        };
        reader.readAsDataURL(files[i]);
      })
    );
  }

  Promise.all(readers).then(() => {
    guardar();
  });
} else {
  if (editIndex !== -1) {
    nuevoTerreno.imagenes = terrenos[editIndex].imagenes || [];
  }
  guardar();
}

    });
  
    function eliminarTerreno(e) {
      const index = e.target.dataset.index;
      if (confirm('¿Estás seguro de eliminar este terreno?')) {
        terrenos.splice(index, 1);
        localStorage.setItem('terrenos', JSON.stringify(terrenos));
        renderizarTerrenos();
      }
    }
  
    function cargarTerrenoEnFormulario(e) {
      editIndex = e.target.dataset.index;
      const terreno = terrenos[editIndex];
      document.getElementById('titulo').value = terreno.titulo;
      document.getElementById('descripcion').value = terreno.descripcion;
      document.getElementById('estado').value = terreno.estado;
      // No se puede volver a cargar el archivo imagen, se mantiene si no se cambia
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  
    renderizarTerrenos();
  });
  function renderizarTabla() {
    const tbody = document.getElementById('tabla-body');
    tbody.innerHTML = '';
  
    terrenos.forEach((terreno, index) => {
      const fila = document.createElement('tr');
  
      fila.innerHTML = `
        <td><input type="text" value="${terreno.titulo}" data-campo="titulo" data-index="${index}"></td>
        <td><input type="text" value="${terreno.descripcion}" data-campo="descripcion" data-index="${index}"></td>
        <td>
          <select data-campo="estado" data-index="${index}">
            <option value="disponible" ${terreno.estado === 'disponible' ? 'selected' : ''}>Disponible</option>
            <option value="reservado" ${terreno.estado === 'reservado' ? 'selected' : ''}>Reservado</option>
            <option value="vendido" ${terreno.estado === 'vendido' ? 'selected' : ''}>Vendido</option>
          </select>
        </td>
        <td>
          <button class="boton-guardar" data-index="${index}">Guardar</button>
          <button class="boton-eliminar" data-index="${index}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  
    document.querySelectorAll('.boton-guardar').forEach(btn =>
      btn.addEventListener('click', guardarDesdeTabla)
    );
    document.querySelectorAll('.boton-eliminar').forEach(btn =>
      btn.addEventListener('click', eliminarTerreno)
    );
  }
  function guardarDesdeTabla(e) {
    const index = e.target.dataset.index;
    const inputs = document.querySelectorAll(`[data-index="${index}"]`);
  
    inputs.forEach(input => {
      const campo = input.dataset.campo;
      terrenos[index][campo] = input.value;
    });
  
    localStorage.setItem('terrenos', JSON.stringify(terrenos));
    alert('Terreno actualizado correctamente');
    renderizarTerrenos();
    renderizarTabla();
  }
  renderizarTabla();
  function renderizarVistaLista() {
    const contenedor = document.getElementById('lista-admin');
    contenedor.innerHTML = '';
  
    if (terrenos.length === 0) {
      contenedor.innerHTML = '<p>No hay terrenos para mostrar.</p>';
      return;
    }
  
    terrenos.forEach((terreno, index) => {
      const card = document.createElement('div');
      card.className = 'card-admin';
  
      card.innerHTML = `
        <img src="${(terreno.imagenes?.[0]) || 'img/placeholder.jpg'}" alt="Terreno">
        <div class="card-info">
          <h3>${terreno.titulo}</h3>
          <p>${terreno.descripcion}</p>
          <p><strong>Estado:</strong></p>
          <select onchange="actualizarEstado(${index}, this.value)">
            <option value="disponible" ${terreno.estado === 'disponible' ? 'selected' : ''}>Disponible</option>
            <option value="reservado" ${terreno.estado === 'reservado' ? 'selected' : ''}>Reservado</option>
            <option value="vendido" ${terreno.estado === 'vendido' ? 'selected' : ''}>Vendido</option>
          </select>
          <div class="card-actions">
            <button class="editar" onclick="cargarTerrenoEnFormularioDesdeVista(${index})">Editar</button>
            <button class="eliminar" onclick="eliminarTerrenoDesdeVista(${index})">Eliminar</button>
          </div>
        </div>
      `;
  
      contenedor.appendChild(card);
    });
  }
  function actualizarEstado(index, nuevoEstado) {
    terrenos[index].estado = nuevoEstado;
    localStorage.setItem('terrenos', JSON.stringify(terrenos));
    alert('Estado actualizado');
  }
  
  function cargarTerrenoEnFormularioDesdeVista(index) {
    const terreno = terrenos[index];
    document.getElementById('titulo').value = terreno.titulo;
    document.getElementById('descripcion').value = terreno.descripcion;
    document.getElementById('estado').value = terreno.estado;
    editIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  function eliminarTerrenoDesdeVista(index) {
    if (confirm('¿Seguro que deseas eliminar este terreno?')) {
      terrenos.splice(index, 1);
      localStorage.setItem('terrenos', JSON.stringify(terrenos));
      renderizarVistaLista();
      renderizarTerrenos?.();
      renderizarTabla?.();
    }
  }
          