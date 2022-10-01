<template>
  <router-view />
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
/* import eruda from 'eruda'; */
export default defineComponent({
  setup() {},
  /* eruda.init(); */
});
</script>

<style lang="less">
@import "./assets/less/init.less"; //初始化样式
@import "./assets/less/public"; //公共样式
</style>
