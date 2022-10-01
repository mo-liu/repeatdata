<!--
 * @Author: li.shaowei
 * @Date: 2021-03-03 13:02:12
 * @Description: In User Settings Edit
-->
<template>
  <div
    class="loaders"
    :class="{ smallRange: smallRange, is_small_loading_only: smallLoading }"
    v-if="showLoader"
  >
    <div class="inner">
      <div class="loading_div">
        <div class="d1">
          <p></p>
          <p></p>
          <p></p>
          <p></p>
        </div>
        <div class="d1">
          <p></p>
          <p></p>
          <p></p>
          <p></p>
        </div>
      </div>
      <div class="text" v-text="tip"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "loaders",
  data() {
    return {
      showLoader: false,
      promise: "",
    };
  },
  props: {
    loader: {},
    tip: {
      type: String,
      default: "数据处理中，请稍候...",
    },
    smallRange: {
      //局部范围加载中
      type: Boolean,
      default: false,
    },
    smallLoading: {
      //小loading加载中，不带背景和tip显示
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    let self = this;
    if (this.smallRange) {
      $(self.$el).css("position", "absolute");
      let $parent = $(self.$el).parent().eq(0);
      $parent.css("position", "relative");
    }
    window.addEventListener("keydown", this.keyboardEvent);
  },
  methods: {
    /**
     * [keyboardEvent description] 键盘支持，退出蒙层
     * @return {[type]} [description]
     */
    keyboardEvent(event) {
      if (event.keyCode === 27 && this.showLoader === true) {
        this.showLoader = false;
      }
    },
  },
  unmounted() {
    window.removeEventListener("keydown", this.keyboardEvent);
  },
  watch: {
    loader: {
      handler(newV, oldV) {
        let self = this;
        if (this.promise) {
          clearTimeout(this.promise);
          this.promise = null;
        }
        if (!!newV) {
          this.showLoader = true;
          this.promise = newV.then(
            (success) => {
              this.showLoader = false;
            },
            (error) => {
              this.showLoader = false;
            }
          );
        }
        return this.promise;
      },
      immediate: true,
    },
  },
};
</script>
<style lang="less" scoped>
/*通用全局loading*/
.loaders {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  // cursor: wait;
  z-index: 999;
  background: rgba(0, 0, 0, 0.15);

  .inner {
    transform: scale(0.8, 0.8);
    left: 50%;
    margin-left: -145px;
    position: absolute;
    top: 50%;
    margin-top: -28px;
    padding: 0px 40px;
    display: flex;
    align-items: center;
    height: 84px;
    border-radius: 4px;
    background: rgba(168, 195, 226, 0.3);

    .loading_div {
      position: relative;
      width: 50px;
      height: 50px;

      .d1 {
        // width: 15px;
        // height: 15px;
        width: 45px;
        height: 45px;
        position: absolute;
        margin: 5px;

        p {
          // width: 5px;
          // height: 5px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #2799df; //#00A5FC;
          position: absolute;
          animation: loader-comp-dong 1.5s linear infinite;
        }
      }

      .d1 p:nth-child(1) {
        top: 0;
        left: 0;
      }

      .d1 p:nth-child(2) {
        top: 0;
        right: 0;
      }

      .d1 p:nth-child(3) {
        right: 0;
        bottom: 0;
      }

      .d1 p:nth-child(4) {
        bottom: 0;
        left: 0;
      }

      .d1:nth-of-type(2) {
        transform: rotate(45deg);
      }

      .d1:nth-of-type(1) p:nth-of-type(1) {
        /*负值:动画直接开始,但跳过前...秒动画*/
        animation-delay: -0.1s;
      }

      .d1:nth-of-type(2) p:nth-of-type(1) {
        animation-delay: -0.3s;
      }

      .d1:nth-of-type(1) p:nth-of-type(2) {
        animation-delay: -0.5s;
      }

      .d1:nth-of-type(2) p:nth-of-type(2) {
        animation-delay: -0.7s;
      }

      .d1:nth-of-type(1) p:nth-of-type(3) {
        animation-delay: -0.9s;
      }

      .d1:nth-of-type(2) p:nth-of-type(3) {
        animation-delay: -1.1s;
      }

      .d1:nth-of-type(1) p:nth-of-type(4) {
        animation-delay: -1.3s;
      }

      .d1:nth-of-type(2) p:nth-of-type(4) {
        animation-delay: -1.5s;
      }
    }

    // .ball-spin-fade-loader {
    //     position: relative;
    //     top: -7px;
    //     left: 10px;
    // }

    // .ball-spin-fade-loader>div {
    //     background-color: #ACB7D8;
    //     width: 15px;
    //     height: 15px;
    //     border-radius: 100%;
    //     margin: 2px;
    //     -webkit-animation-fill-mode: both;
    //     animation-fill-mode: both;
    //     position: absolute;
    // }

    .text {
      height: 25px;
      font-size: 20px;
      font-weight: 400;
      color: #2799df;
      line-height: 25px;
      display: inline-block;
      padding-left: 20px;
    }
  }
}

.smallRange {
  position: absolute;
}

/*很小范围不带文字和背景的loading*/
.loaders.is_small_loading_only {
  position: absolute;
  text-align: center;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;

  .inner {
    width: 100%;
    height: 100%;
    position: relative;
    margin: 0;
    padding: 0;
    background: none;
    top: 0;
    left: 0;
    transform: none;

    .loading_div {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      justify-content: center;

      .d1 {
        width: 15px;
        height: 15px;
        margin: 0px;

        p {
          width: 5px;
          height: 5px;
          background: #00a5fc;
        }
      }
    }

    .text {
      display: none;
    }
  }
}
</style>
<style lang="less">
@keyframes loader-comp-dong {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}
</style>
