/*
 * @Descripttion: 
 * @version: 
 * @Author: flj
 * @Date: 2021-07-13 11:26:56
 * @LastEditors: mqq
 */
/**
 * 组件自动全局注入脚本
 */
import toastSingleton from "@/service/toast/toast.js" //toast提示
import askSingleton from "@/service/ask/ask.js" //确定(取消)提示框

/*element-ui 部分全局注入组件 start */
import "element-plus/theme-chalk/index.css"; // 引入element-plus基础样式
// 设置语言
import {
  //表单
  ElForm,
  ElFormItem,
  //Input
  ElInput,
  //Button
  ElButton,
  //Radio
  ElRadio,
  ElRadioGroup,
  //Checkbox
  ElCheckbox,
  ElCheckboxGroup,
  //Select
  ElSelect,
  ElOption,
  //DateTimePicker
  ElDatePicker,
  //Pagination
  ElPagination,
  //Dropdown
  ElDropdown,
  // Switch
  ElSwitch,
  // Tree
  ElTree,
  // Tag
  ElTag
} from 'element-plus/lib/index'

/*element-ui 部分全局注入组件 end */

/**
 * @param str 字符串
 * @example heheHaha
 * @return {string} HeheHaha
 */
function capitalizeFirstLetter(str) {
  return str.slice(0);
}

/**
 * 对符合'xx/xx.vue'组件格式的组件取组件名
 * @param str fileName
 * @example abc/bcd/def/basicTable.vue
 * @return {string} BasicTable
 */
function validateFileName(str) {
  return (
    /^\S+\.vue$/.test(str) &&
    str.replace(/^\S+\/(\w+)\.vue$/, (rs, $1) => capitalizeFirstLetter($1))
  );
}

const requireComponent = require.context("./", true, /\.vue$/);

export default {
  install(app, options) {
    // 找到组件文件夹下以.vue命名的文件，如果文件名为index，那么取组件中的name作为注册的组件名
    requireComponent.keys().forEach(filePath => {
      const componentConfig = requireComponent(filePath);
      const fileName = validateFileName(filePath);
      const componentName =
        fileName.toLowerCase() === "index" ?
        capitalizeFirstLetter(componentConfig.default.name) :
        fileName;
      app.component(componentName, componentConfig.default || componentConfig);
    });
    app.config.globalProperties.$ask = askSingleton;
    app.config.globalProperties.$msg = toastSingleton;
    app.use(ElForm)
      .use(ElFormItem)
      .use(ElInput)
      .use(ElButton)
      .use(ElRadio)
      .use(ElRadioGroup)
      .use(ElCheckbox)
      .use(ElCheckboxGroup)
      .use(ElSelect)
      .use(ElOption)
      .use(ElDatePicker)
      .use(ElPagination)
      .use(ElDropdown)
      .use(ElSwitch)
      .use(ElTree)
      .use(ElTag)
  }
};