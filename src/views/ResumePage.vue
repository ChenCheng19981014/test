<template>
  <main class="resume-page">
    <header class="page-head">
      <h1 class="page-title">陈诚 · 前端开发工程师</h1>
      <p class="page-desc">
        5 年经验 · 无锡 · 关注工程化 / 可视化 / 3D 与数据平台
      </p>
    </header>

    <section class="grid">
      <section class="block">
        <h2 class="block-title">联系方式</h2>
        <ul class="kv">
          <li>
            <span class="k">电话</span> <span class="v">13151193828</span>
          </li>
          <li>
            <span class="k">邮箱</span> <span class="v">2524261183@qq.com</span>
          </li>
          <li><span class="k">城市</span> <span class="v">无锡</span></li>
          <li>
            <span class="k">期望</span> <span class="v">前端开发 · 12–13K</span>
          </li>
        </ul>
      </section>

      <section class="block">
        <h2 class="block-title">个人优势（精炼版）</h2>
        <ul class="bullets">
          <li>
            Vue2/3、React18（Hooks +
            redux-toolkit）多端实践，PC/H5/小程序均有落地。
          </li>
          <li>
            工程化：Webpack/Vite 配置、GitFlow 落地、CI/CD（Jenkins / GitHub
            Actions）自动化发布。
          </li>
          <li>
            可视化与 3D：Three.js / Cesium / ECharts / D3，做过数字孪生与 3D
            场景交互、相机动画、材质与动效。
          </li>
          <li>
            性能与质量：组件性能优化（useMemo/useCallback
            等）、图片懒加载与分包、了解 Jest / Sentry。
          </li>
        </ul>
      </section>
    </section>

    <section class="block">
      <h2 class="block-title">技能</h2>
      <ul class="tags">
        <li v-for="s in skills" :key="s">{{ s }}</li>
      </ul>
    </section>

    <section class="block">
      <h2 class="block-title">工作经历</h2>
      <ul class="timeline">
        <li>
          <span class="t-date">2024.08 — 至今</span>
          <span class="t-role">慧居科技股份有限公司 · 前端开发工程师</span>
          <p class="t-desc">
            智慧供热 PC（微前端）/ B 端小程序 / C 端 H5；负责项目模板、CI/CD
            流水线、规范落地与代码评审；参与 3D 可视化平台与自研 3D
            编辑器组件开发。
          </p>
        </li>
        <li>
          <span class="t-date">2020.12 — 2024.07</span>
          <span class="t-role">无锡零拓数字科技有限公司 · 前端开发工程师</span>
          <p class="t-desc">
            数据可视化/数字孪生类项目交付，包含大规模设备数据接入、3D
            场景交互、相机动画、性能优化与多端适配。
          </p>
        </li>
      </ul>
    </section>

    <section class="block">
      <h2 class="block-title">代表项目（可面试重点讲）</h2>
      <div class="projects">
        <article class="proj">
          <h3 class="proj-title">智慧供热平台（微前端 + 小程序）</h3>
          <p class="proj-meta">Micro-app · Vue · Uniapp · npm 工具包</p>
          <ul class="bullets">
            <li>
              处理微前端下 pdf/webWorker 冲突与 1080p
              场景滚动条异常，修复并发布自有工具包。
            </li>
            <li>
              封装 uniapp 类 element-plus
              表格滚动插件、定制图表包，提升多端交互一致性。
            </li>
          </ul>
        </article>
        <article class="proj">
          <h3 class="proj-title">NLP 数据模型系统（知识图谱可视化）</h3>
          <p class="proj-meta">
            React18 · Hooks · redux-toolkit · D3 · ECharts · Big.js
          </p>
          <ul class="bullets">
            <li>
              负责整体前端架构与组件拆分，使用 memoization 优化渲染与交互性能。
            </li>
            <li>
              集成 D3/图表能力实现复杂力作用与数据关系呈现，支持交互探索。
            </li>
          </ul>
        </article>
        <article class="proj">
          <h3 class="proj-title">自研 3D 编辑器 / 数字孪生平台</h3>
          <p class="proj-meta">React18 / Vue · Three.js · GSAP · WebSocket</p>
          <ul class="bullets">
            <li>
              负责 3D 场景动效、相机动画、材质与部分组件开发；封装通用 hooks
              与工具函数。
            </li>
            <li>
              实践场景缓存与异步加载优化，处理 canvas/webgl 压力导致的卡顿问题。
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="grid">
      <section class="block">
        <h2 class="block-title">教育经历</h2>
        <ul class="kv">
          <li>
            <span class="k">学校</span>
            <span class="v">江苏科技大学苏州理工学院</span>
          </li>
          <li>
            <span class="k">学历</span>
            <span class="v">本科 · 软件工程（2019–2021）</span>
          </li>
        </ul>
      </section>
      <section class="block">
        <h2 class="block-title">证书与亮点</h2>
        <ul class="bullets">
          <li>HCIP 华为认证 ICT 高级工程师</li>
          <li>在司研发期间曾获最佳员工</li>
          <li>参与项目交付与业务推进，累计成交额约 200 万（简历原文）</li>
        </ul>
      </section>
    </section>

    <p class="foot-link">
      <RouterLink to="/blog">← 返回博客</RouterLink>
    </p>
  </main>
