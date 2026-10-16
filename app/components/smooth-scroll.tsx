"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
	useEffect(() => {
		const motionPreference = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		);
		let lenis: Lenis | undefined;

		const updateScroll = () => {
			if (motionPreference.matches) {
				lenis?.destroy();
				lenis = undefined;
				return;
			}

			if (!lenis) {
				lenis = new Lenis({
					autoRaf: true,
					smoothWheel: true,
					anchors: true,
				});
			}
		};

		updateScroll();
		motionPreference.addEventListener("change", updateScroll);

		return () => {
			motionPreference.removeEventListener("change", updateScroll);
			lenis?.destroy();
		};
	}, []);

	return null;
}
