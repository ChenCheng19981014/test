<template>
  <div class="blog-page">
    <p class="skip"><a href="#main-list">跳到文章列表</a></p>

    <!-- 视差头图 -->
    <section class="hero" aria-label="博客头图">
      <div
        class="hero-bg"
        :class="{ 'hero-bg--static': reduceMotion }"
        :style="
          reduceMotion
            ? {}
            : { transform: `translate3d(0, ${offsetY}px, 0) scale(1.08)` }
        "
      />
      <div class="hero-overlay" />
      <div class="hero-content">
        <h1 class="hero-title">博客</h1>
        <p class="hero-sub">
          前端 · AI 工具链 · 工程习惯 —— 面试时也可当「作品说明书」读
        </p>
      </div>
    </section>

    <main class="blog-main" ref="carouselScope">
      <!-- 轮播 -->
      <section
        v-if="slides.length"
        class="carousel-section"
        aria-roledescription="carousel"
        aria-label="精选推荐"
        @mouseenter="pauseCarousel"
        @mouseleave="resumeCarousel"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
      >
        <div class="carousel-head">
          <h2 class="section-title">精选轮播</h2>
          <div class="carousel-controls">
            <button
              type="button"
              class="car-btn"
              aria-label="上一张"
              @click="prevSlide"
            >
              ‹
            </button>
            <button
              type="button"
              class="car-btn"
              aria-label="下一张"
              @click="nextSlide"
            >
              ›
            </button>
          </div>
        </div>
        <div
          class="carousel-viewport"
          :class="{ 'carousel-viewport--glitch': !reduceMotion }"
        >
          <div
            class="carousel-track"
            :style="{ transform: `translateX(-${current * 100}%)` }"
          >
            <RouterLink
              v-for="(post, i) in slides"
              :key="post.slug"
              :to="`/blog/${post.slug}`"
              class="carousel-slide"
              :class="{ 'carousel-slide--inactive': i !== current }"
              :aria-hidden="i !== current"
              :tabindex="i === current ? 0 : -1"
            >
              <img
                class="slide-img"
                :src="post.coverImage"
                :alt="''"
                width="1200"
                height="520"
                loading="eager"
                decoding="async"
              />
              <div v-if="!reduceMotion" class="glitch-layer" aria-hidden="true" />
              <div class="slide-cap">
                <span class="slide-tag">{{ post.tag }}</span>
                <h3 class="slide-title">{{ post.title }}</h3>
                <p class="slide-excerpt">{{ post.excerpt }}</p>
              </div>
            </RouterLink>
          </div>
        </div>
        <div class="carousel-dots" role="tablist" aria-label="选择幻灯片">
          <button
            v-for="(_, i) in slides"
            :key="i"
            type="button"
            role="tab"
            class="dot"
            :class="{ 'dot--on': i === current }"
            :aria-selected="i === current"
            :aria-label="`第 ${i + 1} 张`"
            @click="goSlide(i)"
          />
        </div>
      </section>

      <section
        v-if="featured.length"
        class="section"
        aria-labelledby="feat-heading"
      >
        <h2 id="feat-heading" class="section-title">精选文章</h2>
        <ul class="card-list">
          <li v-for="post in featured" :key="post.slug">
            <RouterLink :to="`/blog/${post.slug}`" class="card">
              <div v-if="post.coverImage" class="card-thumb-wrap">
                <img
                  class="card-thumb"
                  :src="post.coverImage"
                  alt=""
                  width="640"
                  height="360"
                  loading="lazy"
                />
              </div>
              <div class="card-body">
                <span class="card-meta">
                  {{ post.tag }} · {{ post.readMin }} min ·
                  {{ formatDate(post.date) }}
                </span>
                <h3 class="card-title">{{ post.title }}</h3>
                <p class="card-excerpt">{{ post.excerpt }}</p>
              </div>
            </RouterLink>
          </li>
        </ul>
      </section>

      <section id="main-list" class="section" aria-labelledby="latest-heading">
        <div class="section-head">
          <h2 id="latest-heading" class="section-title">最新文章</h2>
          <span class="section-note">共 {{ sorted.length }} 篇</span>
        </div>
        <ul class="simple-list">
          <li v-for="post in sorted" :key="post.slug">
            <RouterLink :to="`/blog/${post.slug}`" class="row">
              <div v-if="post.coverImage" class="row-thumb-wrap">
                <img
                  class="row-thumb"
                  :src="post.coverImage"
                  alt=""
                  width="200"
                  height="120"
                  loading="lazy"
                />
              </div>
              <div class="row-text">
                <span class="row-meta">
                  {{ post.tag }} · {{ post.readMin }} min ·
                  {{ formatDate(post.date) }}
                </span>
                <h3 class="row-title">{{ post.title }}</h3>
                <p class="row-excerpt">{{ post.excerpt }}</p>
              </div>
            </RouterLink>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import {
  getCarouselPosts,
  getFeaturedPosts,
  getPostsByDate,
} from "@/data/posts";
import { useParallaxHero } from "@/composables/useParallaxHero";

