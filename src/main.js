/*
 * @Descripttion: 
 * @version: 
 * @Author: flj
 * @Date: 2021-07-13 11:16:51
 * @LastEditors: mqq
 */
// import '@/service/myPollify'
import * as vue from 'vue'
window.vue = vue;
const {
    createApp
} = vue;
import App from './App.vue';
import router from './router';
// import './service/interfaceSettings/interfaceSettings'; // 界面设置
import componets from './components/index.js';
import "./assets/less/resetElement.less"; //elementUI组件样式重置

import tooltip from './directives/tooltipster/tooltipster.js'; //v-tooltip
import disabled from './directives/v-disabled';
import "./assets/less/lists.less"; //列表页公用样式
import $ from 'jquery';
window.$ = $;


const app = createApp(App);
app.use(router)
    .use(componets)
    .use(tooltip)
    .use(disabled)
    .mount('#app');