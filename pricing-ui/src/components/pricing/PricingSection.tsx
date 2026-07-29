import { motion } from "framer-motion";
import { CloudPricingCard } from "./CloudPricingCard";
import { PricingCard } from "./PricingCard";
import { PricingTrustBar } from "./PricingTrustBar";
import { TrialBanner } from "./TrialBanner";

export function PricingSection() {
	return (
		<div className="pricing-island relative">
			<TrialBanner />
			<motion.header
				className="mx-auto mb-10 max-w-2xl text-center"
				initial={{ opacity: 0, y: 16 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
			>
				<span className="inline-block rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
					Fiyatlandırma
				</span>
				<h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
					Pro lisans +{" "}
					<span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
						1 yıl bulut hediye
					</span>
				</h2>
				<p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
					Yerel süresiz lisans tek fiyatta. Bulut sunucu ve senkron özellikleri ayrı pakette — Pro
					ile birlikte ilk yıl ücretsiz.
				</p>
			</motion.header>

			<div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2 md:items-stretch">
				<PricingCard />
				<CloudPricingCard />
			</div>

			<PricingTrustBar />
		</div>
	);
}
