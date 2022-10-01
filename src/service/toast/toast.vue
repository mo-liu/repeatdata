<template>
  <transition name="bounce">
    <div class="sys-toast" v-if="isShow">
      <div
        class="sys-toast-body"
        v-if="isShow && curType != 'complex'"
        :class="{
          success: curType == 200,
          error: curType == 500,
          info: curType == 1 || curType == 'toast',
        }"
      >
        <div class="iconfont_div">
          <span
            class="iconfont"
            :class="{
              'icon-zhengque': curType == 200,
              'icon-cuowu': curType == 500,
              'icon-gantanhao-quan': curType == 1 || curType == 'toast',
            }"
          ></span>
        </div>
        <div class="sys-toast-msg" v-html="content"></div>
        <div class="sys-toast-subMsg" v-html="subMsg"></div>
      </div>
      <div class="complex-toast" v-if="isShow && curType == 'complex'">
        <span class="close iconfont icon-cuowu" @click="closeToast"></span>
        <span class="iconfont icon-gantanhao-quan"></span>
        <p class="title">{{ errorsMsg }}</p>
        <div class="list_main">
          <div class="success_list_container">
            <ul class="success_list">
              <li
                class="success_item"
                v-for="(item, index) in successArray"
                :key="`success_${index}`"
              >
                <span class="iconfont icon-tongguo-21"></span>
                <p class="item_content" v-html="item.message"></p>
              </li>
            </ul>
          </div>
          <div class="fail_list_container">
            <ul class="fail_list">
              <li
                class="fail_item"
                v-for="(item, index) in failArray"
                :key="`fail_${index}`"
              >
                <span class="iconfont icon-butongguo1"></span>
                <p class="item_content" v-html="item.message"></p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { defineComponent, getCurrentInstance, onMounted, ref } from "vue";
const toast = defineComponent({
  props: {
    msg: {
      type: [String, Object],
      required: true,
    },
    subMsg: {
      type: String,
      default: "",
    },
    time: {
      type: Number,
      default: 2000,
    },
    type: {
      type: [String, Number],
      default: "",
    },
    big: {
      type: Boolean,
      default: false,
    },
    callback: {
      type: Function,
      default: () => {},
    },
    errorsMsg: {
      type: String,
      default: "操作结果如下：",
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const isShow = ref(false);
    const curType = ref(props.type);
    const content = curType.value != "complex" ? ref(props.msg) : ref("");
    const successArray = ref([]); //成功返回信息数组
    const failArray = ref([]); //失败返回信息数组

    const closeToast = () => {
      isShow.value = false;
      proxy.callback();
    };

    onMounted(() => {
      isShow.value = true;
      if (props.type == "complex" && typeof props.msg == "object") {
        if (
          (typeof props.msg.failList == "undefined" ||
            props.msg.failList.length == 0) &&
          props.msg.successList.length > 0
        ) {
          curType.value = "200";
          content.value = "操作成功";
          setTimeout(
            () => {
              console.log(context);
              isShow.value = false;
              proxy.callback();
            },
            curType.value == "complex" ? 3000 : props.time
          );
        } else {
          // this.time = 5;
          successArray.value = [...props.msg.successList];
          failArray.value = [...props.msg.failList];
        }
      } else {
        setTimeout(
          () => {
            console.log(context);
            isShow.value = false;
            proxy.callback();
          },
          curType.value == "complex" ? 3000 : props.time
        );
      }
    });
    return {
      isShow,
      curType,
      content,
      successArray,
      failArray,
      closeToast,
    };
  },
});
export default toast;
</script>
<style scoped lang="less">
.sys-toast {
  z-index: 999999;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.sys-toast-body {
  z-index: 999999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 400px;
  max-width: 900px;
  min-height: 256px;
  padding: 0px 10px 57px;
  text-align: center;
  background: #ffffff;
  box-shadow: 0 0 7px 0 rgb(0 0 0 / 25%);
  border-radius: 5px;
  .sys-toast-msg {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &.success,
  &.error,
  &.info {
    .sys-toast-msg {
      color: #000;
      width: auto;
      height: auto;
      font-size: 18px;
      font-weight: 400;
      line-height: 28px;
      max-height: 140px;
      overflow: hidden;
      word-break: break-all;
      word-wrap: break-word;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }

    .sys-toast-subMsg {
      color: #4a4a4a;
      width: auto;
      height: auto;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      max-height: 75px;
      overflow: hidden;
      word-break: break-all;
      word-wrap: break-word;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      margin-top: 18px;
    }

    .iconfont_div {
      margin: 77px auto 20px;
      width: 80px;
      height: 80px;
      border-radius: 50%;

      .iconfont {
        font-size: 38px;
        display: inline-block;
        position: relative;
        margin-top: 20px;
        color: #fff;
      }
    }
  }

  &.success {
    .iconfont_div {
      background: #8cce81;
    }
  }

  &.error {
    .iconfont_div {
      background: #e76765;
    }
  }

  &.info {
    .iconfont_div {
      background: #ffaf2c;
    }
  }
}
.complex-toast {
  z-index: 999999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  max-height: 400px;
  min-height: 230px;
  padding: 40px;
  text-align: center;
  border-radius: 2px;
  background: #fff;
  box-shadow: 0px 0px 11px 0px rgba(0, 0, 0, 0.23);

  .icon-cuowu {
    position: absolute;
    right: 15px;
    top: 15px;
    color: #9b9b9b;
    cursor: pointer;
  }
  .list_main {
    height: calc(100% - 65px - 50px);
    overflow: auto;
  }
  .icon-gantanhao-quan {
    color: #fff;
    font-size: 50px;
    background: orange;
    border-radius: 50%;
    padding: 8px;
  }
  .title {
    font-weight: 500;
    font-size: 18px;
    padding: 20px 0;
  }
  .success_list_container,
  .fail_list_container {
    width: 100%;
    // max-height: 50%;
    // overflow-y: auto;
    text-align: left;
    .success_list {
      .success_item {
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .iconfont {
          color: #94cb81;
          margin-right: 10px;
          flex-shrink: 0;
        }
        .item_content {
          display: inline-block;
          vertical-align: middle;
          line-height: 16px;
          margin: 5px 0;
          width: calc(100% - 26px);
          word-wrap: break-word;
          word-break: break-all;
          white-space: pre-wrap !important;
        }
      }
    }
    .fail_list {
      max-height: 208px;
      overflow: auto;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      .fail_item {
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .iconfont {
          color: #f27070;
          margin-right: 10px;
          flex-shrink: 0;
        }
        .item_content {
          display: inline-block;
          vertical-align: middle;
          line-height: 16px;
          margin: 5px 0;
          width: calc(100% - 26px);
          word-wrap: break-word;
          word-break: break-all;
          white-space: pre-wrap !important;
          :deep(.curIdx) {
            padding-right: 15px;
          }
          :deep(.status) {
            color: #1c75e3;
            font-style: normal;
            padding: 0 2px;
          }
        }
      }
    }
  }
}
</style>
