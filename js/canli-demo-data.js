/** Örnek Market — canlı demo mock verisi (gerçek müşteri verisi değil) */
window.CANLI_DEMO_DATA = {
  storeName: "Örnek Market",
  stats: {
    todayRevenue: 42800,
    yesterdayRevenue: 38200,
    salesCount: 156,
    avgBasket: 274,
  },
  topProducts: [
    { name: "Su 1.5L", qty: 42, revenue: 546 },
    { name: "Ekmek", qty: 38, revenue: 475 },
    { name: "Süt 1L", qty: 31, revenue: 1395 },
    { name: "Yoğurt 1kg", qty: 24, revenue: 960 },
    { name: "Çay 1kg", qty: 18, revenue: 1260 },
  ],
  criticalStock: [
    { name: "Süt 1L", stock: 4, daysLeft: 2 },
    { name: "Yumurta 30'lu", stock: 6, daysLeft: 3 },
    { name: "Domates", stock: 8, daysLeft: 2 },
    { name: "Ekmek", stock: 12, daysLeft: 1 },
  ],
  decliningSales: [
    { name: "Cips Aile Boy", change: -35 },
    { name: "Kola 1L", change: -18 },
    { name: "Bisküvi", change: -12 },
  ],
  aiInsights: [
    {
      type: "order",
      title: "Bugün sipariş vermeniz gereken ürünler",
      body: "Süt 1L, yumurta ve ekmek kritik seviyede. Tedarikçinize bugün sipariş önerilir.",
    },
    {
      type: "warn",
      title: "Satışı düşen ürünler",
      body: "Cips satışları son 7 günde %35 düştü. Raf önü yerleşim veya paket kampanyası deneyin.",
    },
    {
      type: "campaign",
      title: "AI kampanya önerisi",
      body: "Cuma akşamı yoğurt ve ayran %15 indirim — geçmiş verilere göre ciro +%8 potansiyeli.",
    },
  ],
  products: [
    { id: 1, name: "Süt 1L", category: "Süt", price: 45, stock: 4, barcode: "8690504010012" },
    { id: 2, name: "Ekmek", category: "Fırın", price: 12.5, stock: 12, barcode: "8690504010081" },
    { id: 3, name: "Su 1.5L", category: "İçecek", price: 13, stock: 48, barcode: "8690530000114" },
    { id: 4, name: "Yoğurt 1kg", category: "Süt", price: 40, stock: 22, barcode: "8690530001234" },
    { id: 5, name: "Cips Aile", category: "Atıştırmalık", price: 36, stock: 7, barcode: "8691234567000" },
    { id: 6, name: "Domates", category: "Manav", price: 28, stock: 8, barcode: "2700001" },
  ],
  recentSales: [
    { time: "14:32", total: 184.5, items: 5, cashier: "Ayşe" },
    { time: "14:28", total: 92, items: 3, cashier: "Mehmet" },
    { time: "14:15", total: 356, items: 12, cashier: "Ayşe" },
    { time: "13:58", total: 67.5, items: 2, cashier: "Ayşe" },
  ],
};
