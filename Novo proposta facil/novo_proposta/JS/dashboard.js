const STORAGE_KEY = "budgets";

// pegar dados
function getBudgets() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// formatar dinheiro
function formatCurrency(value) {
  return "R$ " + Number(value || 0).toFixed(2).replace(".", ",");
}

// carregar dashboard
function loadDashboard() {
  const budgets = getBudgets();

  const totalCount = budgets.length;

  const totalValue = budgets.reduce((acc, item) => {
    return acc + (item.quantity * item.unitPrice);
  }, 0);

  const currentMonth = new Date().getMonth();
  const monthCount = budgets.filter(item => {
    if (!item.date) return false;
    return new Date(item.date).getMonth() === currentMonth;
  }).length;

  // jogar na tela
  document.getElementById("totalCount").textContent = totalCount;
  document.getElementById("totalValue").textContent = formatCurrency(totalValue);
  document.getElementById("monthCount").textContent = monthCount;

  // últimas propostas
  const last = budgets.slice(-5).reverse();
  const tbody = document.getElementById("lastProposals");

  tbody.innerHTML = "";

  last.forEach(item => {
    const total = item.quantity * item.unitPrice;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.title}</td>
      <td>${item.supplier}</td>
      <td>${formatCurrency(total)}</td>
      <td>${item.date}</td>
    `;

    tbody.appendChild(tr);
  });
}

// logout
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("proposta_session");
  window.location.href = "login.html";
});

// init
loadDashboard();
