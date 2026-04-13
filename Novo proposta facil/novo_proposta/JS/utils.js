export function generateId() {
  return "b_" + Date.now() + "_" + Math.floor(Math.random() * 9999);
}

export function formatCurrency(value) {
  return "R$ " + Number(value || 0).toFixed(2).replace(".", ",");
}

export function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
