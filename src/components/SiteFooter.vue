<template>
  <footer class="site-footer">
    <div class="inner">
      <div class="cols">
        <div class="col">
          <p class="col-title">探索</p>
          <ul>
            <li><RouterLink to="/blog">全部文章</RouterLink></li>
            <li><RouterLink to="/resume">简历</RouterLink></li>
          </ul>
        </div>
        <div class="col">
          <p class="col-title">连接</p>
          <ul>
            <li>
              <a :href="githubUrl" target="_blank" rel="noopener noreferrer">GitHub</a>
            </li>
            <li>
              <a href="#" @click.prevent>RSS（可后续接入）</a>
            </li>
          </ul>
        </div>
      </div>
      <p class="copy">
        © {{ year }} {{ siteName }} · 样式参考
        <a href="https://www.hutusi.com/" target="_blank" rel="noopener noreferrer">胡涂说</a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ siteName?: string; githubUrl?: string }>(),
  {
    siteName: "大诚",
    githubUrl: "https://github.com",
  }
);

const year = new Date().getFullYear();
</script>

<style scoped lang="scss">
.site-footer {
  margin-top: auto;
  padding: 2.5rem 1.25rem 2rem;
  border-top: 1px solid var(--border);
  background: var(--bg-elevated);
}

.inner {
  width: min(80vw, var(--container-max));
  margin: 0 auto;
}

.cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 480px) {
  .cols {
    grid-template-columns: 1fr;
  }
}

.col-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.col ul {
  list-style: none;
}

.col li {
  margin-bottom: 0.5rem;
}

.col a {
  color: var(--text-muted);
  font-size: 0.9375rem;
}

.col a:hover {
  color: var(--accent);
}

.copy {
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.copy a {
  color: var(--text-muted);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.copy a:hover {
  color: var(--accent);
}
</style>
