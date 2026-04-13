import { generateId }            from "./utils.js";
import { getBudgets, saveBudgets } from "./storage.js";
import { ensureAuthenticated, logout } from "./auth.js";
import { renderTable }             from "./ui.js";

// ─── Referências do DOM ───────────────────────────────────────────────────────
const form     = document.getElementById("form");
const tbody    = document.getElementById("tbody");
const q        = document.getElementById("q");
const btnClear = document.getElementById("btnClear");
const logoutBtn = document.getElementById("logout");

const inputs = {
  id:       document.getElementById("id"),
  title:    document.getElementById("title"),
  supplier: document.getElementById("supplier"),
  category: document.getElementById("category"),
  status:   document.getElementById("status"),
  date:     document.getElementById("date"),
  notes:    document.getElementById("notes"),
};

// ─── Estado ───────────────────────────────────────────────────────────────────
let budgets = [];

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  ensureAuthenticated();
  budgets = getBudgets();
  renderTable(tbody, budgets);

  // ── Salvar / Editar ─────────────────────────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const itens = window.PF.coletarItens();

    if (!itens.length) {
      alert("Adicione pelo menos um item ao orçamento.");
      return;
    }

    const total = itens.reduce((acc, i) => acc + i.qty * i.price, 0);

    const data = {
      title:    inputs.title.value.trim(),
      supplier: inputs.supplier.value.trim(),
      category: inputs.category.value,
      status:   inputs.status.value,
      date:     inputs.date.value,
      notes:    inputs.notes.value.trim(),
      itens,
      total,
    };

    if (!data.title || !data.supplier || !data.category) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    if (inputs.id.value) {
      // Edição
      budgets = budgets.map(b =>
        b.id === inputs.id.value ? { ...b, ...data } : b
      );
    } else {
      // Novo
      budgets.push({ id: generateId(), ...data });
    }

    saveBudgets(budgets);
    renderTable(tbody, budgets);
    form.reset();
    inputs.id.value = "";
    window.PF.limparItens();
  });

  // ── Ações na tabela (editar / excluir) ─────────────────────────────────────
  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id     = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === "delete") {
      if (confirm("Deseja excluir esta proposta?")) {
        budgets = budgets.filter(b => b.id !== id);
        saveBudgets(budgets);
        renderTable(tbody, budgets);
      }
    }

    if (action === "edit") {
      const item = budgets.find(b => b.id === id);
      if (!item) return;

      // Campos simples
      inputs.id.value       = item.id;
      inputs.title.value    = item.title    || "";
      inputs.supplier.value = item.supplier || "";
      inputs.category.value = item.category || "";
      inputs.status.value   = item.status   || "rascunho";
      inputs.date.value     = item.date     || "";
      inputs.notes.value    = item.notes    || "";

      // Itens múltiplos
      window.PF.carregarItens(item.itens || []);

      // Scroll para o formulário
      form.scrollIntoView({ behavior: "smooth" });
    }
  });

  // ── Pesquisa ─────────────────────────────────────────────────────────────────
  q.addEventListener("input", () => {
    const term = q.value.toLowerCase();
    const filtered = budgets.filter(b =>
      b.title?.toLowerCase().includes(term)    ||
      b.supplier?.toLowerCase().includes(term) ||
      b.category?.toLowerCase().includes(term) ||
      b.status?.toLowerCase().includes(term)
    );
    renderTable(tbody, filtered);
  });

  // ── Limpar tudo ──────────────────────────────────────────────────────────────
  btnClear.addEventListener("click", () => {
    if (confirm("Apagar todas as propostas?")) {
      budgets = [];
      saveBudgets(budgets);
      renderTable(tbody, budgets);
    }
  });

  // ── Logout ───────────────────────────────────────────────────────────────────
  logoutBtn.addEventListener("click", logout);
});