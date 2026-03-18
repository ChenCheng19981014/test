<template>
  <div class="container" id="container"></div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Player, { Gb, parseGlb } from "./scene/util";
import RunScene from "./scene/scene";

// 初始化场景
const initScene = () => {
  parseGlb("./assets/all.glb").then((glb) => {
    const runScene = new RunScene({
      glb,
      dom: document.querySelector("#container"),
    });
    runScene.run();
  });
};

onMounted(() => {
  initScene();
});
</script>
<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
