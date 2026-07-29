import { motion } from "framer-motion";
import { CLOUD_FEATURES, CLOUD_PRICING } from "./constants";

export function CloudPricingCard() {
	return (
		<motion.article
			className="group relative flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-sky-400/25 bg-gradient-to-b from-sky-950/40 to-slate-900/50 p-5 shadow-glass backdrop-blur-xl sm:p-6"
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-40px" }}
			transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
		>
			<div className="mb-3 flex flex-wrap gap-2">
				<span className="rounded-full bg-sky-500/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-100">
					Bulut paketi
				</span>
				<span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-200">
					{CLOUD_PRICING.giftBadge}
				</span>
			</div>
			<h3 className="font-display text-xl font-bold text-white sm:text-2xl">{CLOUD_PRICING.productName}</h3>
			<p className="mt-1 text-sm text-sky-100/75">{CLOUD_PRICING.subtitle}</p>
			<p className="mt-3 text-3xl font-bold tabular-nums text-white">
				₺{CLOUD_PRICING.price.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
				<span className="text-base font-medium text-sky-200/80"> / {CLOUD_PRICING.periodLabel}</span>
			</p>
			<p className="text-xs text-sky-200/70">Pro ile ilk yıl ücretsiz</p>

			<ul className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
				{CLOUD_FEATURES.map((feature, i) => (
					<motion.li
						key={feature}
						className="flex items-start gap-2 text-sm text-sky-50/90"
						initial={{ opacity: 0, x: -6 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.12 + i * 0.03 }}
					>
						<span className="mt-0.5 text-sky-300">✓</span>
						<span>{feature}</span>
					</motion.li>
				))}
			</ul>

			<p className="mt-4 text-center text-[11px] leading-relaxed text-sky-200/60 sm:text-xs">
				{CLOUD_PRICING.footnote}
			</p>
		</motion.article>
	);
}
