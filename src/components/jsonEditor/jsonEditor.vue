<!--
 * @Descripttion: 
 * @version: 
 * @Author: mqq
 * @Date: 2022-09-13 13:00:26
 * @LastEditors: mqq
-->
<template>
  <div class="jsonEditor">
    <JsonEditorVue
      class="editor"
      v-model="data"
      lang="zh"
      @change="jsonChange"
      @blur="validate"
    ></JsonEditorVue>
  </div>
</template>
<script>
import { defineComponent, reactive, ref } from "vue-demi";
import JsonEditorVue from "json-editor-vue3";
export default defineComponent({
  components: {
    JsonEditorVue,
  },
  props: {
    jsonEditData: {
      type: [Object, Array, String],
      default: () => {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const data = ref(props.jsonEditData);
    const validate = async (editor) => {
      const res = await editor.validate();
      // res 是错误列表，如果是空数组，则表示检测没有错误
      //   console.log(data.value)
      if (!res.length) {
        console.log(JSON.parse(JSON.stringify(data.value)));
        emit("update:jsonEditData", JSON.parse(JSON.stringify(data.value)));
        emit("changeData");
      }
    };
    const jsonChange = () => {
      emit("update:jsonEditData", JSON.parse(JSON.stringify(data.value)));
      emit("changeData");
    };
    return {
      data,
      jsonChange,
      validate,
    };
  },
});
</script>

<style lang="less" scope>
.jsonEditor {
  width: 100%;
  height: 100%;
}
</style>
