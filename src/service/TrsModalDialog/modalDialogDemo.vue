<!--
 * @Author: your name
 * @Date: 2021-03-01 17:01:20
 * @LastEditTime: 2021-08-11 16:06:01
 * @LastEditors: flj
 * @Description: In User Settings Edit
 * @FilePath: \govappextend\src\service\TrsModalDialog\modalDialogDemo.vue
-->
<template>
  <div class="modal_dialog_demo">
    <div class="header">
      <div class="header_inner">
        <span>测试</span>
        <span @click="modalCancel()"></span>
      </div>
    </div>
    <div class="body">
      {{ bcd }}
      <el-date-picker
        v-model="daterangeValue"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="daterangeValue"
      >
      </el-date-picker>
      <div class="item">
        <span style="margin-left: 20px" v-tooltip side="top"
          >hover展示tip【v-tooltip】</span
        >
        <span style="margin-left: 20px" v-tooltip side="top" theme="small_tip"
          >hover展示小tip【v-tooltip】</span
        >
      </div>
    </div>
    <div class="footer">
      <button class="btn confirm" @click="confirm">确定</button>
      <button
        class="general_btn"
        v-disabled="true"
        :side="'top'"
        :tipZIndex="199999"
        theme="small_tip"
        :disabledTip="'请选择。。。'"
      >
        <span class="btn_text">不可用的按钮</span>
      </button>
      <button class="btn cancel" @click="modalCancel()">取消</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "modalDialogDemo",
  props: {
    modalConfirm: {
      type: Function,
      default: () => {},
    },
    modalCancel: {
      type: Function,
      default: () => {},
    },
    bcd: {
      type: Number,
    },
  },
  data() {
    return {
      daterangeValue: [
        new Date(2000, 10, 10, 0, 0, 0),
        new Date(2000, 10, 11, 23, 59, 59),
      ],
    };
  },
  methods: {
    confirm() {
      this.modalConfirm({
        a: 1,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.modal_dialog_demo {
  width: 500px;
  height: 300px;
}
</style>