// ===== NAVBAR BURGER =====
const burger  = document.getElementById('burger');
const navInner = document.querySelector('.nav-inner');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const downloadBtn = document.getElementById('downloadBtn');
const demoDescription = document.getElementById('demoDescription');
const demoNote = document.getElementById('demoNote');
const demoLockNote = document.getElementById('demoLockNote');
const downloadModal = document.getElementById('downloadModal');
const downloadUnlockForm = document.getElementById('downloadUnlockForm');
const dlPassword = document.getElementById('dlPassword');
const dlModalError = document.getElementById('dlModalError');
const heroShowcaseImg = document.getElementById('heroShowcaseImg');
const shot1 = document.getElementById('shot-1');
const shot2 = document.getElementById('shot-2');
const shot3 = document.getElementById('shot-3');

/** v2: eski kayıtlarda boş downloadUrl vb. şifre/indirmeyi kırıyordu */
const STORAGE_KEY = 'marketpos-site-config-v2';
const ASSET_VER = '20260419';

// Cloudflare Pages: Git LFS dosyası deploy'a genelde girmez. İndirmeyi hosting'de tutmak en sorunsuz yol.
const SETUP_DOWNLOAD_URL =
  'https://dl.marketposs.com/MarketPOS-Setup-0.1.100.exe';

const DEFAULTS = {
  demoUrl: '',
  downloadUrl: SETUP_DOWNLOAD_URL,
  demoDescription:
    'Windows kurulum dosyasını indirip MarketPOS’u kendi bilgisayarınızda deneyebilirsiniz. İndirme, size iletilen erişim şifresi ile açılır.',
  shot1: `assets/marketpos-dashboard.png?v=${ASSET_VER}`,
  shot2: `assets/marketpos-products.png?v=${ASSET_VER}`,
  shot3: `assets/marketpos-reports.png?v=${ASSET_VER}`,
};

const DOWNLOAD_PWD_HASH_HEX = 'efa6bce1bc3d0129d2ce21d62d56d8910d3839a275c5d28fb6d6a376fa9ba72f';

// İletişim formu: FormSubmit (statik sayfalar). Gelen kutuyu script.js içinde CONTACT_FORM_EMAIL ile eşleştirin.
const CONTACT_FORM_EMAIL = 'info@marketposs.com';

let resolvedDownloadUrl = DEFAULTS.downloadUrl;

async function sha256Hex(text) {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function triggerFileDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || '';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function openDownloadModal() {
  if (!downloadModal) return;
  downloadModal.classList.add('is-open');
  downloadModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (dlModalError) {
    dlModalError.hidden = true;
  }
  if (dlPassword) {
    dlPassword.value = '';
    dlPassword.focus();
  }
}

function closeDownloadModal() {
  if (!downloadModal) return;
  downloadModal.classList.remove('is-open');
  downloadModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

async function tryUnlockAndDownload() {
  if (!dlPassword || !resolvedDownloadUrl) return false;
  const entered = dlPassword.value.trim();
  const hex = await sha256Hex(entered);
  if (hex !== DOWNLOAD_PWD_HASH_HEX) {
    if (dlModalError) dlModalError.hidden = false;
    return false;
  }
  closeDownloadModal();
  triggerFileDownload(resolvedDownloadUrl, 'MarketPOS-Setup-0.1.100.exe');
  return true;
}

function loadSiteConfig() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { ...DEFAULTS };
  }

  try {
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULTS, ...parsed };
    const du = merged.downloadUrl && String(merged.downloadUrl).trim();
    if (!du) merged.downloadUrl = DEFAULTS.downloadUrl;
    ['shot1', 'shot2', 'shot3', 'sh2', 'sh3'].forEach((k) => {
      if (merged[k] !== undefined && merged[k] !== null && !String(merged[k]).trim()) {
        delete merged[k];
      }
    });
    return { ...DEFAULTS, ...merged };
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
  if (heroShowcaseImg && cfg.shot1) {
    heroShowcaseImg.src = cfg.shot1;
  }
  if (shot2) {
    shot2.src = cfg.shot2 || cfg.sh2 || DEFAULTS.shot2;
  }
  if (shot3) {
    shot3.src = cfg.shot3 || cfg.sh3 || DEFAULTS.shot3;
  }

  const downloadUrl = (cfg.downloadUrl && String(cfg.downloadUrl).trim()) || DEFAULTS.downloadUrl;
  const hasDownload = Boolean(downloadUrl);
  resolvedDownloadUrl = hasDownload ? downloadUrl : '';

  if (downloadBtn) {
    downloadBtn.disabled = !hasDownload;
    downloadBtn.classList.toggle('is-disabled', !hasDownload);
    downloadBtn.setAttribute('aria-disabled', String(!hasDownload));
  }

  if (demoLockNote) {
    demoLockNote.hidden = !hasDownload;
  }

  if (demoNote) {
    demoNote.textContent = hasDownload
      ? 'Butona tıklayıp şifreyi girdikten sonra kurulum indirilir. Bu oturumda bir kez doğrulama yeterlidir.'
      : 'Kurulum bağlantısı henüz ayarlanmadı. İletişim formundan demo talep edebilirsin.';
  }
}

applySiteConfig();

if (downloadBtn && resolvedDownloadUrl) {
  downloadBtn.addEventListener('click', () => {
    if (downloadBtn.disabled) return;
    openDownloadModal();
  });
}

if (downloadUnlockForm) {
  downloadUnlockForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await tryUnlockAndDownload();
  });
}

if (downloadModal) {
  downloadModal.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', () => closeDownloadModal());
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && downloadModal.classList.contains('is-open')) {
      closeDownloadModal();
    }
  });
}

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

async function submitContactForm(event) {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());

  if (payload._gotcha) {
    return;
  }

  if (!payload.name || !payload.email || !payload.message) {
    formStatus.textContent = 'Lütfen tüm alanları doldurunuz.';
    formStatus.className = 'form-status error';
    return;
  }

  formStatus.textContent = 'Mesaj gönderiliyor...';
  formStatus.className = 'form-status';

  try {
    const res = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_FORM_EMAIL)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          message: payload.message,
          _subject: `MarketPos iletişim: ${payload.name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      }
    );

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Gönderim başarısız');
    }

    formStatus.textContent = `Teşekkürler ${payload.name}, mesajınız bize ulaştı.`;
    formStatus.className = 'form-status success';
    contactForm.reset();
  } catch (error) {
    formStatus.textContent =
      'Mesaj gönderilemedi. Lütfen biraz sonra tekrar deneyin veya doğrudan e-posta ile yazın.';
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

// ===== LIGHTBOX =====
const overlay = document.createElement('div');
overlay.className = 'lightbox-overlay';
overlay.innerHTML = '<button class="lightbox-close" aria-label="Kapat">&times;<\/button><img src="" alt="Ekran görüntüsü" />';
document.body.appendChild(overlay);

const lbImg = overlay.querySelector('img');
const lbClose = overlay.querySelector('.lightbox-close');

document.querySelectorAll('.screenshot-card img').forEach((img) => {
  img.addEventListener('click', () => {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  lbImg.src = '';
}

lbClose.addEventListener('click', closeLightbox);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
