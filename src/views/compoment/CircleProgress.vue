<template>
  <div class="circleProgress">
    <canvas
      ref="circleCanvas"
      :width="canvasSize"
      :height="canvasSize"
    ></canvas>
    <div class="progress-tips">{{ (progress * 100).toFixed(0) }}%</div>
  </div>
</template>

<script>
export default {
  name: "CircleProgress",
  props: {
    progress: {
      type: Number,
      required: true,
      default: 0,
    },
    canvasSize: {
      type: Number,
      default: 50,
    },
    lineWidth: {
      type: Number,
      default: 6,
    },
  },
  watch: {
    progress: "drawProgress",
  },
  mounted() {
    this.drawProgress(this.progress);
  },
  methods: {
    drawProgress(progress) {
      const canvas = this.$refs.circleCanvas;
      const ctx = canvas.getContext("2d");
      const width = this.canvasSize;
      const height = this.canvasSize;
      const radius = this.canvasSize / 2 - this.lineWidth;
      const startAngle = Math.PI / 2;
      const endAngle = startAngle + progress * 2 * Math.PI;

      // 绘制底部圆
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = this.lineWidth;
      ctx.stroke();

      // 绘制进度条
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, startAngle, endAngle, false);
      ctx.strokeStyle = "#2E80FF";
      ctx.lineWidth = this.lineWidth;
      ctx.lineCap = "round";
      ctx.stroke();
    },
  },
};
</script>

<style scoped>
.circleProgress {
  width: 100%;
  height: 100%;
  position: relative;
}

canvas {
  display: block;
  margin: 0 auto;
}

.progress-tips {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #4876ff;
  font-weight: bold;
  font-size: 14px;
  font-family: "Douyin Sans";
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
