const STORAGE_KEY = 'marketpos-site-config';
const JWT_TOKEN_KEY = 'marketpos-admin-token';

const defaults = {
  demoUrl: 'demo.html',
  downloadUrl: '',
  demoDescription: 'Canli demo ve kurulum baglantilarini admin panelden eklediginde ziyaretciler uygulamanin gercek surumune ulasabilir.',
  shot1: 'assets/checkout-screen.svg',
  shot2: 'assets/inventory-screen.svg',
  shot3: 'assets/reports-screen.svg',
};

const form = document.getElementById('adminForm');
const statusText = document.getElementById('adminStatus');
const resetBtn = document.getElementById('resetBtn');
const logoutBtn = document.getElementById('logoutBtn');
const adminUser = document.getElementById('adminUser');

function getToken() {
  return localStorage.getItem(JWT_TOKEN_KEY);
}

function parseToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  if (!token) return false;
  const payload = parseToken(token);
  if (!payload) return false;
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now && payload.role === 'admin';
}

function setStatus(text, type = 'success') {
  statusText.textContent = text;
  statusText.className = `status ${type}`;
}

function checkAuth() {
  const token = getToken();
  
  if (!token || !isTokenValid(token)) {
    window.location.href = '/login.html';
    return;
  }
  
  const payload = parseToken(token);
  if (adminUser) {
    adminUser.textContent = payload.user || 'Admin';
  }
}

function loadIntoForm() {
  const cfg = getConfig();
  Object.keys(cfg).forEach((key) => {
    if (form.elements[key]) {
      form.elements[key].value = cfg[key] || '';
    }
  });
}

function getConfig() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { ...defaults };
  }

  try {
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return { ...defaults };
  }
}

function saveConfig(event) {
  event.preventDefault();

  const payload = {
    demoUrl: form.demoUrl.value.trim(),
    downloadUrl: form.downloadUrl.value.trim(),
    demoDescription: form.demoDescription.value.trim() || defaults.demoDescription,
    shot1: form.shot1.value.trim() || defaults.shot1,
    shot2: form.shot2.value.trim() || defaults.shot2,
    shot3: form.shot3.value.trim() || defaults.shot3,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  setStatus('Ayarlar kaydedildi. Simdi siteye donup kontrol edebilirsin.');
}

function resetConfig() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  loadIntoForm();
  setStatus('Varsayilan ayarlara donuldu.');
}

// Authentication check on page load
window.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadIntoForm();
});

// Logout handler
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(JWT_TOKEN_KEY);
    window.location.href = '/login.html';
  });
}

form.addEventListener('submit', saveConfig);
resetBtn.addEventListener('click', resetConfig);

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    window.netlifyIdentity?.logout();
  });
}

initIdentityGuard();
loadIntoForm();
