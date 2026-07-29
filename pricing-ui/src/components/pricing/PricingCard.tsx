import { motion } from "framer-motion";
import { PricingFeatureList } from "./PricingFeatureList";
import { PRICING, buildPurchaseUrl, formatPrice, getDiscountPercent } from "./constants";

export function PricingCard() {
	const purchaseUrl = buildPurchaseUrl();
	const discount = getDiscountPercent();

	return (
		<motion.article
			className="group relative flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-glass backdrop-blur-xl sm:p-6"
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
			whileHover={{
				y: -4,
				boxShadow:
					"0 24px 48px rgba(0,0,0,0.45), 0 0 80px rgba(52,211,153,0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
				borderColor: "rgba(52, 211, 153, 0.25)",
			}}
		>
			<div
				className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl opacity-60"
				aria-hidden
			/>

			<div className="relative flex min-h-0 flex-1 flex-col">
				<p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
					Yerel · süresiz lisans
				</p>
				<h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
					{PRICING.productName}
				</h3>
				<p className="mt-1.5 text-sm text-slate-400 sm:text-base">{PRICING.subtitle}</p>

				<div className="mt-5 flex flex-wrap items-end gap-3">
					<span className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
						₺{formatPrice(PRICING.price)}
					</span>
					<span className="pb-1 text-lg text-slate-500 line-through decoration-slate-500/80">
						₺{formatPrice(PRICING.compareAtPrice)}
					</span>
					<span className="mb-1 rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-200">
						%{discount} indirim
					</span>
				</div>

				<div className="my-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

				<PricingFeatureList />

				<motion.a
					href={purchaseUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-6 flex w-full shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 text-center font-display text-base font-bold tracking-tight text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110 sm:text-lg"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					{PRICING.ctaLabel}
				</motion.a>

				<a
					href="#download"
					data-open-download
					className="mt-3 flex w-full shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
				>
					{PRICING.tryCtaLabel}
				</a>

				<p className="mt-3 shrink-0 text-center text-[11px] leading-relaxed text-slate-500 sm:text-xs">
					{PRICING.footnote}
				</p>
			</div>
		</motion.article>
	);
}
