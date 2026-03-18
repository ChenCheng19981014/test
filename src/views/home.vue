<template>
  <div class="site-shell">
    <SiteHeader />
    <div class="main-wrap">
      <router-view />
    </div>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import SiteHeader from "@/components/SiteHeader.vue";
import SiteFooter from "@/components/SiteFooter.vue";
</script>

<style scoped lang="scss">
.site-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-wrap {
  flex: 1;
  width: 100%;
  overflow-x: hidden;
}
</style>
