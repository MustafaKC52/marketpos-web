// ===== NAVBAR BURGER =====
const burger  = document.getElementById('burger');
const navInner = document.querySelector('.nav-inner');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const demoLink = document.getElementById('demoLink');
const downloadLink = document.getElementById('downloadLink');
const demoDescription = document.getElementById('demoDescription');
const demoNote = document.getElementById('demoNote');
const shot1 = document.getElementById('shot-1');
const shot2 = document.getElementById('shot-2');
const shot3 = document.getElementById('shot-3');

const STORAGE_KEY = 'marketpos-site-config';
const DEFAULTS = {
  demoUrl: '',
  downloadUrl: '',
  demoDescription: 'Canlı demo ve kurulum bağlantılarını admin panelden eklediğinde ziyaretçiler uygulamanın gerçek sürümüne ulaşabilir.',
  shot1: 'assets/checkout-screen.svg',
  shot2: 'assets/inventory-screen.svg',
  shot3: 'assets/reports-screen.svg',
};

function loadSiteConfig() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { ...DEFAULTS };
  }

  try {
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

function applySiteConfig() {
  const cfg = loadSiteConfig();

  if (demoDescription) {
    demoDescription.textContent = cfg.demoDescription;
  }

  if (shot1) {
    shot1.src = cfg.shot1;
  }
  if (shot2) {
    shot2.src = cfg.sh2 || cfg.shot2;
  }
  if (shot3) {
    shot3.src = cfg.sh3 || cfg.shot3;
  }

  const hasDemo = Boolean(cfg.demoUrl);
  const hasDownload = Boolean(cfg.downloadUrl);

  if (demoLink) {
    demoLink.href = hasDemo ? cfg.demoUrl : '#';
    demoLink.classList.toggle('is-disabled', !hasDemo);
    demoLink.setAttribute('aria-disabled', String(!hasDemo));
  }

  if (downloadLink) {
    downloadLink.href = hasDownload ? cfg.downloadUrl : '#';
    downloadLink.classList.toggle('is-disabled', !hasDownload);
    downloadLink.setAttribute('aria-disabled', String(!hasDownload));
  }

  if (demoNote) {
    demoNote.textContent = hasDemo || hasDownload
      ? 'Bağlantılar aktif. Gerekirse Admin Panel üzerinden güncelleyebilirsin.'
      : 'Bağlantılar henüz ayarlanmadı. Panelden admin ayarı yap.';
  }
}

applySiteConfig();

if (burger && navInner) {
  burger.addEventListener('click', () => {
    navInner.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!navInner.contains(e.target)) {
      navInner.classList.remove('open');
    }
  });
}

// ===== NAVBAR SCROLL =====
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 10px 28px rgba(23,32,51,.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

// ===== CONTACT FORM =====
function encodeFormData(data) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}

async function submitContactForm(event) {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());

  if (!payload.name || !payload.email || !payload.message) {
    return;
  }

  formStatus.textContent = 'Mesaj gönderiliyor...';
  formStatus.className = 'form-status';

  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormData(payload),
    });

    formStatus.textContent = `Tesekkurler ${payload.name}, mesajin Netlify uzerinden alindi.`;
    formStatus.className = 'form-status success';
    contactForm.reset();
  } catch (error) {
    formStatus.textContent = 'Mesaj gonderilemedi. Lutfen biraz sonra tekrar deneyin.';
    formStatus.className = 'form-status error';
  }
}

if (contactForm) {
  contactForm.addEventListener('submit', submitContactForm);
}

// ===== SCROLL REVEAL (hafif) =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.feature-card, .stat-card, .reveal-item').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .55s ease, transform .55s ease';
  observer.observe(el);
});
