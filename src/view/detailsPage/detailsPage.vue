<!--
 * @Descripttion: 
 * @version: 
 * @Author: mqq
 * @Date: 2022-09-12 17:33:29
 * @LastEditors: mqq
-->
<template>
  <div class="detailsPage">
    <ul>
      <li class="items" v-for="(item, index) in items" :key="item.idx">
        <div class="operation">
          <span class="index">{{ index + 1 }}</span>
          <div class="right">
            <el-switch v-model="item.isEnabled" />
            <span class="iconfont icon-tianjia" @click="addList(index)"></span>
            <span
              class="iconfont icon-reduce"
              v-if="items.length > 1"
              @click="delList(item)"
            ></span>
          </div>
        </div>
        <div class="title">
          <span>接口地址：</span>
          <el-input
            type="text"
            placeholder="请填写接口地址"
            v-model="item.targetUrl"
          ></el-input>
        </div>
        <div class="describe">
          <span>接口描述：</span>
          <el-input
            type="text"
            placeholder="请填写接口描述"
            v-model="item.describe"
          ></el-input>
        </div>
        <div class="keyValue">
          <span>键值对：</span>
          <div class="valueData">
            <div
              class="flex"
              v-for="(inner_item, inner_index) in item.params"
              :key="inner_index"
            >
              <span>键：</span>
              <el-input
                type="text"
                placeholder="name"
                v-model="inner_item.key"
              ></el-input>
              <span>值：</span>
              <el-input
                type="text"
                placeholder="123"
                v-model="inner_item.value"
              ></el-input>
              <span
                class="iconfont icon-tianjia"
                @click="addParams(index, inner_index)"
              ></span>
              <span
                v-if="item.params.length > 1"
                class="iconfont icon-reduce"
                @click="deleteParams(index, inner_index)"
              ></span>
            </div>
          </div>
        </div>
        <div class="json">
          <jsonEditor
            v-model:jsonEditData="item.jsonEditData"
            @changeData="show"
          ></jsonEditor>
        </div>
        <el-button type="primary" @click="saveAll"> 保存 </el-button>
      </li>
    </ul>
    <loaders :loader="loader" :smallRange="false"></loaders>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  getCurrentInstance,
  computed,
} from "@vue/runtime-core";
import useHttp from "@/service/httpService";
import { useRoute, useRouter } from "vue-router";
import $msg from "@/service/toast/toast";
import loaders from "@/components/loaders/loaders.vue";
export default defineComponent({
  components: { loaders },
  setup() {
    const { get, post } = useHttp();
    const { proxy } = getCurrentInstance();
    const $route = useRoute();
    let initData = reactive({
      loader: "",
      items: [
        {
          idx: Math.round(Math.random() * 1e8),
          targetUrl: "", // 目标地址
          describe: "", // 描述
          isEnabled: true, //是否使用
          params: [
            // 键值对
            {
              key: "",
              value: "",
            },
          ],
          jsonEditData: {}, // 数据
        },
      ],
    });

    /**
     * @descripttion: 增加键值对
     * @param {*} index
     * @return {*}
     */
    const addParams = (index) => {
      let temp = {
        key: "",
        value: "",
      };
      initData.items[index].params.push(temp);
    };
    /**
     * @descripttion: 减少键值对
     * @param {*} index
     * @param {*} inner_index
     * @return {*}
     */
    const deleteParams = (index, inner_index) => {
      if (initData.items[index].params.length <= 1) {
        return;
      }
      initData.items[index].params.splice(inner_index, 1);
    };
    /**
     * @descripttion: 保存所有数据
     * @return {*}
     */
    const saveAll = async () => {
      let params = {
        id: $route.query.id,
        items: initData.items,
      };
      let { code, message } = await (initData.loader = post(
        `${repeatData}/saveAll`,
        params
      ));
      proxy.$msg({
        type: String(code),
        time: 1500,
        content: message,
        callback: () => {
          getList();
        },
      });
    };
    /**
     * @descripttion: 获取所有数据
     * @return {*}
     */
    const getList = async () => {
      let params = {
        id: $route.query.id,
      };
      let { data } = await (initData.loader = get(
        `${repeatData}/projectDetailInterface`,
        params
      ));
      if (data.length) {
        // 格式转换  目前没有什么好的方法
       let sendData = data.map(item=>{
          if(item.isEnabled=='true'){
            item.isEnabled=true
          }else{
            item.isEnabled=false
          }
          return item
       })
        // let sendData = JSON.parse(JSON.stringify(data), function (key, value) {
        //   if (value == "true") {
        //     return true;
        //   }
        //   if (value == "false") {
        //     return false;
        //   }
        //   return value;
        // });
        initData.items = sendData;
      }
    };
    /**
     * @descripttion: 添加数据
     * @param {*} index
     * @return {*}
     */
    const addList = (index) => {
      if (!initData.items[initData.items.length - 1].targetUrl) {
        proxy.$msg({
          type: 1,
          content: "请不要心急，慢慢来哦",
        });
        return;
      }
      let temp = {
        idx: Math.round(Math.random() * 1e8),
        targetUrl: "", // 目标地址
        describe: "", // 描述
        isEnabled: true, //是否使用
        params: [
          // 键值对
          {
            key: "",
            value: "",
          },
        ],
        jsonEditData: {}, // 数据
      };

      initData.items.splice(index + 1, 0, temp);
    };
    /**
     * @descripttion: 删除数据
     * @param {*} item
     * @return {*}
     */
    const delList = (item) => {
      
      initData.items = initData.items.filter((_item) => {
        return item.idx != _item.idx;
      });
      saveAll()
    };
    const show = () => {
      // let newData =
    };

    onMounted(() => {
      getList();
    });
    return {
      saveAll,
      delList,
      addList,
      getList,
      show,
      deleteParams,
      addParams,
      ...toRefs(initData),
    };
  },
});
</script>

<style lang="less" scoped>
.detailsPage {
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  overflow: auto;
  ul {
    width: 80%;
    margin: 0 auto;
    margin-top: 12px;
    .items {
      margin-bottom: 30px;
      .operation,
      .title,
      .describe,
      .keyValue {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        span {
          max-width: 200px;
          font-size: 15px;
        }
        .index {
          display: inline-block;
          min-width: 30px;
          height: 30px;
          line-height: 30px;
          // background-color: #f79f1f;
          color: #2e86de;
          border: 1px solid;
          color: #2e86de;
          text-align: center;
          border-radius: 50%;
          font-style: italic;
          font-size: 24px;
        }
        .el-input {
          flex: 1;
        }
      }
      .operation {
        justify-content: space-between;
        .right {
          display: flex;
          align-items: center;
          .iconfont {
            font-size: 20px;
            margin-left: 15px;
            color: @themeColor;
            cursor: pointer;
          }
        }
      }
      .keyValue {
        align-items: baseline;
        .valueData {
          .flex {
            display: flex;
            justify-items: flex-start;
            align-items: baseline;
            margin-bottom: 15px;
            .el-input {
              width: 150px;
              margin-right: 50px;
            }
            .iconfont {
              font-size: 17px;
              cursor: pointer;
              transition: all 0.5s;
              margin-right: 17px;
              &:hover {
                color: @themeColor;
              }
            }
          }
        }
      }
      .json {
        width: 100%;
        margin-bottom: 15px;
        /zdeep/.jsonEditor {
          .container {
            height: 300px;
          }
        }
      }
      /deep/.el-button {
        span {
          padding: 0px 15px;
        }
      }
    }
  }
}
</style>
