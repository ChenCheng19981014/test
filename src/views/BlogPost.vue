<template>
  <main v-if="post" class="blog-post">
    <nav class="crumb" aria-label="面包屑">
      <RouterLink to="/blog">博客</RouterLink>
      <span class="sep" aria-hidden="true">/</span>
      <span class="current">{{ post.title }}</span>
    </nav>

    <figure v-if="post.coverImage" class="cover-wrap">
      <img
        class="cover-img"
        :src="post.coverImage"
        :alt="post.title"
        width="1280"
        height="720"
        loading="eager"
        decoding="async"
      />
    </figure>

    <article>
      <header class="art-head">
        <p class="art-meta">
          {{ post.tag }} · {{ post.readMin }} min read · {{ formatDate(post.date) }}
        </p>
        <h1 class="art-title">{{ post.title }}</h1>
        <p class="art-lead">{{ post.excerpt }}</p>
      </header>
      <div class="art-body">
        <template v-for="(block, i) in blocks" :key="i">
          <p v-if="block.kind === 'text'" class="para">{{ block.text }}</p>
          <figure v-else-if="block.kind === 'img'" class="inline-fig">
            <img
              :src="block.src"
              :alt="block.alt"
              class="inline-img"
              width="1100"
              height="619"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </template>
      </div>
    </article>

    <footer class="art-foot">
      <RouterLink to="/blog" class="back">← 返回文章列表</RouterLink>
    </footer>
  </main>
  <main v-else class="blog-post not-found">
    <p>未找到这篇文章。</p>
    <RouterLink to="/blog">返回博客</RouterLink>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { getPostBySlug, type Post } from "@/data/posts";

const route = useRoute();
const post = computed(() => getPostBySlug(route.params.slug as string));

type Block =
  | { kind: "text"; text: string }
  | { kind: "img"; src: string; alt: string };

function buildBlocks(p: Post): Block[] {
  const out: Block[] = [];
  const imgs = [...(p.inlineImages || [])].sort(
    (a, b) => a.afterParagraph - b.afterParagraph
  );
  p.body.forEach((text, idx) => {
    out.push({ kind: "text", text });
    imgs
      .filter((im) => im.afterParagraph === idx + 1)
      .forEach((im) => {
        out.push({ kind: "img", src: im.src, alt: im.alt });
      });
  });
  return out;
}

const blocks = computed(() =>
  post.value ? buildBlocks(post.value) : []
);

function formatDate(iso: string) {
  return iso.replace(/-/g, ".");
}
</script>

<style scoped lang="scss">
.blog-post {
  width: min(78vw, 980px);
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

.crumb {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
}

.crumb a {
  color: var(--text-muted);
}

.crumb a:hover {
  color: var(--accent);
}

.sep {
  margin: 0 0.35rem;
  opacity: 0.5;
}

.current {
  color: var(--text);
}

.cover-wrap {
  margin: 0 -1.25rem 1.75rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--border);
}

@media (min-width: 720px) {
  .cover-wrap {
    margin-left: 0;
    margin-right: 0;
  }
}

.cover-img {
  width: 100%;
  height: auto;
  max-height: min(52vh, 420px);
  object-fit: cover;
  display: block;
  vertical-align: middle;
}

.art-head {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.art-meta {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.art-title {
  font-family: "Newsreader", Georgia, serif;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.25;
  margin-bottom: 1rem;
}

.art-lead {
  font-size: 1.0625rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.art-body {
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--text);
}

.para {
  margin-bottom: 1.25rem;
}

.inline-fig {
  margin: 1.5rem 0 1.75rem;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.inline-img {
  width: 100%;
  height: auto;
  display: block;
  vertical-align: middle;
}

.art-foot {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.back {
  font-size: 0.9375rem;
  font-weight: 500;
}

.not-found {
  text-align: center;
  padding-top: 4rem;
}

.not-found p {
  margin-bottom: 1rem;
  color: var(--text-muted);
}
</style>
