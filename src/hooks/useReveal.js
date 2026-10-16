import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Every `[data-reveal]` element inside `scope` rises out of a blur as it
 * scrolls into view; siblings that arrive together follow each other in.
 * With reduced motion everything is simply there.
 */
export default function useReveal(scope) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const targets = scope.current.querySelectorAll("[data-reveal]");
      // Hidden until their batch fires, so nothing flashes in place first
      gsap.set(targets, { autoAlpha: 0 });
      ScrollTrigger.batch(targets, {
        start: "top 88%",
        once: true,
        onEnter: elements =>
          gsap.fromTo(
            elements,
            { autoAlpha: 0, y: 48, filter: "blur(12px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1,
              ease: "expo.out",
              stagger: 0.09,
              clearProps: "filter,transform"
            }
          )
      });
    });
    return () => mm.revert();
  }, [scope]);
}
