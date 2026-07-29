/**
 * 100 SEO blog yazısı üretir: posts/*.html, index.html, sitemap-blog.xml
 * Kullanım: node Web/blog/generate-posts.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = join(__dir, "posts");
const BASE_URL = "https://www.marketposs.com";

/** @type {Array<{slug:string,title:string,tag:string,description:string}>} */
const ARTICLES = [
	{ slug: "market-nasil-acilir", title: "Market Nasıl Açılır?", tag: "İşletme", description: "Market açmak için ruhsat, sermaye, lokasyon ve ekipman adımlarını anlatan 2026 rehberi." },
	{ slug: "bakkal-dukkani-nasil-acilir", title: "Bakkal Dükkanı Nasıl Açılır?", tag: "İşletme", description: "Mahalle bakkalı açmak: belgeler, maliyet, raf düzeni ve ilk ay yapılacaklar." },
	{ slug: "mini-market-acmak-gerekli-belgeler", title: "Mini Market Açmak İçin Gerekli Belgeler", tag: "İşletme", description: "Mini market ruhsatı, iş yeri açma, gıda kayıt ve vergi levhası listesi." },
	{ slug: "market-acmak-ne-kadar-tutar", title: "Market Açmak Ne Kadar Tutar?", tag: "İşletme", description: "2026'da market açma maliyeti: kira, depozito, raf, kasa ve ilk stok bütçesi." },
	{ slug: "market-ruhsati-nasil-alinir", title: "Market Ruhsatı Nasıl Alınır?", tag: "İşletme", description: "Belediye ve il sağlık müdürlüğünden market ruhsatı alma süreci adım adım." },
	{ slug: "gida-isletmesi-acma-sartlari", title: "Gıda İşletmesi Açma Şartları (2026)", tag: "İşletme", description: "Gıda işletmesi açmak için hijyen, personel sağlık ve fiziki şartlar." },
	{ slug: "market-franchise-mi-kendi-markam-mi", title: "Market Franchise mı Kendi Markam mı?", tag: "İşletme", description: "Franchise ve bağımsız market karşılaştırması: maliyet, kâr ve özgürlük." },
	{ slug: "mahalle-marketi-isletmeciligi", title: "Mahalle Marketi İşletmeciliği Rehberi", tag: "İşletme", description: "Mahalle marketinde müşteri sadakati, veresiye ve stok yönetimi ipuçları." },
	{ slug: "market-acmadan-once-yapilacaklar", title: "Market Açmadan Önce Yapılması Gerekenler", tag: "İşletme", description: "Lokasyon analizi, rakip araştırması, tedarikçi görüşmeleri kontrol listesi." },
	{ slug: "perakende-isletme-plani-nasil-hazirlanir", title: "Perakende İşletme Planı Nasıl Hazırlanır?", tag: "İşletme", description: "Market iş planı şablonu: gelir tahmini, giderler ve nakit akışı." },

	{ slug: "pos-nedir", title: "POS Nedir?", tag: "POS", description: "POS (Point of Sale) sistemi nedir, market ve bakkal için neden gereklidir?" },
	{ slug: "market-pos-programi-nedir", title: "Market POS Programı Nedir?", tag: "POS", description: "Market POS yazılımının temel modülleri: satış, stok, cari ve raporlama." },
	{ slug: "barkod-sistemi-nedir", title: "Barkod Sistemi Nedir?", tag: "POS", description: "Barkod türleri, EAN-13 ve market satışında barkod okuyucu kullanımı." },
	{ slug: "barkod-okuyucu-nasil-calisir", title: "Barkod Okuyucu Nasıl Çalışır?", tag: "POS", description: "USB ve kablosuz barkod okuyucu kurulumu, POS entegrasyonu ve sorun giderme." },
	{ slug: "ean-13-barkod-nedir", title: "EAN-13 Barkod Nedir?", tag: "POS", description: "Türkiye'de perakende barkod standardı EAN-13 nasıl okunur ve basılır?" },
	{ slug: "terazi-entegrasyonu-nedir", title: "Terazi Entegrasyonu Nedir?", tag: "POS", description: "Kasap, manav ve şarküteride elektronik terazi–POS bağlantısı rehberi." },
	{ slug: "kasa-yazilimi-muhasebe-farki", title: "Kasa Yazılımı ile Muhasebe Programı Farkı", tag: "POS", description: "POS ve muhasebe yazılımı görevleri; hangisi ne zaman kullanılır?" },
	{ slug: "bulut-pos-masaustu-pos", title: "Bulut POS mu Masaüstü POS mu?", tag: "POS", description: "İnternet kesintisinde satış: bulut ve offline masaüstü POS karşılaştırması." },
	{ slug: "offline-pos-neden-onemli", title: "Offline POS Neden Önemli?", tag: "POS", description: "Internetsiz çalışan kasa yazılımının marketlerde kritik avantajları." },
	{ slug: "hizli-satis-ekrani-nasil-olmali", title: "Hızlı Satış Ekranı Nasıl Olmalı?", tag: "POS", description: "Kasiyer verimliliği için hızlı satış arayüzü tasarım kriterleri." },

	{ slug: "markette-stok-nasil-tutulur", title: "Markette Stok Nasıl Tutulur?", tag: "Stok", description: "Market stok takibi: giriş-çıkış, sayım, kritik seviye ve POS entegrasyonu." },
	{ slug: "stok-sayimi-nasil-yapilir", title: "Stok Sayımı Nasıl Yapılır?", tag: "Stok", description: "Aylık stok sayımı adımları, fire kaydı ve sayım farkı analizi." },
	{ slug: "kritik-stok-seviyesi-nedir", title: "Kritik Stok Seviyesi Nedir?", tag: "Stok", description: "Kritik stok eşiği belirleme ve otomatik sipariş uyarıları." },
	{ slug: "fifo-stok-yonetimi-nedir", title: "FIFO Stok Yönetimi Nedir?", tag: "Stok", description: "İlk giren ilk çıkar: gıda marketlerinde FIFO uygulaması." },
	{ slug: "excel-ile-stok-takibi-yeterli-mi", title: "Excel ile Stok Takibi Yeterli mi?", tag: "Stok", description: "Excel stok listesinin limitleri ve POS'a geçiş zamanı." },
	{ slug: "stok-fire-kaydi-nasil-tutulur", title: "Stok Fire Kaydı Nasıl Tutulur?", tag: "Stok", description: "Bozulan, kırılan ve SKT geçen ürünlerde fire kayıt süreci." },
	{ slug: "depo-raf-organizasyonu", title: "Depo ve Raf Organizasyonu", tag: "Stok", description: "Market deposu düzeni, FIFO raf yerleşimi ve sayım kolaylığı." },
	{ slug: "tedarikci-siparis-planlamasi", title: "Tedarikçi Sipariş Planlaması", tag: "Stok", description: "Satış hızına göre otomatik sipariş önerisi ve tedarikçi takvimi." },
	{ slug: "hizli-tukenen-urunler-nasil-belirlenir", title: "Hızlı Tükenen Ürünler Nasıl Belirlenir?", tag: "Stok", description: "Günlük satış hızı, stok gün sayısı ve yeniden sipariş noktası." },
	{ slug: "stok-devir-hizi-nedir", title: "Stok Devir Hızı Nedir?", tag: "Stok", description: "Stok devir hızı formülü ve market kârlılığına etkisi." },
	{ slug: "az-satan-urunler-ne-yapilir", title: "Az Satan Ürünler Ne Yapılır?", tag: "Stok", description: "Düşük hızlı SKU'lar: indirim, de-listing ve raf alanı optimizasyonu." },
	{ slug: "kategori-bazli-stok-yonetimi", title: "Kategori Bazlı Stok Yönetimi", tag: "Stok", description: "Gıda, temizlik, içecek kategorilerinde ayrı stok politikaları." },
	{ slug: "dondurulmus-urun-stok-takibi", title: "Dondurulmuş Ürün Stok Takibi", tag: "Stok", description: "Soğuk depo stok sayımı ve sıcaklık kayıtları." },
	{ slug: "mesrubat-stok-yonetimi", title: "Meşrubat Stok Yönetimi İpuçları", tag: "Stok", description: "İçecek kategorisinde mevsimsel sipariş ve depo rotasyonu." },
	{ slug: "stok-sayim-farklari-nasil-onlenir", title: "Stok Sayım Farkları Nasıl Önlenir?", tag: "Stok", description: "Kayıp, hırsızlık ve barkod hatalarından kaynaklanan farklar." },

	{ slug: "market-karliligi-nasil-artirilir", title: "Market Kârlılığı Nasıl Artırılır?", tag: "Kâr", description: "Marj yönetimi, fiyat optimizasyonu ve stok verimliliği ile kâr artırma." },
	{ slug: "urun-fiyatlandirmasi-nasil-yapilir", title: "Ürün Fiyatlandırması Nasıl Yapılır?", tag: "Kâr", description: "Alış fiyatı, KDV ve raf marjı ile satış fiyatı belirleme." },
	{ slug: "kar-marji-nasil-hesaplanir", title: "Kâr Marjı Nasıl Hesaplanır?", tag: "Kâr", description: "Brüt marj, net kâr ve ürün bazlı kârlılık hesaplama formülleri." },
	{ slug: "rekabetci-fiyat-stratejisi", title: "Rekabetçi Fiyat Stratejisi", tag: "Kâr", description: "Rakip fiyat takibi ve dinamik fiyatlandırma markette." },
	{ slug: "kampanya-planlamasi-markette", title: "Kampanya Planlaması Markette", tag: "Kâr", description: "İndirim kampanyası planlama, marj koruma ve satış artışı ölçümü." },
	{ slug: "sepet-ortalamasi-nasil-artirilir", title: "Sepet Ortalaması Nasıl Artırılır?", tag: "Kâr", description: "Çapraz satış, raf yerleşimi ve kasa önerileri ile sepet büyütme." },
	{ slug: "zarar-ettiren-urunler-nasil-tespit-edilir", title: "Zarar Ettiren Ürünler Nasıl Tespit Edilir?", tag: "Kâr", description: "Negatif marjlı SKU analizi ve fiyat veya tedarikçi revizyonu." },
	{ slug: "raf-yerlesimi-satis-artirir-mi", title: "Raf Yerleşimi Satışları Artırır mı?", tag: "Kâr", description: "Planogram, göz hizası raf ve impulse buy alanları." },
	{ slug: "gun-sonu-ciro-analizi", title: "Gün Sonu Ciro Analizi", tag: "Kâr", description: "Günlük ciro raporu okuma, trend ve haftalık karşılaştırma." },
	{ slug: "en-cok-kar-birakan-urunler", title: "En Çok Kâr Bırakan Ürünler", tag: "Kâr", description: "Kâr haritası: yüksek hacim düşük marj vs. yıldız ürünler." },
	{ slug: "fiyat-artirimi-ne-zaman-yapilir", title: "Fiyat Artırımı Ne Zaman Yapılır?", tag: "Kâr", description: "Enflasyon döneminde fiyat güncelleme stratejisi ve müşteri iletişimi." },
	{ slug: "indirim-yapmadan-satis-artirma", title: "İndirim Yapmadan Satış Artırma", tag: "Kâr", description: "Marj koruyarak hacim artırma: birlikte satış ve raf optimizasyonu." },
	{ slug: "cuma-aksami-satis-stratejisi", title: "Cuma Akşamı Satış Stratejisi", tag: "Kâr", description: "Hafta sonu öncesi içecek ve atıştırmalık kampanya zamanlaması." },
	{ slug: "mevsimsel-satis-planlamasi", title: "Mevsimsel Satış Planlaması", tag: "Kâr", description: "Yaz-kış SKU planı, sipariş takvimi ve stok bütçesi." },

	{ slug: "son-kullanma-tarihi-nasil-takip-edilir", title: "Son Kullanma Tarihi Nasıl Takip Edilir?", tag: "Gıda", description: "SKT takibi: raf rotasyonu, uyarı sistemi ve fire önleme markette." },
	{ slug: "skt-yaklasan-urunler-ne-yapilir", title: "SKT Yaklaşan Ürünler Ne Yapılır?", tag: "Gıda", description: "Son kullanma tarihi yaklaşan ürünlerde indirim ve iade politikası." },
	{ slug: "gida-guvenligi-markette", title: "Gıda Güvenliği Markette", tag: "Gıda", description: "Market gıda güvenliği temel kuralları ve denetim hazırlığı." },
	{ slug: "soguk-zincir-takibi", title: "Soğuk Zincir Takibi", tag: "Gıda", description: "Süt, et ve dondurulmuş ürünlerde sıcaklık ve SKT kontrolü." },
	{ slug: "iade-bozulmus-urun-kaydi", title: "İade ve Bozulmuş Ürün Kaydı", tag: "Gıda", description: "Tedarikçi iadesi, fire fişi ve stok düzeltme süreci." },
	{ slug: "haccp-market-nedir", title: "HACCP Market İçin Nedir?", tag: "Gıda", description: "HACCP prensipleri ve küçük gıda işletmelerinde uygulama." },
	{ slug: "et-sut-urunlerinde-skt", title: "Et ve Süt Ürünlerinde SKT", tag: "Gıda", description: "Soğuk reyon SKT yönetimi ve günlük kontrol listesi." },
	{ slug: "raf-omru-yonetimi", title: "Raf Ömrü Yönetimi", tag: "Gıda", description: "Raf ömrü vs. son kullanma tarihi farkı ve FIFO uygulaması." },
	{ slug: "lot-numarasi-takibi", title: "Lot Numarası Takibi", tag: "Gıda", description: "Parti numarası ile geri çağırma ve tedarikçi izlenebilirlik." },
	{ slug: "gida-israfi-azaltma-markette", title: "Gıda İsrafını Azaltma Markette", tag: "Gıda", description: "SKT indirimi, bağış ve stok optimizasyonu ile israf azaltma." },

	{ slug: "veresiye-defteri-dijital-takip", title: "Veresiye Defteri Dijital Takip", tag: "Cari", description: "Veresiye kayıtlarını POS ile dijitalleştirme ve tahsilat takibi." },
	{ slug: "cari-hesap-risk-yonetimi", title: "Cari Hesap Risk Yönetimi", tag: "Cari", description: "Müşteri borç limiti, vade ve risk skoru belirleme." },
	{ slug: "musteri-borc-limiti-belirleme", title: "Müşteri Borç Limiti Belirleme", tag: "Cari", description: "Veresiye limiti politikası ve otomatik uyarı kuralları." },
	{ slug: "tahsilat-takibi-nasil-yapilir", title: "Tahsilat Takibi Nasıl Yapılır?", tag: "Cari", description: "Geciken alacaklar, hatırlatma ve nakit akışı yönetimi." },
	{ slug: "gunluk-kasa-kapanisi-rehberi", title: "Günlük Kasa Kapanışı Rehberi", tag: "Cari", description: "Gün sonu kasa sayımı, POS raporu ve nakit-kart mutabakatı." },
	{ slug: "kasa-acigi-neden-olur", title: "Kasa Açığı Neden Olur?", tag: "Cari", description: "Kasa farkı nedenleri: iade, yanlış para üstü, kayıt hataları." },
	{ slug: "nakit-kart-mutabakati", title: "Nakit ve Kart Mutabakatı", tag: "Cari", description: "POS slip toplamı ile banka havalesi eşleştirme rehberi." },
	{ slug: "gun-sonu-raporu-nasil-okunur", title: "Gün Sonu Raporu Nasıl Okunur?", tag: "Cari", description: "Z raporu, ciro özeti ve kâr satırlarını yorumlama." },
	{ slug: "kdv-perakende-fatura", title: "KDV ve Perakende Fatura", tag: "Cari", description: "Perakende satışta KDV oranları ve basit usul esnaf." },
	{ slug: "e-fatura-market-isletmeleri", title: "E-Fatura Market İşletmeleri", tag: "Cari", description: "Market ve bakkallarda e-fatura yükümlülüğü ve geçiş rehberi." },

	{ slug: "kasiyer-egitimi-rehberi", title: "Kasiyer Eğitimi Rehberi", tag: "Personel", description: "Yeni kasiyer eğitim programı: POS, müşteri ve stok temelleri." },
	{ slug: "market-personel-vardiya-plani", title: "Market Personel Vardiya Planı", tag: "Personel", description: "Yoğun saatlere göre vardiya çizelgesi ve kasa kapasitesi." },
	{ slug: "hirsizlik-onleme-markette", title: "Hırsızlık Önleme Markette", tag: "Personel", description: "Shrinkage azaltma: kamera, sayım ve kasa kontrolleri." },
	{ slug: "kasada-musteri-memnuniyeti", title: "Kasada Müşteri Memnuniyeti", tag: "Personel", description: "Hızlı checkout, güleryüz ve sorun çözme teknikleri." },
	{ slug: "yogun-saatlerde-kasa-yonetimi", title: "Yoğun Saatlerde Kasa Yönetimi", tag: "Personel", description: "Akşam ve hafta sonu kasa kuyruğu yönetimi ipuçları." },
	{ slug: "yeni-kasiyer-oryantasyonu", title: "Yeni Kasiyer Oryantasyonu", tag: "Personel", description: "İlk hafta kasiyer checklist: POS, iade, terazi ve güvenlik." },
	{ slug: "barkod-okuma-hatalari", title: "Barkod Okuma Hataları", tag: "Personel", description: "Okunmayan barkod, çift okuma ve manuel giriş prosedürü." },
	{ slug: "iade-islemi-nasil-yapilir", title: "İade İşlemi Nasıl Yapılır?", tag: "Personel", description: "POS üzerinden iade, stok geri alımı ve fiş iptali." },
	{ slug: "musteri-sikayeti-yonetimi", title: "Müşteri Şikayeti Yönetimi", tag: "Personel", description: "Şikayet kaydı, çözüm süresi ve müşteri geri kazanma." },
	{ slug: "market-hijyen-kontrol-listesi", title: "Market Hijyen Kontrol Listesi", tag: "Personel", description: "Günlük ve haftalık market hijyen denetim formu." },

	{ slug: "ramazan-donemi-market-satislari", title: "Ramazan Dönemi Market Satışları", tag: "Satış", description: "Ramazan stok planı, iftar ürünleri ve ciro artırma." },
	{ slug: "bayram-alisverisi-hazirligi", title: "Bayram Alışverişi Hazırlığı", tag: "Satış", description: "Kurban ve sürü bayramı öncesi stok ve kampanya planı." },
	{ slug: "okul-donemi-market-kampanyalari", title: "Okul Dönemi Market Kampanyaları", tag: "Satış", description: "Eylül kırtasiye-atıştırmalık çapraz satış fırsatları." },
	{ slug: "yaz-sezonu-icecek-satislari", title: "Yaz Sezonu İçecek Satışları", tag: "Satış", description: "Yaz mevsiminde soğuk içecek stok ve raf stratejisi." },
	{ slug: "kis-aylarinda-market-yonetimi", title: "Kış Aylarında Market Yönetimi", tag: "Satış", description: "Kış SKU'ları, sıcak içecek ve depo ısıtma maliyetleri." },
	{ slug: "cross-selling-teknikleri-markette", title: "Cross-Selling Teknikleri Markette", tag: "Satış", description: "Kasa ve raf çapraz satış: makarna-salça, ekmek-süt örnekleri." },
	{ slug: "sadakat-programi-kucuk-marketler", title: "Sadakat Programı Küçük Marketler", tag: "Satış", description: "Puan kartı, veresiye avantajı ve mahalle sadakati." },
	{ slug: "whatsapp-ile-siparis-yonetimi", title: "WhatsApp ile Sipariş Yönetimi", tag: "Satış", description: "WhatsApp siparişlerini POS'a aktarma ve teslimat takibi." },
	{ slug: "sosyal-medya-market-icin", title: "Sosyal Medya Market İçin", tag: "Satış", description: "Instagram ve Facebook ile mahalle marketine müşteri çekme." },
	{ slug: "yerel-tedarikci-ile-calisma", title: "Yerel Tedarikçi ile Çalışma", tag: "Satış", description: "Yerel üretici tedariki, taze ürün ve marj avantajı." },

	{ slug: "yapay-zeka-destekli-market-yonetimi", title: "Yapay Zekâ Destekli Market Yönetimi", tag: "YZ", description: "YZ ile stok, fiyat ve kampanya önerileri — dijital işletme ortağı." },
	{ slug: "rakip-fiyat-takibi-markette", title: "Rakip Fiyat Takibi Markette", tag: "YZ", description: "Yakın market kampanyalarını izleme ve fiyat uyumu stratejisi." },
	{ slug: "tahmini-ciro-analizi", title: "Tahmini Ciro Analizi", tag: "YZ", description: "Gün sonu ciro tahmini ve satış trendi okuma rehberi." },
	{ slug: "dijital-isletme-ortagi-nedir", title: "Dijital İşletme Ortağı Nedir?", tag: "YZ", description: "Kayıt tutan POS değil; yöneten, tahmin eden dijital ortak kavramı." },
	{ slug: "marketpos-ile-dijital-donusum", title: "MarketPOS ile Dijital Dönüşüm", tag: "YZ", description: "Market ve bakkalda 14 günde dijital dönüşüm adımları." },
	{ slug: "market-pos-programi-nasil-secilir", title: "Market POS Programı Nasıl Seçilir? (2026 Rehberi)", tag: "POS", description: "Market POS seçiminde 7 kritik kriter: offline, barkod, stok, cari." },
	{ slug: "bakkal-market-barkodlu-satis", title: "Bakkal ve Market İçin Barkodlu Satış Programının 5 Avantajı", tag: "POS", description: "Barkodlu POS'un hız, doğruluk ve stok avantajları." },
	{ slug: "kucuk-isletme-stok-takip-rehberi", title: "Küçük İşletmeler İçin Stok Takip Rehberi", tag: "Stok", description: "Excel'den POS'a stok geçişi ve kritik stok uyarıları." },
	{ slug: "market-kasa-programi-kurulumu", title: "Market Kasa Programı Kurulumu: Adım Adım", tag: "POS", description: "Windows POS kurulumu, barkod okuyucu ve ilk satış." },
	{ slug: "veresiye-cari-hesap-takibi", title: "Veresiye ve Cari Hesap Takibi Nasıl Yapılır?", tag: "Cari", description: "Müşteri borçları, tahsilat ve risk yönetimi rehberi." },
	{ slug: "marketpos-ucretsiz-deneme-rehberi", title: "MarketPOS Ücretsiz Deneme: Nasıl Başlanır?", tag: "YZ", description: "14 gün ücretsiz deneme — indirme, kayıt ve ilk gün listesi." },
];

