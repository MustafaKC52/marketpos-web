import { motion } from "framer-motion";
import { TRIAL } from "./constants";

export function TrialBanner() {
	return (
		<motion.div
			className="mx-auto mb-8 max-w-3xl rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-teal-500/5 p-5 text-center sm:p-6"
			initial={{ opacity: 0, y: 12 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.45 }}
		>
			<p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/90">
				{TRIAL.label}
			</p>
			<p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">{TRIAL.subtitle}</p>
			<a
				href="#download"
				data-open-download
				className="mt-4 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
			>
				{TRIAL.ctaLabel}
			</a>
		</motion.div>
	);
}