const { offsetY, reduceMotion } = useParallaxHero(0.32);

const slides = computed(() => getCarouselPosts());
const featured = computed(() => getFeaturedPosts());
const sorted = computed(() => getPostsByDate());

const current = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;
const INTERVAL = 5200;
const carouselScope = ref<HTMLElement | null>(null);
let io: IntersectionObserver | null = null;
const inView = ref(true);

const pointer = {
  active: false,
  startX: 0,
  endX: 0,
};

function nextSlide() {
  const n = slides.value.length;
  if (!n) return;
  current.value = (current.value + 1) % n;
}

function prevSlide() {
  const n = slides.value.length;
  if (!n) return;
  current.value = (current.value - 1 + n) % n;
}

function goSlide(i: number) {
  current.value = i;
}

function startCarousel() {
  if (reduceMotion || slides.value.length <= 1) return;
  if (!inView.value) return;
  if (document.visibilityState !== "visible") return;
  stopCarousel();
  timer = setInterval(nextSlide, INTERVAL);
}

function stopCarousel() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function pauseCarousel() {
  stopCarousel();
}

function resumeCarousel() {
  startCarousel();
}

function onVisibility() {
  if (document.visibilityState === "visible") {
    startCarousel();
  } else {
    stopCarousel();
  }
}

function onPointerDown(e: PointerEvent) {
  pointer.active = true;
  pointer.startX = e.clientX;
  pointer.endX = e.clientX;
  pauseCarousel();
}

function onPointerUp(e: PointerEvent) {
  if (!pointer.active) return;
  pointer.endX = e.clientX;
  const dx = pointer.endX - pointer.startX;
  pointer.active = false;
  if (Math.abs(dx) > 48) {
    if (dx < 0) nextSlide();
    else prevSlide();
  }
  resumeCarousel();
}

function onPointerCancel() {
  pointer.active = false;
  resumeCarousel();
}

onMounted(() => {
  startCarousel();
  document.addEventListener("visibilitychange", onVisibility);
  if (carouselScope.value) {
    io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        inView.value = entry?.isIntersecting ?? true;
        if (inView.value) startCarousel();
        else stopCarousel();
      },
      { threshold: 0.2 }
    );
    io.observe(carouselScope.value);
  }
});

onUnmounted(() => {
  stopCarousel();
  document.removeEventListener("visibilitychange", onVisibility);
  if (io && carouselScope.value) io.unobserve(carouselScope.value);
  io = null;
});

watch(
  () => slides.value.length,
  () => {
    current.value = 0;
    startCarousel();
  }
);

function formatDate(iso: string) {
  return iso.replace(/-/g, ".");
}
</script>

<style scoped lang="scss">
.blog-page {
  width: 100%;
}

.skip {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.skip a:focus {
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 100;
  width: auto;
  height: auto;
  clip: auto;
  padding: 0.5rem 1rem;
  background: var(--accent);
  color: var(--bg-elevated);
  border-radius: 4px;
}

.hero {
  position: relative;
  width: 100%;
  min-height: min(42vh, 320px);
  max-height: 420px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.hero-bg {
  position: absolute;
  inset: -8% 0 -15% 0;
  background-image: url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2600&q=92");
  background-size: cover;
  background-position: center 40%;
  will-change: transform;
  transition: transform 0.05s linear;
}

.hero-bg--static {
  transform: none !important;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--bg) 92%, transparent) 0%,
    color-mix(in srgb, var(--bg) 45%, transparent) 50%,
    color-mix(in srgb, var(--bg) 20%, transparent) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  width: min(80vw, var(--container-max));
  margin: 0 auto;
  padding: 2rem 1.25rem 2.25rem;
}

.hero-title {
  font-family: "Newsreader", Georgia, serif;
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--text);
  text-shadow: 0 1px 2px color-mix(in srgb, var(--bg) 80%, transparent);
  margin-bottom: 0.5rem;
}

.hero-sub {
  font-size: 1rem;
  color: var(--text-muted);
  max-width: 36em;
  line-height: 1.55;
}

