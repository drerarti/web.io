
document.addEventListener("DOMContentLoaded", () => {
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Exportar a PDF";
  exportBtn.className = "btn-exportar";
  exportBtn.onclick = exportarTerrenosAPDF;
  document.body.prepend(exportBtn);
});

async function exportarTerrenosAPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const snapshot = await firebase.firestore().collection("terrenos").orderBy("creado", "desc").get();
  const data = [];

  snapshot.forEach(docSnap => {
    const t = docSnap.data();
    data.push([
      t.titulo || "",
      t.estado || "",
      t.area || "",
      (t.ubicacion || "").slice(0, 40),
      t.creado?.toDate().toLocaleDateString() || ""
    ]);
  });

  doc.text("Lista de Terrenos", 14, 15);
  doc.autoTable({
    startY: 20,
    head: [["Título", "Estado", "Área (m²)", "Ubicación", "Fecha"]],
    body: data
  });

  doc.save("terrenos.pdf");
}
