<script setup lang="js">
import CircleProgress from "./CircleProgress.vue";
import CardEffect from "./cardEffect.vue";

import gsap from "gsap";
const anima = (begin, end, time, onUpdate, onComplete) => {
  let newBegin = { ...begin };
  // 使用 gsap.to() 创建动画
  let tween = gsap.to(newBegin, {
    duration: time,
    ...end, // 动画的目标值
    onUpdate: () => {
      if (onUpdate) {
        onUpdate(newBegin);
      }
    },
    onComplete: () => {
      if (onComplete) {
        onComplete();
      }
      // GSAP 3.x 不再使用 killTweensOf
      gsap.killTweensOf(tween); // 如果需要停止 tween
      tween = null;
    }
  });

  return tween;
}

anima(
  { opacity: 0 }, // 起始状态
  { opacity: 1 }, // 目标状态
  3, // 动画时长 3秒
  (currentState) => {
    console.log('当前的状态',currentState);
  },
  () => {
    // 动画完成时，打印消息
    console.log("动画完成");
  }
);
</script>

<template>
  <div class="box">
    <CardEffect />
  </div>
</template>

<style scoped lang="less">
.box {
  // width: 500px;
  // height: 500px;
  width: 100%;
  height: 100%;
  // background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
