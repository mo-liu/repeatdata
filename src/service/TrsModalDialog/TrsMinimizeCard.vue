<template>
  <div
    class="trs_minimize_card"
    @click="restoreSizeInner"
  >
    <span
      class="title"
      :title="title"
      v-text="title"
    ></span>
    <div
      :style="{ width: progress * 100 + '%' }"
      class="progress"
    ></div>
  </div>
</template>
<script>
export default {
  name: 'TrsMinimizeCard',
  props: {
    title: {
      type: String,
      default: '点击最大化'
    }
  },
  data() {
    return {
      progress: 0 // 进度条
    }
  },

  mounted() {},
  methods: {
    restoreSizeInner(e) {
      if (typeof this.restoreSize === 'function') {
        this.restoreSize(e)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.trs_minimize_card {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0 10px;
  align-items: center;
  box-sizing: border-box;
  background: #303344;
  border: 1px solid #4d89ff;
  box-sizing: border-box;
  border-radius: 5px;
  cursor: pointer;
  position: relative;

  .title {
    position: relative;
    z-index: 1;
    display: inline-block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .progress {
    width: 0;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: #4d89ff;
    opacity: 0.5;
    z-index: 0;
    transition: width 0.5s;
  }
}
</style>
