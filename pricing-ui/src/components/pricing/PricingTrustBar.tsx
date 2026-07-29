import { motion } from "framer-motion";
import { TRUST_ITEMS } from "./constants";

const containerVariants = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.08, delayChildren: 0.35 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 10 },
	show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export function PricingTrustBar() {
	return (
		<motion.div
			className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10"
			variants={containerVariants}
			initial="hidden"
			whileInView="show"
			viewport={{ once: true, margin: "-20px" }}
			role="list"
			aria-label="Güven göstergeleri"
		>
			{TRUST_ITEMS.map(({ icon, label }) => (
				<motion.div
					key={label}
					variants={itemVariants}
					role="listitem"
					className="flex items-center gap-2 text-sm text-slate-400"
				>
					<span className="text-base leading-none" aria-hidden>
						{icon}
					</span>
					<span className="font-medium">{label}</span>
				</motion.div>
			))}
		</motion.div>
	);
}