</template>

<script setup lang="ts">
/** 改成你的真实简历链接（PDF / Notion / 个人站等） */
const resumeUrl = "/resume.pdf";

const skills = [
  "HTML5/CSS3/ES6+",
  "TypeScript",
  "Vue2/3",
  "React18",
  "Pinia/Vuex",
  "redux-toolkit",
  "Vite/Webpack",
  "Node.js",
  "Electron",
  "WebSocket/SSE",
  "Three.js/Cesium",
  "ECharts/D3",
  "CI/CD(Jenkins, GitHub Actions)",
  "Nginx/Docker",
];
</script>

<style scoped lang="scss">
.resume-page {
  width: min(80vw, var(--container-max));
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

.page-head {
  margin-bottom: 1.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border);
}

.page-title {
  font-family: "Newsreader", Georgia, serif;
  font-size: clamp(1.75rem, 4vw, 2.1rem);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.page-desc {
  color: var(--text-muted);
  font-size: 1rem;
}

.cta-banner {
  padding: 1.25rem 1.35rem;
  margin-bottom: 2rem;
  background: var(--accent-soft);
  border: 1px solid color-mix(in srgb, var(--accent) 25%, var(--border));
  border-radius: 8px;
}

.cta-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 600;
  font-size: 1.05rem;
}

.cta-arrow {
  font-size: 0.9em;
  opacity: 0.85;
}

.cta-hint {
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.cta-hint code {
  font-size: 0.85em;
  padding: 0.1em 0.35em;
  background: var(--bg-elevated);
  border-radius: 4px;
  border: 1px solid var(--border);
}

.block {
  margin-bottom: 2rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.block-title {
  font-family: "Newsreader", Georgia, serif;
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text);
}

.prose {
  line-height: 1.7;
  color: var(--text);
}

.kv {
  list-style: none;
}

.kv li {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.9375rem;
}

.k {
  color: var(--text-muted);
  min-width: 3rem;
}

.tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tags li {
  padding: 0.35rem 0.75rem;
  font-size: 0.875rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-muted);
}

.bullets {
  list-style: none;
  display: grid;
  gap: 0.6rem;
  color: var(--text);
}

.bullets li {
  position: relative;
  padding-left: 1.1rem;
  line-height: 1.6;
  color: var(--text);
}

.bullets li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.68em;
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 999px;
  background: var(--accent);
}

.timeline {
  list-style: none;
}

.timeline > li {
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
}

.t-date {
  display: block;
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.t-role {
  font-weight: 600;
  color: var(--text);
}

.t-desc {
  margin-top: 0.35rem;
  font-size: 0.9375rem;
  color: var(--text-muted);
  line-height: 1.55;
}

.projects {
  display: grid;
  gap: 1rem;
}

.proj {
  padding: 1.1rem 1.2rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.proj-title {
  font-family: "Newsreader", Georgia, serif;
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.proj-meta {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.foot-link {
  margin-top: 2rem;
  font-size: 0.9375rem;
}
</style>
