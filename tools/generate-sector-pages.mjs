/**
 * Sektör landing page üretici — node Web/tools/generate-sector-pages.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(__dirname, "..");

const SECTORS = [
  {
    slug: "market-programi",
    title: "Market POS Programı",
    h1: "Marketler için AI destekli POS programı",
    description:
      "Market POS programı: barkodlu satış, stok takibi, veresiye cari ve yapay zekâ satış analizleri. Offline çalışır, 14 gün ücretsiz.",
    features: ["Barkodlu hızlı satış", "Stok ve kritik seviye uyarıları", "Veresiye / cari hesap", "Gün sonu ciro raporu", "AI stok ve sipariş önerileri"],
    benefits: ["Kasa hızını artırır", "Fire ve stok kaybını azaltır", "Günlük kârlılığı görünür kılar", "Çoklu kasa ile büyümeye hazır"],
  },
  {
    slug: "kasap-programi",
    title: "Kasap Programı — Tartı & Fire Takibi",
    h1: "Kasap ve et reyonu için profesyonel kasa programı",
    description:
      "Kasap programı: tartı entegrasyonu, fire takibi, parça bazlı ürün yönetimi ve günlük kâr analizi. MarketPOS ile kasap reyonunuzu dijitalleştirin.",
    features: ["Tartı entegrasyonu", "Fire takibi", "Parça bazlı ürün yönetimi", "Günlük kâr analizi", "Barkodlu etiket ve satış"],
    benefits: ["Fire oranını kontrol altına alır", "Kg bazlı satışta hata payını düşürür", "Reyon kârlılığını anlık gösterir"],
  },
  {
    slug: "manav-programi",
    title: "Manav Programı — Kg Satış & Stok",
    h1: "Manav ve sebze-meyve reyonu için POS",
    description:
      "Manav programı: kilogram satış, terazi bağlantısı, günlük taze ürün stoku ve AI ile sipariş önerisi. Türkiye'nin yerli manav kasa yazılımı.",
    features: ["Kg / adet karma satış", "Terazi entegrasyonu", "Günlük taze stok takibi", "Reyon bazlı raporlar", "AI tükenme tahmini"],
    benefits: ["Fireyi azaltır", "Taze ürün rotasyonunu hızlandırır", "Yoğun saatlerde kasayı rahatlatır"],
  },
  {
    slug: "bakkal-programi",
    title: "Bakkal Dükkanı Programı",
    h1: "Mahalle bakkalı için kolay POS programı",
    description:
      "Bakkal programı: veresiye defteri dijital, barkodlu satış, stok takibi ve WhatsApp destek. Küçük işletmeler için sade arayüz.",
    features: ["Veresiye / cari takip", "Barkodsuz hızlı satış", "Basit stok yönetimi", "Offline çalışma", "AI günlük öneriler"],
    benefits: ["Veresiye hatalarını önler", "Kurulumu hızlıdır", "İnternet kesilse de satış devam eder"],
  },
  {
    slug: "sarkuteri-programi",
    title: "Şarküteri Programı",
    h1: "Şarküteri reyonu için kasa ve stok programı",
    description:
      "Şarküteri programı: gramaj satış, SKT takibi, reyon etiketi ve kampanya yönetimi. AI ile birlikte satılan ürün önerileri.",
    features: ["Gramaj / paket satış", "SKT ve raf ömrü takibi", "Kampanya ve indirim planları", "Reyon etiketi yazdırma", "AI çapraz satış önerileri"],
    benefits: ["SKT firelerini azaltır", "Paket kampanyaları kolaylaştırır", "Reyon kârlılığını artırır"],
  },
  {
    slug: "kuruyemis-programi",
    title: "Kuruyemişçi Programı",
    h1: "Kuruyemiş ve baharat reyonu POS",
    description:
      "Kuruyemiş programı: tartılı satış, karışık paket, stok ve kâr marjı takibi. AI ile hızlı tükenen ürün uyarıları.",
    features: ["Tartılı satış", "Karışık paket / hizmet", "Kâr marjı raporu", "Barkod etiket", "AI sipariş zamanı"],
    benefits: ["Kg satışta doğruluk", "Popüler karışımları öne çıkarır", "Stok tükenmesini önceden gösterir"],
  },
  {
    slug: "mini-market-programi",
    title: "Mini Market Programı",
    h1: "Mini market ve bakkal zinciri POS",
    description:
      "Mini market programı: çoklu kasa, merkezi stok görünümü, barkod katalog ve AI ciro tahmini. Büyüyen mini marketler için.",
    features: ["Çoklu kasa desteği", "Merkezi ürün kataloğu", "Bulut senkron", "Detaylı satış raporları", "AI ciro tahmini"],
    benefits: ["Şube büyümesine hazır", "Personel performansını izler", "Stok dağılımını optimize eder"],
  },
  {
    slug: "perakende-programi",
    title: "Perakende Satış Programı",
    h1: "Perakende mağazalar için AI destekli satış yazılımı",
    description:
      "Perakende programı: hızlı kasa, stok, müşteri cari, raporlar ve yapay zekâ işletme danışmanı. Tek platformda perakende yönetimi.",
    features: ["Hızlı satış ekranı", "Stok ve envanter", "Müşteri yönetimi", "Kârlılık haritası", "AI işletme danışmanı"],
    benefits: ["Operasyonu tek yerden yönetir", "Veriye dayalı karar aldırır", "Modern SaaS deneyimi sunar"],
  },
];

function pageHtml(s) {
  const url = `https://www.marketposs.com/${s.slug}.html`;
  const features = s.features.map((f) => `<li>${f}</li>`).join("");
  const benefits = s.benefits.map((b) => `<li>${b}</li>`).join("");

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${s.title} | MarketPOS — AI Destekli POS</title>
  <meta name="description" content="${s.description}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />
  <link rel="icon" href="favicon.svg?v=20260530" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css?v=20260730" />
  <link rel="stylesheet" href="saas.css?v=20260730" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MarketPOS — ${s.title}",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Windows",
    "description": "${s.description.replace(/"/g, '\\"')}",
    "url": "${url}",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY", "description": "14 gün ücretsiz deneme" }
  }
  </script>
</head>
<body id="top">
  <div class="bg-aurora" aria-hidden="true"><span class="aurora a1"></span><span class="aurora a2"></span></div>
  <div class="bg-grid" aria-hidden="true"></div>

  <header class="site-header" style="position:relative">
    <div class="container nav-inner">
      <a class="logo" href="index.html"><img class="logo-img" src="assets/logo-lockup.png?v=20260530" alt="MarketPOS" height="27" /></a>
      <nav class="main-nav"><ul>
        <li><a href="index.html#features">Özellikler</a></li>
        <li><a href="canli-demo.html">Canlı Demo</a></li>
        <li><a href="index.html#pricing">Fiyat</a></li>
        <li><a href="blog/index.html">Blog</a></li>
        <li><a href="index.html#demo-request">Demo Talep</a></li>
      </ul></nav>
      <a class="btn btn-primary btn-sm" href="index.html#download" data-open-download>14 Gün Ücretsiz</a>
    </div>
  </header>

  <main>
    <section class="sector-hero container">
      <span class="eyebrow">MarketPOS · Sektörel çözüm</span>
      <h1>${s.h1}</h1>
      <p class="lead" style="max-width:42rem;margin:1rem auto 1.5rem">${s.description}</p>
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:center">
        <a class="btn btn-primary btn-lg" href="index.html#download" data-open-download>14 Gün Ücretsiz Dene</a>
        <a class="btn btn-ai btn-lg" href="index.html#demo-request">Demo Talep Et</a>
        <a class="btn btn-secondary" href="canli-demo.html">Canlı Demo</a>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 style="text-align:center;margin-bottom:1.5rem">Sektöre özel <span class="gradient-text">özellikler</span></h2>
        <div class="sector-features">
          ${s.features.map((f) => `<article class="sector-feature"><strong>${f}</strong><p style="margin:0.35rem 0 0;font-size:0.88rem;color:var(--muted)">MarketPOS ile hazır — ek modül gerekmez.</p></article>`).join("")}
        </div>
      </div>
    </section>

    <section class="section section-ai-platform">
      <div class="container" style="max-width:40rem">
        <h2 style="text-align:center">İşletmenize <span class="gradient-text-ai">sağladığı faydalar</span></h2>
        <ul class="sector-benefits" style="margin-top:1.25rem">${benefits}</ul>
      </div>
    </section>

    <section class="section" id="demo-request">
      <div class="container contact-inner">
        <header class="section-head"><h2>${s.title.split("—")[0].trim()} için <span class="gradient-text">demo planlayın</span></h2></header>
        <p style="text-align:center;margin-bottom:1.5rem"><a class="btn btn-wa btn-lg" href="https://wa.me/905510335916?text=${encodeURIComponent("Merhaba, " + s.title + " hakkında demo istiyorum.")}" target="_blank" rel="noopener">WhatsApp ile Demo Talep Et</a></p>
      </div>
    </section>
  </main>

  <footer class="site-footer" style="padding:2rem 0;border-top:1px solid var(--line)">
    <div class="container" style="text-align:center;font-size:0.85rem;color:var(--muted)">
      <a href="index.html">← MarketPOS Ana Sayfa</a>
    </div>
  </footer>
  <script src="script.js?v=20260730" defer data-cfasync="false"></script>
</body>
</html>`;
}

for (const s of SECTORS) {
  const out = path.join(WEB, `${s.slug}.html`);
  fs.writeFileSync(out, pageHtml(s), "utf8");
  console.log("Wrote", out);
}

console.log("Done:", SECTORS.length, "sector pages");
