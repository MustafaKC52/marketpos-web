// ===== NAVBAR BURGER =====
const burger  = document.getElementById('burger');
const navInner = document.querySelector('.nav-inner');

burger.addEventListener('click', () => {
  navInner.classList.toggle('open');
});

// Dışarı tıklanınca kapat
document.addEventListener('click', (e) => {
  if (!navInner.contains(e.target)) {
    navInner.classList.remove('open');
  }
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.boxShadow = '0 2px 16px rgba(0,0,0,.08)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) return;

  // Placeholder – backend entegrasyonu yapılacak
  alert(`Teşekkürler ${name}! Mesajınız alındı, en kısa sürede dönüş yapacağız.`);
  contactForm.reset();
});

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

document.querySelectorAll('.feature-card, .stat-card, .screenshot-placeholder').forEach((el) => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});
