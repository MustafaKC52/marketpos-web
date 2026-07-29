/** Blog kategori filtresi — etiket + SEO kategori grupları */
(function () {
	const buttons = document.querySelectorAll(".blog-filter-btn");
	const grid = document.getElementById("blogGrid");
	if (!buttons.length || !grid) return;

	/** SEO kategori → mevcut data-tag eşlemesi */
	const SEO_GROUPS = {
		"POS Rehberi": ["POS"],
		"Market Yönetimi": ["İşletme", "Kâr", "Satış", "Personel", "Cari"],
		"Stok Yönetimi": ["Stok", "Gıda"],
		"Perakende Teknolojileri": ["YZ", "POS"],
	};

	function cardMatches(filter, tag) {
		if (filter === "all") return true;
		if (SEO_GROUPS[filter]) {
			return SEO_GROUPS[filter].includes(tag);
		}
		return tag === filter;
	}

	buttons.forEach((btn) => {
		btn.addEventListener("click", () => {
			const filter = btn.getAttribute("data-filter");
			buttons.forEach((b) => b.classList.toggle("active", b === btn));
			grid.querySelectorAll(".blog-card").forEach((card) => {
				const tag = card.getAttribute("data-tag");
				card.style.display = cardMatches(filter, tag) ? "" : "none";
			});
		});
	});
})();
