<template>
  <div class="mainBody">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
</script>
<style scoped lang="scss">
.mainBody {
  width: 100%;
  height: 100%;
  background-color: #777;
}
</style>
