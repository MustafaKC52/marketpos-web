import { motion } from "framer-motion";
import { PRO_FEATURES } from "./constants";

const listVariants = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.04, delayChildren: 0.2 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, x: -8 },
	show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export function PricingFeatureList() {
	return (
		<motion.ul
			className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2"
			variants={listVariants}
			initial="hidden"
			whileInView="show"
			viewport={{ once: true, margin: "-40px" }}
		>
			{PRO_FEATURES.map((feature) => (
				<motion.li
					key={feature}
					variants={itemVariants}
					className="flex items-center gap-2.5 text-sm text-slate-200/90 sm:text-[15px]"
				>
					<span
						className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-xs text-emerald-300"
						aria-hidden
					>
						✓
					</span>
					<span>{feature}</span>
				</motion.li>
			))}
		</motion.ul>
	);
}
