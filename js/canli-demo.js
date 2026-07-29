/** Canlı demo — tab geçişli Örnek Market paneli */
(function () {
  "use strict";

  var D = window.CANLI_DEMO_DATA;
  if (!D) return;

  function money(n) {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
  }

  function pctChange(a, b) {
    if (!b) return 0;
    return Math.round(((a - b) / b) * 100);
  }

  function renderDashboard(root) {
    var ch = pctChange(D.stats.todayRevenue, D.stats.yesterdayRevenue);
    root.innerHTML =
      '<div class="cd-stats">' +
      '<div class="cd-stat"><span>Bugünkü ciro</span><strong>' +
      money(D.stats.todayRevenue) +
      "</strong><em class=" +
      (ch >= 0 ? "up" : "down") +
      ">" +
      (ch >= 0 ? "▲" : "▼") +
      " %" +
      Math.abs(ch) +
      " dün</em></div>" +
      '<div class="cd-stat"><span>Satış adedi</span><strong>' +
      D.stats.salesCount +
      "</strong></div>" +
      '<div class="cd-stat"><span>Ort. sepet</span><strong>' +
      money(D.stats.avgBasket) +
      "</strong></div></div>" +
      '<div class="cd-cols"><div class="cd-panel"><h3>En çok satan</h3><ul class="cd-list">' +
      D.topProducts
        .map(function (p) {
          return "<li><span>" + p.name + "</span><strong>" + p.qty + " adet</strong></li>";
        })
        .join("") +
      "</ul></div>" +
      '<div class="cd-panel"><h3>Kritik stok</h3><ul class="cd-list">' +
      D.criticalStock
        .map(function (p) {
          return (
            "<li class='warn'><span>" +
            p.name +
            "</span><strong>" +
            p.stock +
            " · ~" +
            p.daysLeft +
            " gün</strong></li>"
          );
        })
        .join("") +
      "</ul></div></div>" +
      '<div class="cd-ai">' +
      D.aiInsights
        .map(function (i) {
          return (
            '<article class="cd-ai-card ' +
            i.type +
            '"><h4>' +
            i.title +
            "</h4><p>" +
            i.body +
            "</p></article>"
          );
        })
        .join("") +
      "</div>";
  }

  function renderProducts(root) {
    root.innerHTML =
      '<table class="cd-table"><thead><tr><th>Ürün</th><th>Kategori</th><th>Stok</th><th>Fiyat</th></tr></thead><tbody>' +
      D.products
        .map(function (p) {
          var low = p.stock <= 8 ? " class='warn'" : "";
          return (
            "<tr" +
            low +
            "><td>" +
            p.name +
            "</td><td>" +
            p.category +
            "</td><td>" +
            p.stock +
            "</td><td>" +
            money(p.price) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table>";
  }

  function renderSales(root) {
    root.innerHTML =
      '<ul class="cd-sales">' +
      D.recentSales
        .map(function (s) {
          return (
            "<li><span class='time'>" +
            s.time +
            "</span><span>" +
            s.items +
            " kalem · " +
            s.cashier +
            "</span><strong>" +
            money(s.total) +
            "</strong></li>"
          );
        })
        .join("") +
      "</ul>";
  }

  function renderStock(root) {
    root.innerHTML =
      '<div class="cd-panel"><h3>Kritik stok uyarıları</h3><ul class="cd-list">' +
      D.criticalStock
        .map(function (p) {
          return "<li class='warn'><span>" + p.name + "</span><strong>" + p.stock + " adet</strong></li>";
        })
        .join("") +
      "</ul></div>" +
      '<div class="cd-panel" style="margin-top:1rem"><h3>Satışı düşen ürünler</h3><ul class="cd-list">' +
      D.decliningSales
        .map(function (p) {
          return "<li><span>" + p.name + "</span><strong>%" + p.change + "</strong></li>";
        })
        .join("") +
      "</ul></div>";
  }

  function renderAi(root) {
    root.innerHTML =
      '<p class="cd-note">Mock AI önerileri — gerçek uygulamada kendi satış verilerinizden üretilir.</p>' +
      D.aiInsights
        .map(function (i) {
          return '<article class="cd-ai-card ' + i.type + '"><h4>' + i.title + "</h4><p>" + i.body + "</p></article>";
        })
        .join("");
  }

  var VIEWS = {
    dashboard: renderDashboard,
    products: renderProducts,
    sales: renderSales,
    stock: renderStock,
    ai: renderAi,
  };

  function init() {
    var tabs = document.querySelectorAll(".cd-tab");
    var body = document.getElementById("cdBody");
    if (!body || !tabs.length) return;

    function show(id) {
      tabs.forEach(function (t) {
        t.classList.toggle("active", t.dataset.view === id);
      });
      var fn = VIEWS[id] || VIEWS.dashboard;
      fn(body);
    }

    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        show(t.dataset.view);
      });
    });

    show("dashboard");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
