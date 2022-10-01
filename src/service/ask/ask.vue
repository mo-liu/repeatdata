<template>
  <transition name="slide-fade">
    <div class="ask" v-if="showAsk">
      <div class="ask-m">
        <div class="ask-body">
          <div class="ask-head">
            <div class="ask-icon" :class="type">
              <i class="iconfont iconwenhao" :class="types[type]"></i>
            </div>
          </div>
          <div class="ask-content">
            <span v-text="content"></span>
            <span class="ask-detail" v-text="detail"></span>
          </div>
          <div class="ask-footer">
            <span class="ask-confirm" @click="confirmBtn()">
              <span class="ask-button"> 确定 </span>
            </span>
            <span class="ask-cancel" @click="cancelBtn()">
              <span class="ask-button"> 取消 </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: "question",
    },
    content: {
      type: String,
      default: "",
    },
    detail: {
      type: String,
      default: "",
    },
    confirm: {
      type: Function,
      default: () => {},
    },
    cancel: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      showAsk: false,
      types: {
        error: "icon-cuowu",
        question: "icon-help",
        question1: "icon-gantanhao-quan",
        //curType: "icon-tanhao",
      },
      //isNeedKeydown: false, //是否需要添加键盘按键（快捷键）监听事件
    };
  },
  created() {
    //监听键盘事件
    document.addEventListener("keydown", this.handleKeyDown);
  },
  unmounted() {
    //销毁监听键盘事件
    document.removeEventListener("keydown", this.handleKeyDown);
  },
  mounted() {
    this.showAsk = true;
  },
  methods: {
    //键盘按键事件
    handleKeyDown(e) {
      let info = this;
      // if (!info.isNeedKeydown) {
      //     return; //不做任何操作
      // }
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode == 71) {
        // 按 g键
        //要做的事情
        //确定
        info.$nextTick(() => {
          if (info.showAsk) {
            info.confirmBtn();
          }
        });
      }
      if (e && e.keyCode == 72) {
        // 按 h键
        //要做的事情
        //取消
        info.$nextTick(() => {
          if (info.showAsk) {
            info.cancelBtn();
          }
        });
      }
    },
    confirmBtn() {
      this.showAsk = false;
      this.confirm();
    },
    cancelBtn() {
      this.showAsk = false;
      this.cancel();
    },
  },
};
</script>
<style lang="less" scoped>
.ask {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);

  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.3s ease;
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateY(-300px);
    opacity: 0;
  }

  .ask-m {
    position: fixed;
    z-index: 300;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    .ask-body {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      min-height: 305px;
      background: #ffffff;
      box-shadow: 0 0 7px 0 rgb(0 0 0 / 25%);
      border-radius: 5px;
    }

    .ask-content {
      text-align: center;
      line-height: 25px;
      margin: 0 30px 45px;
      // font-size: 18px;
      // color: #000000;
      font-size: 16px;
      color: #4A4A4A;
      font-weight: 400;

      .ask-detail {
        display: block;
        margin-top: 5px;
        line-height: 20px;
        font-size: 14px;
        color: #d43d3b;
      }
    }

    .ask-footer {
      width: 100%;
      height: 40px;
      text-align: center;
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }

    .ask-cancel {
      background-color: #b2b2b2;
      border-radius: 2px;
      cursor: pointer;
      color: #fff;
      width: 100px;
      height: 35px;
      display: inline-block;
      position: relative;
      line-height: 35px;
      font-size: 16px;

      // &:hover {
      //     background-color: #c2c5cd;
      // }
    }

    .ask-confirm {
      cursor: pointer;
      color: #fff;
      display: inline-block;
      position: relative;
      width: 100px;
      height: 35px;
      background: @themeColor;
      border-radius: 2px;
      line-height: 35px;
      font-size: 16px;
      margin-right: 20px;

      &:hover {
        // background-color: #c2c5cd;
      }
    }

    .ask-button {
      width: 100%;
      height: 40px;
      text-align: center;
    }

    .ask-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 54px auto 15px;
      background: @themeColor;
      &.question1 {
        background: #ff9300;
      }

      .iconfont {
        font-size: 56px;
        text-align: center;
        display: block;
        color: #fff;
        padding-top: 15px;
      }
    }
  }
}
</style>