.blog-main {
  width: min(80vw, var(--container-max));
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

.carousel-section {
  margin-bottom: 2.75rem;
}

.carousel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.carousel-controls {
  display: flex;
  gap: 0.35rem;
}

.car-btn {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.car-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.carousel-viewport {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  position: relative;
}

.carousel-viewport--glitch::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.06) 0px,
    rgba(255, 255, 255, 0.06) 1px,
    transparent 2px,
    transparent 6px
  );
  mix-blend-mode: overlay;
  opacity: 0.22;
  z-index: 2;
}

.carousel-viewport--glitch::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
      1200px 520px at 80% 0%,
      rgba(77, 255, 195, 0.1),
      transparent 55%
    ),
    radial-gradient(
      900px 420px at 10% 80%,
      rgba(255, 90, 170, 0.08),
      transparent 50%
    );
  opacity: 0.75;
  z-index: 2;
}

.carousel-track {
  display: flex;
  transition: transform 0.45s cubic-bezier(0.25, 0.1, 0.25, 1);
}

@media (prefers-reduced-motion: reduce) {
  .carousel-track {
    transition: none;
  }
}

.carousel-slide {
  position: relative;
  flex: 0 0 100%;
  display: block;
  min-height: 280px;
  color: inherit;
}

@media (min-width: 640px) {
  .carousel-slide {
    min-height: 320px;
  }
}

.slide-img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
  filter: saturate(1.06) contrast(1.04);
}

@media (min-width: 640px) {
  .slide-img {
    height: 320px;
  }
}

.slide-cap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1.25rem 1.35rem 1.5rem;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.2) 60%,
    transparent 100%
  );
  z-index: 3;
}

.glitch-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  background: linear-gradient(
      to right,
      rgba(0, 255, 204, 0.1),
      transparent 40%,
      rgba(255, 0, 102, 0.08)
    ),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.28'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
  opacity: 0.16;
  animation: glitchFlicker 5.5s infinite steps(1, end);
}

@keyframes glitchFlicker {
  0% {
    opacity: 0.12;
    transform: translate3d(0, 0, 0);
  }
  18% {
    opacity: 0.18;
    transform: translate3d(0, 0, 0);
  }
  20% {
    opacity: 0.08;
    transform: translate3d(-2px, 0, 0);
  }
  22% {
    opacity: 0.2;
    transform: translate3d(2px, 0, 0);
  }
  24% {
    opacity: 0.14;
    transform: translate3d(0, 0, 0);
  }
  67% {
    opacity: 0.16;
    transform: translate3d(0, 0, 0);
  }
  70% {
    opacity: 0.06;
    transform: translate3d(0, 1px, 0);
  }
  72% {
    opacity: 0.18;
    transform: translate3d(0, 0, 0);
  }
  100% {
    opacity: 0.12;
    transform: translate3d(0, 0, 0);
  }
}
.slide-tag {
  display: inline-block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 0.35rem;
}

.slide-title {
  font-family: "Newsreader", Georgia, serif;
  font-size: 1.35rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.3;
  margin-bottom: 0.35rem;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.slide-excerpt {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--border);
  cursor: pointer;
  padding: 0;
}

.dot--on {
  background: var(--accent);
  transform: scale(1.15);
}

.section {
  margin-bottom: 2.75rem;
}

.section-title {
  font-family: "Newsreader", Georgia, serif;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--text);
}

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.section-head .section-title {
  margin-bottom: 0;
}

.section-note {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.card-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.card {
  display: block;
  overflow: hidden;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.card:hover {
  border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.06);
}

[data-theme="dark"] .card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}

.card-thumb-wrap {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--border);
}

.card-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.card:hover .card-thumb {
  transform: scale(1.03);
}

.card-body {
  padding: 1.15rem 1.35rem 1.35rem;
}

.card-meta {
  display: block;
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.card-title {
  font-family: "Newsreader", Georgia, serif;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.card:hover .card-title {
  color: var(--accent);
}

.card-excerpt {
  font-size: 0.9375rem;
  color: var(--text-muted);
  line-height: 1.55;
}

.simple-list {
  list-style: none;
  border-top: 1px solid var(--border);
}

.row {
  display: flex;
  gap: 1rem;
  padding: 1.15rem 0;
  border-bottom: 1px solid var(--border);
  align-items: flex-start;
}

.row-thumb-wrap {
  flex-shrink: 0;
  width: 112px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--border);
}

.row-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.row-text {
  min-width: 0;
  flex: 1;
}

.row-meta {
  display: block;
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 0.35rem;
}

.row-title {
  font-family: "Newsreader", Georgia, serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.35rem;
  line-height: 1.4;
}

.row:hover .row-title {
  color: var(--accent);
}

.row-excerpt {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 480px) {
  .row-thumb-wrap {
    width: 88px;
    height: 56px;
  }
}
</style>