if (ARTICLES.length !== 100) {
	throw new Error(`Beklenen 100 makale, bulunan: ${ARTICLES.length}`);
}

const TAG_INTROS = {
	İşletme: (t) =>
		`${t} konusu, Türkiye'de market ve bakkal açmak isteyen girişimcilerin en çok aradığı başlıklardan biridir. Doğru planlama, belge süreçleri ve lokasyon seçimi ilk yıl kârlılığını doğrudan etkiler.`,
	POS: (t) =>
		`${t} sorusu, perakende dijitalleşmesinin temel taşlarından biridir. Modern marketlerde kasa yazılımı sadece satış kaydı değil; stok, cari ve analizin merkezidir.`,
	Stok: (t) =>
		`${t} — stok yönetimi market kârlılığının görünmeyen kahramanıdır. Doğru takip fireyi azaltır, rafları doldurur ve nakit akışını korur.`,
	Kâr: (t) =>
		`${t} Perakende marjları daraldıkça fiyat, kampanya ve ürün karması stratejik kararlar gerektirir.`,
	Gıda: (t) =>
		`${t} Gıda perakendesinde SKT ve hijyen sadece yasal zorunluluk değil; müşteri güveninin de temelidir.`,
	Cari: (t) =>
		`${t} Nakit akışı ve cari takip, özellikle veresiye çalışan mahalle marketlerinde hayati önem taşır.`,
	Personel: (t) =>
		`${t} İyi eğitimli kasiyer ve personel, POS yatırımının gerçek değerini ortaya çıkarır.`,
	Satış: (t) =>
		`${t} Mevsimsel fırsatlar ve çapraz satış teknikleri, ek reklam bütçesi olmadan ciroyu artırabilir.`,
	YZ: (t) =>
		`${t} Yapay zekâ destekli POS sistemleri artık sadece rapor değil; tahmin ve öneri sunan dijital işletme ortağı olarak konumlanıyor.`,
};

