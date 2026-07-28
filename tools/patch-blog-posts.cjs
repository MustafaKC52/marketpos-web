const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'blog', 'posts');

const headerOld =
  '  <header class="blog-header"><div class="container blog-header-inner"><a href="../../index.html"><img class="logo-img" src="../../assets/logo-lockup.png?v=20260530" alt="MarketPOS" /></a><nav class="blog-nav"><a href="../index.html">← Blog</a><a class="btn btn-primary btn-sm" href="../../index.html#download" data-open-download>Hemen Dene</a></nav></div></header>';

const headerNew = `  <header class="blog-header">
    <div class="container blog-header-inner">
      <a href="../../index.html" class="logo"><img class="logo-img" src="../../assets/logo-lockup.png?v=20260530" alt="MarketPOS" /></a>
      <nav class="blog-nav" aria-label="Blog menü">
        <a href="../../index.html" class="blog-nav-home">Ana Sayfa</a>
        <a href="../../pricing.html" class="blog-nav-hide-sm">Fiyat</a>
        <a href="../index.html">Blog</a>
        <a class="btn btn-primary btn-sm" href="../../index.html#download" data-open-download>Hemen Dene</a>
      </nav>
    </div>
  </header>`;

const footerOld =
  '  <footer class="blog-footer-mini container"><p>© 2026 MarketPOS</p></footer>';

const footerNew = `  <footer class="blog-footer-mini container">
    <p>© 2026 MarketPOS</p>
    <nav aria-label="Alt menü">
      <a href="../../index.html">Ana Sayfa</a>
      <a href="../../pricing.html">Fiyatlandırma</a>
      <a href="../../index.html#download" data-open-download>Ücretsiz İndir</a>
      <a href="../../index.html#contact">İletişim</a>
    </nav>
  </footer>`;

for (const name of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
  const filePath = path.join(dir, name);
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes(headerOld)) {
    console.warn('header mismatch:', name);
    continue;
  }
  content = content.replace(headerOld, headerNew);
  content = content.replace(footerOld, footerNew);
  fs.writeFileSync(filePath, content);
  console.log('patched', name);
}
