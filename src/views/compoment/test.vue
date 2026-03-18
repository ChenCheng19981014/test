<template>
  <div class="home">
    <Child>
      <div>oh shit man</div>
      <template #man>kobe</template>
      <template v-slot:whaticansay="msg">
        <div v-for="(index, item) in msg.msg">{{ index }}-{{ item }}</div>
      </template>
    </Child>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Child from "@/views/compoment/child.vue";
</script>
<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
}
</style>
