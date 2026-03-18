<template>
  <header class="site-header">
    <div class="inner">
      <RouterLink to="/" class="brand" aria-label="首页">
        <span class="brand-title">{{ siteTitle }}</span>
      </RouterLink>
      <nav class="nav" aria-label="主导航">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          active-class="nav-link--active"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <button
        type="button"
        class="theme-btn"
        :aria-label="theme === 'dark' ? '切换浅色' : '切换深色'"
        @click="toggle"
      >
        <span v-if="theme === 'light'" class="theme-icon" aria-hidden="true">◐</span>
        <span v-else class="theme-icon" aria-hidden="true">◑</span>
        <span class="theme-label">{{ theme === "dark" ? "浅色" : "深色" }}</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

withDefaults(defineProps<{ siteTitle?: string }>(), {
  siteTitle: "大诚",
});

const { theme, toggle } = useTheme();

const nav = [
  { to: "/blog", label: "博客" },
  { to: "/resume", label: "简历" },
];
</script>

<style scoped lang="scss">
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.inner {
  width: min(80vw, var(--container-max));
  margin: 0 auto;
  padding: 0 1.25rem;
  height: var(--header-h);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand {
  color: var(--text);
  font-family: "Newsreader", Georgia, serif;
  font-weight: 600;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  margin-right: auto;
}

.brand:hover {
  color: var(--accent);
}

.nav {
  display: flex;
  gap: 0.25rem 1.25rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.nav-link {
  color: var(--text-muted);
  font-size: 0.9375rem;
  font-weight: 500;
}

.nav-link:hover,
.nav-link--active {
  color: var(--text);
}

.nav-link--active {
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: var(--accent);
}

.theme-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-elevated);
  color: var(--text-muted);
  font-size: 0.8125rem;
  cursor: pointer;
  font-family: inherit;
}

.theme-btn:hover {
  color: var(--text);
  border-color: var(--accent);
}

.theme-icon {
  font-size: 1rem;
  line-height: 1;
}

@media (max-width: 520px) {
  .theme-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }
}
</style>
