import { ref, onMounted, onUnmounted } from "vue";

export function useParallaxHero(factor = 0.35) {
  const offsetY = ref(0);
  let raf = 0;
  let ticking = false;

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    if (reduceMotion) {
      offsetY.value = 0;
      return;
    }
    if (ticking) return;
    ticking = true;
    raf = requestAnimationFrame(() => {
      ticking = false;
      offsetY.value = Math.min(window.scrollY * factor, 120);
    });
  }

  onMounted(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
    cancelAnimationFrame(raf);
  });

  return { offsetY, reduceMotion };
}
