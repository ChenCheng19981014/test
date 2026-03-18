import { ref, watch, onMounted } from "vue";

const THEME_KEY = "site-theme";

export function useTheme() {
  const theme = ref<"light" | "dark">("light");

  function apply(t: "light" | "dark") {
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      /* ignore */
    }
  }

  function toggle() {
    theme.value = theme.value === "light" ? "dark" : "light";
  }

  onMounted(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
      if (saved === "dark" || saved === "light") {
        theme.value = saved;
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme.value = "dark";
      }
    } catch {
      /* ignore */
    }
    apply(theme.value);
  });

  watch(theme, (t) => apply(t));

  return { theme, toggle };
}
