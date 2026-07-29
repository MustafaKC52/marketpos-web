export const PRICING = {
	productName: "MarketPOS Pro",
	compareAtPrice: 9990,
	price: 6990,
	currency: "TRY",
	subtitle: "Tek sefer öde, süresiz kullan.",
	ctaLabel: "Hemen Satın Al",
	tryCtaLabel: "14 Gün Ücretsiz Dene",
	footnote:
		"İlk yıl sonunda isteğe bağlı bakım ve güncelleme hizmeti satın alabilirsiniz. Programı kullanmaya devam etmek için zorunlu değildir.",
	whatsappPhone: "905510335916",
} as const;

export const TRIAL = {
	days: 14,
	label: "14 gün ücretsiz deneme",
	subtitle: "Windows kurulumunu indirin, kayıt olun — kredi kartı gerekmez.",
	ctaLabel: "MarketPOS'u İndir",
} as const;

export const CLOUD_PRICING = {
	productName: "MarketPOS Bulut",
	price: 89.9,
	periodLabel: "aylık",
	subtitle: "Bulut sunucu, yedekleme ve senkron",
	giftBadge: "Pro ile 1. yıl hediye",
	footnote:
		"2. yıldan itibaren isteğe bağlı bulut hizmeti yenilenebilir. Pro lisans olmadan bulut paketi tek başına kullanılamaz.",
} as const;

export const PRO_FEATURES = [
	"Süresiz yerel lisans",
	"Satış yönetimi",
	"Barkod sistemi",
	"Stok takibi",
	"Cari hesap",
	"Gün sonu raporları",
	"Yazıcı desteği",
	"Terazi desteği",
	"İlk yıl ücretsiz güncelleme",
	"İlk yıl teknik destek",
	"Ücretsiz kurulum",
	"Uzaktan eğitim",
] as const;

export const CLOUD_FEATURES = [
	"Bulut sunucu barındırma",
	"Otomatik bulut yedekleme",
	"Veri senkronizasyonu",
	"Çoklu cihaz eşitleme",
	"Hesap & mağaza bulut yedeği",
	"Uzaktan veri kurtarma",
	"Güvenli SSL bağlantı",
	"7/24 sunucu erişilebilirliği",
] as const;

export const TRUST_ITEMS = [
	{ icon: "🔒", label: "Süresiz Kullanım" },
	{ icon: "☁️", label: "1 Yıl Bulut Hediye" },
	{ icon: "💬", label: "WhatsApp Destek" },
	{ icon: "🇹🇷", label: "Yerli Yazılım" },
] as const;

export function formatPrice(amount: number): string {
	return amount.toLocaleString("tr-TR");
}

export function getDiscountPercent(): number {
	return Math.round((1 - PRICING.price / PRICING.compareAtPrice) * 100);
}

export function buildPurchaseUrl(): string {
	const text = encodeURIComponent(
		`Merhaba, ${PRICING.productName} (₺${formatPrice(PRICING.price)} — 1 yıl bulut hediyeli) satın almak istiyorum.`,
	);
	return `https://wa.me/${PRICING.whatsappPhone}?text=${text}`;
}
