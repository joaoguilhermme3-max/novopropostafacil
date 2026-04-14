const SESSION_KEY = "proposta_session";

export function ensureAuthenticated() {
  if (!localStorage.getItem(SESSION_KEY)) {
    window.location.href = "login.html";
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "../login.html";
}
