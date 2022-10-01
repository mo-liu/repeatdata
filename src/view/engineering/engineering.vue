<!--
 * @Descripttion: 
 * @version: 
 * @Author: mqq
 * @Date: 2022-09-10 20:12:48
 * @LastEditors: mqq
-->
<template>
  <div class="engineering">
    <div class="header">
      <span class="left"> RepeatData </span>
      <div class="right"></div>
    </div>
    <div class="content">
      <el-button type="primary" @click="addProject">添加项目</el-button>
      <ul class="item">
        <li v-for="item in items" :key="item.id">
          <div class="left">
            <p>{{ item.projectName }}</p>
            <p class="overflow_text_2">
              {{ `项目描述：${item.projectDescription}` }}
            </p>
            <p>{{ `创建日期：${item.createdDate}` }}</p>
          </div>
          <div class="right">
            <el-switch v-model="item.isEnabled" @click="changeState(item)" />
            <span
              v-tooltip
              :side="'top'"
              :theme="'small_tip'"
              title="详情"
              @click="goToDetail(item)"
              class="iconfont icon-xiangqing"
            >
            </span>
            <span
              v-tooltip
              :side="'top'"
              :theme="'small_tip'"
              title="编辑"
              @click="editProject(item)"
              class="iconfont icon-xiugai1"
            >
            </span>
            <span
              v-tooltip
              :side="'top'"
              :theme="'small_tip'"
              title="删除"
              @click="del(item)"
              class="iconfont icon-shanchu"
            ></span>
          </div>
        </li>
      </ul>
      <loaders :loader="loader" :smallRange="false"></loaders>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  getCurrentInstance,
} from "@vue/runtime-core";
import useHttp from "@/service/httpService";
import { useRoute, useRouter } from "vue-router";

import { trsModalDialog } from "@/service/TrsModalDialog/TrsModalDialog";
export default defineComponent({
  setup() {
    const { get, post } = useHttp();
    const $route = useRoute();
    const $router = useRouter();
    const { proxy } = getCurrentInstance();
    let initData = reactive({
      loader: "",
      items: [],
    });
    /**
     * @descripttion: 获取列表数据
     * @return {*}
     */
    const getProjectData = async () => {
      let { data } = await (initData.loader = get(`${repeatData}/projectList`));
      initData.items = data.map((item) => {
        return {
          ...item,
          isEnabled: item.isEnabled == "true" ? true : false,
        };
      });
    };
    /**
     * @descripttion: 修改数据
     * @param {*} item
     * @return {*}
     */
    const changeState = async (item) => {
      let params = {
        id:item.id,
        isEnabled:item.isEnabled
        
      };
      let { message, code } = await post(
        `${repeatData}/projectState`,
        params
      );
      proxy.$msg({
        type: String(code),
        time: 1500,
        content: message,
        callback: () => {
          getProjectData();
        },
      });
    };
    /**
     * @descripttion: 删除数据
     * @param {*} item
     * @return {*}
     */    
    const del = async(item)=>{
      let params = {
        id:item.id
      }
       let { message, code } = await post(
        `${repeatData}/projectDelete`,
        params
      );
       proxy.$msg({
        type: code,
        time: 1500,
        content: message,
        callback: () => {
          getProjectData();
        },
      });
    }
    /**
     * @descripttion: 添加项目
     * @param {*} item
     * @return {*}
     */
    const addProject = (item) => {
      trsModalDialog(() => import("./modal/addProject.vue")).then(
        () => {
          getProjectData();
        },
        () => {}
      );
    };
    const goToDetail = (item) => {
      $router.push({
        name: "detailsPage",
        query: {
          id:item.id
        },
      });
    };
    /**
     * @descripttion: 编辑项目
     * @param {*} item
     * @return {*}
     */    
    const editProject = (item)=>{
      let params = {
        id:item.id
      }
      trsModalDialog(() => import("./modal/addProject.vue"),params).then(
        () => {
          getProjectData();
        },
        () => {}
      );
    }

    onMounted(() => {
      getProjectData();
      get(`${repeatData}/download`,{id:952272})
    });
    return {
      ...toRefs(initData),
      changeState,
      editProject,
      del,
      addProject,
      goToDetail,
    };
  },
});
</script>

<style lang="less" scoped>
.engineering {
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  .header {
    height: 70px;
    box-sizing: border-box;
    padding: 0px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: @themeColor;

    .left {
      color: #ffffff;
      font-size: 30px;
      font-style: italic;
      font-family: emoji;
    }
  }
  .content {
    box-sizing: border-box;
    padding: 30px 20px 0px;
    height: calc(100vh - 70px);
    overflow: auto;
    .item {
      margin-top: 15px;
      li {
        min-height: 120px;
        box-sizing: border-box;
        padding: 15px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 5px;
        margin-bottom: 25px;
        border-radius: 5px;
        border: 1px solid #dcdde1;
        transition: all 0.5s;
        &:hover {
          box-shadow: 2px 3px 10px 0px rgb(0 0 0 / 50%);
        }
        .left {
          flex: 1;
          p {
            padding: 3px 0;
            color: #c4c4c4c4;
            font-style: italic;
            &:first-child {
              font-style: initial;
              color: black;
              font-size: 16px;
              font-weight: 700;
            }
            &:last-child {
              font-style: initial;
              color: black;
            }
          }
          .overflow_text_2 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .right {
          display: flex;
          align-items: center;
          width: 600px;
          justify-content: flex-end;
          span {
            margin-left: 12px;
            font-size: 20px;
            cursor: pointer;
            &:hover {
              color: #1c75e3;
            }
          }
        }
      }
    }
  }
}
</style>
