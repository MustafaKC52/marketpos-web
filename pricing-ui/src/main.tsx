import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PricingSection } from "@/components/pricing";
import "./index.css";

const mount = document.getElementById("pricing-root");

if (mount) {
	createRoot(mount).render(
		<StrictMode>
			<PricingSection />
		</StrictMode>,
	);
}
