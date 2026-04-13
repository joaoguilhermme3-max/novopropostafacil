function formatBRL(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
 
/**
 * Retorna o HTML do badge de status.
 * @param {string} status
 * @returns {string}
 */
function statusBadge(status) {
  const mapa = {
    rascunho:  ["badge-rascunho",  "Rascunho"],
    cotacao:   ["badge-cotacao",   "Aguard. Cotação"],
    aprovacao: ["badge-aprovacao", "Aguard. Aprovação"],
    aprovado:  ["badge-aprovado",  "Aprovado"],
    rejeitado: ["badge-rejeitado", "Rejeitado"],
  };
  const [cls, label] = mapa[status] || ["badge-rascunho", status || "—"];
  return `<span class="badge-status ${cls}">${label}</span>`;
}
 
/**
 * Renderiza a lista de propostas no <tbody>.
 * @param {HTMLElement} tbody
 * @param {Array}       budgets
 */
export function renderTable(tbody, budgets) {
  if (!budgets.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:30px; color:#64748b;">
          Nenhuma proposta cadastrada.
        </td>
      </tr>`;
    return;
  }
 
  tbody.innerHTML = budgets.map(b => {
    const qtdItens = Array.isArray(b.itens) ? b.itens.length : (b.quantity ?? "—");
    const total    = b.total ?? (b.quantity * b.unitPrice) ?? 0;
 
    return `
      <tr>
        <td>${b.title || "—"}</td>
        <td>${b.supplier || "—"}</td>
        <td>${b.category || "—"}</td>
        <td style="text-align:center;">${qtdItens}</td>
        <td style="color:#7dd3fc; font-weight:600;">${formatBRL(total)}</td>
        <td>${statusBadge(b.status)}</td>
        <td>${b.date ? new Date(b.date + "T00:00:00").toLocaleDateString("pt-BR") : "—"}</td>
        <td style="white-space:nowrap;">
          <button class="btn-edit"   data-id="${b.id}" data-action="edit">✏️ Editar</button>
          <button class="btn-delete" data-id="${b.id}" data-action="delete">🗑️ Excluir</button>
        </td>
      </tr>`;
  }).join("");
}