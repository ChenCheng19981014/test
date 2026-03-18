<template>
  <div class="child">
    <slot></slot>

    <slot name="man"></slot>

    <slot name="whaticansay" :msg="msg"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const msg = ref([1, 2, 3, 4, 5]);
</script>
<style scoped lang="scss">
.child {
  width: 100px;
  height: 100px;
}
</style>
