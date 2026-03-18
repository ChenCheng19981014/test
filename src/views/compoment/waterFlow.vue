<template>
  <div class="water-flow">
    <Waterfall :list="list" :breakpoints="breakpoints">
      <template #default="{ item, url, index }">
        <div class="card">
          <LazyImg class="card_img" :url="url" />
        </div>
      </template>
    </Waterfall>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { LazyImg, Waterfall } from "vue-waterfall-plugin-next";
import "vue-waterfall-plugin-next/dist/style.css";
const list = ref(
  new Array(88).fill("_").map((_, index) => {
    return {
      src: `https://picsum.photos/${index % 2 === 0 ? "500" : "500"}/${
        index % 2 === 0 ? "400" : "300"
      }`,
    };
  })
);

console.log(" list :", list.value);
const breakpoints = {
  1200: { rowPerView: 3 },
  800: { rowPerView: 2 },
  500: { rowPerView: 1 },
};
console.log("瀑布流");
</script>

<style scoped lang="scss">
.water-flow {
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  .card_img {
    border-radius: 5px;
    width: 200px;
    /* 高度不应该设置为固定的值 */
    height: auto; /* 让高度根据内容自动调整 */
  }
}
</style>