function escapeHtml(s) {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function buildSections(article) {
	const intro = TAG_INTROS[article.tag]?.(article.title) ?? `${article.title} hakkında pratik bir rehber.`;
	const topic = article.title.replace(/\?.*$/, "").trim();

	return [
		{
			h2: `${topic} — özet`,
			paras: [
				intro,
				`Bu yazıda ${topic.toLowerCase()} konusunu Türkiye'deki market, bakkal ve mini market işletmeleri perspektifinden ele alıyoruz. Adımları sade tuttuk; uygulamaya hemen geçebileceğiniz kontrol listeleri ekledik.`,
			],
		},
		{
			h2: "Adım adım uygulama",
			paras: [
				`Önce mevcut durumunuzu yazılı hale getirin: ciro, stok, borç-alacak ve personel sayısı. ${topic} için net hedef belirleyin (ör. fire oranını %2 azaltmak, sepet ortalamasını %10 artırmak).`,
				`Haftalık rutin oluşturun: pazartesi sipariş, çarşamba raf kontrolü, cuma gün sonu raporu. POS yazılımı bu rutinleri otomatikleştirir; Excel veya defterle yapılan işleri tek ekranda toplar.`,
				`İlk ay sonunda sonuçları ölçün. Başarılı adımları sürdürün, işe yaramayanları değiştirin. Küçük marketlerde hızlı deneme-yanılma en etkili yöntemdir.`,
			],
		},
		{
			h2: "Sık yapılan hatalar",
			paras: [
				`En yaygın hata, konuyu sadece "bir kez hallederim" diye düşünmektir. ${topic} sürekli takip gerektirir — özellikle stok, fiyat ve cari hesaplarda.`,
				`İkinci hata, personeli sürece dahil etmemektir. Kasiyer ve depo sorumlusu aynı sistemi kullanmazsa veri güvenilmez olur.`,
				`Üçüncü hata, dijital araç seçmeden büyümeye çalışmaktır. Doğru market POS programı, manuel iş yükünü yarıya indirebilir.`,
			],
		},
		{
			h2: "MarketPOS ile pratik çözüm",
			paras: [
				`MarketPOS, işletmeyi kaydeden bir yazılım değil; yöneten, tahmin eden ve öneriler sunan dijital işletme ortağınızdır. ${article.tag === "YZ" ? "Yapay zekâ destekli analiz, tahmini ciro ve tek dokunuşla uygulanabilir öneriler ana panelde hazır." : "Barkodlu satış, stok takibi, cari hesap ve yapay zekâ önerileri tek programda birleşir."}`,
				`14 gün ücretsiz deneyin — Windows kurulumunu indirin, kayıt olun ve kendi ürünlerinizle test edin. Offline çalışır; internet kesilse de satış devam eder.`,
			],
		},
	];
}

function postHtml(article, index) {
	const sections = buildSections(article);
	const readMin = 5 + (index % 4);
	const day = 29 - Math.floor(index / 4);
	const month = index < 60 ? "Temmuz" : "Haziran";
	const dateIso = index < 60 ? `2026-07-${String(Math.max(1, day)).padStart(2, "0")}` : `2026-06-${String(Math.max(1, 30 - (index - 60))).padStart(2, "0")}`;
	const dateTr = `${day} ${month} 2026`;

	const body = sections
		.map(
			(s) =>
				`<h2>${escapeHtml(s.h2)}</h2>\n${s.paras.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n")}`,
		)
		.join("\n\n");

	return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(article.title)} | MarketPOS Blog</title>
  <meta name="description" content="${escapeHtml(article.description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${BASE_URL}/blog/posts/${article.slug}.html" />
  <link rel="icon" href="../../favicon.svg?v=20260530" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../style.css?v=20260730" />
  <link rel="stylesheet" href="../../saas.css?v=20260730" />
  <link rel="stylesheet" href="../blog.css?v=20260730" />
</head>
<body id="top">
  <div class="bg-aurora" aria-hidden="true"><span class="aurora a1"></span><span class="aurora a2"></span><span class="aurora a3"></span></div>
  <div class="bg-grid" aria-hidden="true"></div>
  <header id="navbar" class="site-header">
    <div class="container nav-inner">
      <a class="logo" href="../../index.html" aria-label="MarketPOS ana sayfa">
        <img class="logo-img" src="../../assets/logo-lockup.png?v=20260530" alt="MarketPOS" width="180" height="27" decoding="async" />
      </a>
      <nav class="main-nav" aria-label="Ana menü">
        <ul>
          <li><a href="../../index.html#ai-platform">AI Özellikleri</a></li>
          <li><a href="../../index.html#features">Özellikler</a></li>
          <li><a href="../../pricing.html">Fiyat</a></li>
          <li><a href="../index.html">Blog</a></li>
          <li><a href="../../hesap/index.html">Hesabım</a></li>
        </ul>
      </nav>
      <div class="nav-cta">
        <a class="btn btn-primary" href="../../index.html#download" data-open-download>MarketPOS'u İndir</a>
        <a class="btn btn-ghost" href="../../hesap/giris.html">Giriş</a>
      </div>
      <button class="burger" id="burger" aria-label="Menüyü aç/kapat" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <main class="blog-main container">
    <article class="blog-article">
      <a class="blog-back" href="../index.html">← Tüm yazılar</a>
      <header>
        <span class="blog-card-tag">${escapeHtml(article.tag)}</span>
        <h1>${escapeHtml(article.title)}</h1>
        <div class="blog-article-meta"><time datetime="${dateIso}">${dateTr}</time><span>${readMin} dk okuma</span></div>
      </header>
      <p class="lead">${escapeHtml(article.description)}</p>
${body}

      <div class="blog-cta-box">
        <h2>Rehberleri uygulamaya dökün</h2>
        <p>MarketPOS'u indirin — stok, satış ve AI analizler tek panelde.</p>
        <a class="btn btn-primary btn-lg" href="../../index.html#download" data-open-download>MarketPOS'u İndir</a>
        <p style="margin-top:12px;font-size:.85rem;"><a href="../../pricing.html">Fiyatlandırma →</a></p>
      </div>
    </article>
  </main>
  <footer class="blog-footer-mini container">
    <p>© 2026 MarketPOS</p>
    <nav aria-label="Alt menü">
      <a href="../../index.html">Ana Sayfa</a>
      <a href="../../pricing.html">Fiyatlandırma</a>
      <a href="../../index.html#download" data-open-download>Ücretsiz İndir</a>
    </nav>
  </footer>
  <script src="../../script.js?v=20260730" defer data-cfasync="false"></script>
</body>
</html>`;
}

function indexHtml(articles) {
	const cards = articles
		.map((a, i) => {
			const readMin = 5 + (i % 4);
			const day = 29 - Math.floor(i / 4);
			const month = i < 60 ? "Temmuz" : "Haziran";
			return `      <article class="blog-card" data-tag="${escapeHtml(a.tag)}">
        <div class="blog-card-body">
          <span class="blog-card-tag">${escapeHtml(a.tag)}</span>
          <h2><a href="posts/${a.slug}.html">${escapeHtml(a.title)}</a></h2>
          <p>${escapeHtml(a.description)}</p>
          <span class="blog-card-meta">${day} ${month} 2026 · ${readMin} dk okuma</span>
          <a class="blog-card-link" href="posts/${a.slug}.html">Devamını oku →</a>
        </div>
      </article>`;
		})
		.join("\n\n");

	const tags = [...new Set(articles.map((a) => a.tag))];

	return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Blog — 100 Market &amp; POS Rehberi | MarketPOS</title>
  <meta name="description" content="100 rehber: market nasıl açılır, POS nedir, barkod sistemi, stok takibi, kârlılık, SKT ve yapay zekâ. Türkiye market ve bakkalları için." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${BASE_URL}/blog/" />
  <link rel="icon" href="../favicon.svg?v=20260530" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../style.css?v=20260730" />
  <link rel="stylesheet" href="../saas.css?v=20260730" />
  <link rel="stylesheet" href="blog.css?v=20260730" />
</head>
<body id="top">
  <div class="bg-aurora" aria-hidden="true"><span class="aurora a1"></span><span class="aurora a2"></span><span class="aurora a3"></span></div>
  <div class="bg-grid" aria-hidden="true"></div>

  <header id="navbar" class="site-header">
    <div class="container nav-inner">
      <a class="logo" href="../index.html" aria-label="MarketPOS ana sayfa">
        <img class="logo-img" src="../assets/logo-lockup.png?v=20260530" alt="MarketPOS" width="180" height="27" decoding="async" />
      </a>
      <nav class="main-nav" aria-label="Ana menü">
        <ul>
          <li><a href="../index.html#ai-platform">AI Özellikleri</a></li>
          <li><a href="../index.html#features">Özellikler</a></li>
          <li><a href="../pricing.html">Fiyat</a></li>
          <li><a href="index.html">Blog</a></li>
          <li><a href="../hesap/index.html">Hesabım</a></li>
          <li><a href="../index.html#faq">SSS</a></li>
        </ul>
      </nav>
      <div class="nav-cta">
        <a class="btn btn-primary" href="../index.html#download" data-open-download>MarketPOS'u İndir</a>
        <a class="btn btn-ghost" href="../hesap/giris.html">Giriş</a>
      </div>
      <button class="burger" id="burger" aria-label="Menüyü aç/kapat" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main class="blog-main container">
    <header class="blog-hero">
      <span class="eyebrow">100 Rehber · MarketPOS Blog</span>
      <h1>Perakende işletmeniz için <span class="gradient-text">pratik rehberler</span></h1>
      <p>Market açmaktan stok takibine, POS seçiminden kârlılığa — işletmenizi büyütmek için ihtiyacınız olan bilgiler.</p>
    </header>

    <nav class="blog-filters blog-filters-seo" aria-label="SEO kategori">
      <span class="blog-filter-label">Kategoriler:</span>
      <button type="button" class="blog-filter-btn" data-filter="POS Rehberi">POS Rehberi</button>
      <button type="button" class="blog-filter-btn" data-filter="Market Yönetimi">Market Yönetimi</button>
      <button type="button" class="blog-filter-btn" data-filter="Stok Yönetimi">Stok Yönetimi</button>
      <button type="button" class="blog-filter-btn" data-filter="Perakende Teknolojileri">Perakende Teknolojileri</button>
    </nav>

    <nav class="blog-filters" aria-label="Kategori filtresi">
      <button type="button" class="blog-filter-btn active" data-filter="all">Tümü (${articles.length})</button>
${tags.map((t) => `      <button type="button" class="blog-filter-btn" data-filter="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join("\n")}
    </nav>

    <div class="blog-grid" id="blogGrid">
${cards}
    </div>

    <div class="blog-cta-box" style="max-width: 640px; margin: 48px auto 0;">
      <h2>Rehberleri uygulamaya dökün</h2>
      <p>MarketPOS'u indirin, kasada deneyin — stok, satış ve AI analizler tek panelde.</p>
      <a class="btn btn-primary btn-lg" href="../index.html#download" data-open-download>MarketPOS'u İndir</a>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container footer-bottom">
      <div class="footer-bottom-inner">
        <span>© 2026 MarketPOS</span>
        <nav class="footer-inline-nav" aria-label="Alt menü">
          <a href="../index.html">Ana Sayfa</a>
          <a href="../pricing.html">Fiyatlandırma</a>
          <a href="../index.html#download" data-open-download>İndir</a>
        </nav>
      </div>
    </div>
  </footer>
  <script src="../script.js?v=20260730" defer data-cfasync="false"></script>
  <script src="blog-filter.js?v=20260730" defer data-cfasync="false"></script>
</body>
</html>`;
}

function sitemapXml(articles) {
	const urls = [
		`${BASE_URL}/blog/`,
		...articles.map((a) => `${BASE_URL}/blog/posts/${a.slug}.html`),
	];
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><changefreq>monthly</changefreq><priority>${u.includes("/posts/") ? "0.7" : "0.8"}</priority></url>`).join("\n")}
</urlset>`;
}

if (!existsSync(POSTS_DIR)) mkdirSync(POSTS_DIR, { recursive: true });

for (let i = 0; i < ARTICLES.length; i++) {
	writeFileSync(join(POSTS_DIR, `${ARTICLES[i].slug}.html`), postHtml(ARTICLES[i], i), "utf8");
}

writeFileSync(join(__dir, "index.html"), indexHtml(ARTICLES), "utf8");
writeFileSync(join(__dir, "sitemap-blog.xml"), sitemapXml(ARTICLES), "utf8");
writeFileSync(join(__dir, "articles.json"), JSON.stringify(ARTICLES, null, 2), "utf8");

console.log(`✓ ${ARTICLES.length} blog yazısı üretildi → ${POSTS_DIR}`);
console.log(`✓ index.html ve sitemap-blog.xml güncellendi`);
