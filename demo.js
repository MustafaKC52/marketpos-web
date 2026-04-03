const products = [
  { id: 1, barcode: '8690504010012', name: 'Sut 1L', category: 'Temel Gıda', price: 45, stock: 28 },
  { id: 2, barcode: '8690504010081', name: 'Tam Bugday Ekmek', category: 'Temel Gıda', price: 12.5, stock: 20 },
  { id: 3, barcode: '8690530000114', name: 'Erikli 0.5L', category: 'İçecek', price: 8, stock: 48 },
  { id: 4, barcode: '8690530001234', name: 'Kola 1L', category: 'İçecek', price: 37.5, stock: 16 },
  { id: 5, barcode: '8691234567000', name: 'Burcak Biskuvi', category: 'Atıştırmalık', price: 22, stock: 12 },
  { id: 6, barcode: '8692223334445', name: 'Bulasik Deterjani', category: 'Temizlik', price: 74.9, stock: 9 },
  { id: 7, barcode: '8699876543210', name: 'Pirinç 1kg', category: 'Temel Gıda', price: 68, stock: 14 },
  { id: 8, barcode: '8695551112223', name: 'Cips Aile Boy', category: 'Atıştırmalık', price: 36, stock: 7 },
];

const cart = [];

const productGrid = document.getElementById('productGrid');
const cartList = document.getElementById('cartList');
const cartMeta = document.getElementById('cartMeta');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutStatus = document.getElementById('checkoutStatus');
const resetDemoBtn = document.getElementById('resetDemo');

function formatMoney(value) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
}

function findProduct(id) {
  return products.find((p) => p.id === id);
}

function renderProducts() {
  const q = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filtered = products.filter((p) => {
    const categoryOk = selectedCategory === 'all' || p.category === selectedCategory;
    const queryOk = !q || p.name.toLowerCase().includes(q) || p.barcode.includes(q);
    return categoryOk && queryOk;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = '<p class="cart-empty">Aramana uygun urun bulunamadi.</p>';
    return;
  }

  productGrid.innerHTML = filtered.map((p) => `
    <article class="product">
      <h3>${p.name}</h3>
      <div class="meta">${p.category} • ${p.barcode}</div>
      <div class="price-row">
        <strong>${formatMoney(p.price)}</strong>
        <span class="stock ${p.stock <= 8 ? 'low' : ''}">Stok: ${p.stock}</span>
      </div>
      <button class="add-btn" data-add="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>Sepete Ekle</button>
    </article>
  `).join('');
}

function addToCart(id) {
  const product = findProduct(id);
  if (!product || product.stock <= 0) {
    return;
  }

  const line = cart.find((item) => item.id === id);
  if (line) {
    line.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }

  product.stock -= 1;
  renderProducts();
  renderCart();
}

function adjustQty(id, delta) {
  const line = cart.find((item) => item.id === id);
  const product = findProduct(id);
  if (!line || !product) {
    return;
  }

  if (delta > 0 && product.stock <= 0) {
    return;
  }

  line.qty += delta;
  product.stock -= delta;

  if (line.qty <= 0) {
    const index = cart.findIndex((item) => item.id === id);
    if (index >= 0) {
      cart.splice(index, 1);
    }
  }

  renderProducts();
  renderCart();
}

function getTotals() {
  const subtotal = cart.reduce((acc, line) => {
    const p = findProduct(line.id);
    return acc + (p ? p.price * line.qty : 0);
  }, 0);

  const tax = subtotal * 0.18;
  return {
    subtotal,
    tax,
    total: subtotal + tax,
  };
}

function renderCart() {
  if (cart.length === 0) {
    cartList.innerHTML = '<p class="cart-empty">Sepet bos. Urun secerek baslayabilirsin.</p>';
    cartMeta.textContent = '0 urun';
  } else {
    cartList.innerHTML = cart.map((line) => {
      const p = findProduct(line.id);
      return `
        <article class="cart-item">
          <div class="item-top">
            <strong>${p.name}</strong>
            <span>${formatMoney(p.price * line.qty)}</span>
          </div>
          <div class="qty-row">
            <button class="qty-btn" data-qty="${p.id}" data-delta="-1">-</button>
            <span>${line.qty} adet</span>
            <button class="qty-btn" data-qty="${p.id}" data-delta="1">+</button>
          </div>
        </article>
      `;
    }).join('');

    const totalQty = cart.reduce((acc, line) => acc + line.qty, 0);
    cartMeta.textContent = `${totalQty} urun`;
  }

  const totals = getTotals();
  subtotalEl.textContent = formatMoney(totals.subtotal);
  taxEl.textContent = formatMoney(totals.tax);
  totalEl.textContent = formatMoney(totals.total);
}

function checkout() {
  if (cart.length === 0) {
    checkoutStatus.textContent = 'Sepet bosken odeme alinamaz.';
    checkoutStatus.className = 'status warn';
    return;
  }

  const method = document.querySelector('input[name="pay"]:checked')?.value || 'Nakit';
  const totals = getTotals();

  checkoutStatus.textContent = `${formatMoney(totals.total)} tutarli satis ${method} ile tamamlandi.`;
  checkoutStatus.className = 'status ok';

  cart.length = 0;
  renderCart();
}

function resetDemo() {
  products.forEach((p, i) => {
    p.stock = [28, 20, 48, 16, 12, 9, 14, 7][i];
  });
  cart.length = 0;
  checkoutStatus.textContent = 'Demo sifirlandi.';
  checkoutStatus.className = 'status ok';
  renderProducts();
  renderCart();
}

productGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (!btn) {
    return;
  }
  addToCart(Number(btn.dataset.add));
});

cartList.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-qty]');
  if (!btn) {
    return;
  }

  const id = Number(btn.dataset.qty);
  const delta = Number(btn.dataset.delta);
  adjustQty(id, delta);
});

searchInput.addEventListener('input', renderProducts);
categoryFilter.addEventListener('change', renderProducts);
checkoutBtn.addEventListener('click', checkout);
resetDemoBtn.addEventListener('click', resetDemo);

renderProducts();
renderCart();
