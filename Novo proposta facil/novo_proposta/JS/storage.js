const STORAGE_KEY = "budgets";

export function getBudgets() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveBudgets(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
