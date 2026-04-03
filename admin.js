const STORAGE_KEY = 'marketpos-site-config';

const defaults = {
  demoUrl: '',
  downloadUrl: '',
  demoDescription: 'Canli demo ve kurulum baglantilarini admin panelden eklediginde ziyaretciler uygulamanin gercek surumune ulasabilir.',
  shot1: 'assets/checkout-screen.svg',
  shot2: 'assets/inventory-screen.svg',
  shot3: 'assets/reports-screen.svg',
};

const form = document.getElementById('adminForm');
const statusText = document.getElementById('adminStatus');
const resetBtn = document.getElementById('resetBtn');

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

function setStatus(text, type = 'success') {
  statusText.textContent = text;
  statusText.className = `status ${type}`;
}

function loadIntoForm() {
  const cfg = getConfig();
  Object.keys(cfg).forEach((key) => {
    if (form.elements[key]) {
      form.elements[key].value = cfg[key] || '';
    }
  });
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

form.addEventListener('submit', saveConfig);
resetBtn.addEventListener('click', resetConfig);

loadIntoForm();
