/**
 * MarketPOS — ortak site kabuğu (header mobil menü + tam footer).
 * Sektör ve yasal sayfalarda tek kaynak; ana sayfa kendi HTML'ini kullanır.
 */
(function () {
  'use strict';

  var SITE_VER = '20260730';

  function rootPrefix() {
    var path = (window.location.pathname || '/').replace(/\\/g, '/');
    if (path.indexOf('/hesap/') !== -1 || path.indexOf('/blog/') !== -1) {
      return '../';
    }
    return '';
  }

  function homeHref(hash) {
    var prefix = rootPrefix();
    var base = prefix + 'index.html';
    return hash ? base + hash : base;
  }

  function asset(path) {
    return rootPrefix() + path + '?v=' + SITE_VER;
  }

  var NAV_LINKS = [
    { label: 'Özellikler', href: homeHref('#features') },
    { label: 'Canlı Demo', href: rootPrefix() + 'canli-demo.html' },
    { label: 'Fiyat', href: homeHref('#pricing') },
    { label: 'Blog', href: rootPrefix() + 'blog/index.html' },
    { label: 'Hesabım', href: rootPrefix() + 'hesap/giris.html' },
    { label: 'İletişim', href: homeHref('#contact') },
  ];

  function setupMobileNav(header) {
    var navInner = header.querySelector('.nav-inner');
    if (!navInner) return;

    var burger = navInner.querySelector('.burger');
    if (!burger) {
      burger = document.createElement('button');
      burger.type = 'button';
      burger.className = 'burger';
      burger.setAttribute('aria-label', 'Menüyü aç/kapat');
      burger.setAttribute('aria-expanded', 'false');
      burger.innerHTML = '<span></span><span></span><span></span>';
      navInner.appendChild(burger);
    }

    burger.addEventListener('click', function () {
      var open = navInner.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
      if (!navInner.contains(e.target)) {
        navInner.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });

    navInner.querySelectorAll('.main-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        navInner.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function enhanceHeader() {
    var header = document.querySelector('.site-header');
    if (!header || header.dataset.chromeEnhanced === '1') return;
    header.dataset.chromeEnhanced = '1';

    if (!header.id) header.id = 'navbar';

    var navInner = header.querySelector('.nav-inner');
    if (!navInner) return;

    var nav = navInner.querySelector('.main-nav');
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'main-nav';
      nav.setAttribute('aria-label', 'Ana menü');
      var ul = document.createElement('ul');
      NAV_LINKS.forEach(function (item) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        li.appendChild(a);
        ul.appendChild(li);
      });
      nav.appendChild(ul);
      var logo = navInner.querySelector('.logo');
      if (logo && logo.nextSibling) {
        navInner.insertBefore(nav, logo.nextSibling);
      } else {
        navInner.appendChild(nav);
      }
    }

    if (!navInner.querySelector('.nav-cta')) {
      var cta = document.createElement('div');
      cta.className = 'nav-cta';
      cta.innerHTML =
        '<a class="btn btn-primary btn-sm" href="' +
        homeHref('#download') +
        '" data-open-download>MarketPOS\'u İndir</a>' +
        '<a class="btn btn-ghost btn-sm" href="' +
        rootPrefix() +
        'hesap/giris.html">Giriş</a>';
      var burgerSlot = navInner.querySelector('.burger');
      if (burgerSlot) {
        navInner.insertBefore(cta, burgerSlot);
      } else {
        navInner.appendChild(cta);
      }
    }

    setupMobileNav(header);

    window.addEventListener(
      'scroll',
      function () {
        if (window.scrollY > 12) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      },
      { passive: true },
    );
  }

  function footerHtml() {
    var p = rootPrefix();
    return (
      '<div class="container footer-grid">' +
      '<div class="footer-brand">' +
      '<img src="' +
      asset('assets/logo-full-tagline.png') +
      '" alt="MarketPOS" class="footer-logo" width="220" height="33" loading="lazy" />' +
      '<p>Market, bakkal, kasap ve perakende işletmeler için yerli POS yazılımı. Hızlı satış, stok ve raporlama tek panelde.</p>' +
      '<div class="footer-social">' +
      '<a href="https://wa.me/905510335916" target="_blank" rel="noopener">WhatsApp</a>' +
      '<a href="tel:+905510335916">0551 033 59 16</a>' +
      '<a href="mailto:info@marketposs.com">info@marketposs.com</a>' +
      '</div></div>' +
      '<div><h4>Sektörler</h4><ul>' +
      [
        ['market-programi.html', 'Market'],
        ['kasap-programi.html', 'Kasap'],
        ['manav-programi.html', 'Manav'],
        ['bakkal-programi.html', 'Bakkal'],
        ['sarkuteri-programi.html', 'Şarküteri'],
        ['kuruyemis-programi.html', 'Kuruyemiş'],
        ['mini-market-programi.html', 'Mini Market'],
        ['perakende-programi.html', 'Perakende'],
      ]
        .map(function (row) {
          return '<li><a href="' + p + row[0] + '">' + row[1] + '</a></li>';
        })
        .join('') +
      '</ul></div>' +
      '<div><h4>Ürün</h4><ul>' +
      [
        [homeHref('#features'), 'Özellikler'],
        [p + 'canli-demo.html', 'Canlı Demo'],
        [p + 'pricing.html', 'Fiyatlandırma'],
        [p + 'blog/index.html', 'Blog'],
        [homeHref('#download'), 'İndir'],
        [homeHref('#faq'), 'SSS'],
      ]
        .map(function (row) {
          return '<li><a href="' + row[0] + '">' + row[1] + '</a></li>';
        })
        .join('') +
      '</ul></div>' +
      '<div><h4>Destek</h4><ul>' +
      [
        [homeHref('#contact'), 'İletişim'],
        ['https://wa.me/905510335916', 'WhatsApp Destek'],
        ['tel:+905510335916', 'Telefon Destek'],
        ['mailto:info@marketposs.com', 'E-posta Destek'],
      ]
        .map(function (row) {
          var ext = row[0].indexOf('http') === 0 || row[0].indexOf('tel:') === 0 || row[0].indexOf('mailto:') === 0;
          return (
            '<li><a href="' +
            row[0] +
            '"' +
            (ext ? ' target="_blank" rel="noopener"' : '') +
            '>' +
            row[1] +
            '</a></li>'
          );
        })
        .join('') +
      '</ul></div>' +
      '<div><h4>Yasal</h4><ul>' +
      [
        ['kvkk-aydinlatma.html', 'KVKK Aydınlatma'],
        ['gizlilik-politikasi.html', 'Gizlilik Politikası'],
        ['kullanim-kosullari.html', 'Kullanım Koşulları'],
      ]
        .map(function (row) {
          return '<li><a href="' + p + row[0] + '">' + row[1] + '</a></li>';
        })
        .join('') +
      '</ul></div></div>' +
      '<div class="footer-bottom"><div class="container footer-bottom-inner">' +
      '<span>© ' +
      new Date().getFullYear() +
      ' MarketPOS. Tüm hakları saklıdır.</span>' +
      '<span class="muted">www.marketposs.com</span></div></div>'
    );
  }

  function renderFooter() {
    document.querySelectorAll('[data-site-chrome-footer]').forEach(function (el) {
      el.className = 'site-footer';
      el.innerHTML = footerHtml();
    });
  }

  function init() {
    enhanceHeader();
    renderFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.MarketposSiteChrome = { SITE_VER: SITE_VER, rootPrefix: rootPrefix, homeHref: homeHref };
})();
