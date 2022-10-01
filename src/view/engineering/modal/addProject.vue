<!--
 * @Descripttion: 
 * @version: 
 * @Author: mqq
 * @Date: 2022-09-12 15:19:35
 * @LastEditors: mqq
-->
<!--
 * @Author: your name
 * @Date: 2021-08-01 18:39:32
 * @LastEditTime: 2022-09-16 18:49:08
 * @LastEditors: Please set LastEditors
 * @Description: 任务编辑弹框
 * @FilePath: \wz-net-szt-platform\src\views\front\crisisJointOffice\cJOTaskList\taskList\modal\editTask.vue
-->
<template>
  <div class="edit_task">
    <div class="header">
      <div class="header_inner">
        <span>添加项目</span>
        <span @click="modalCancel()"></span>
      </div>
    </div>
    <div class="body">
      <el-form :model="projectObj" ref="taskInfoForm" :rules="rules">
        <el-form-item label="项目名称" label-width="80px" prop="projectName">
          <el-input
            type="text"
            placeholder="请填写项目名称"
            v-model="projectObj.projectName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="项目描述"
          label-width="80px"
          prop="projectDescription"
        >
          <el-input
            type="textarea"
            placeholder="请填写项目描述"
            :rows="3"
            :resize="'none'"
            v-model="projectObj.projectDescription"
            :maxlength="200"
            :show-word-limit="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="根目录" label-width="80px" prop="rootPath">
          <el-input
            type="text"
            placeholder="请填写根目录"
            v-model="projectObj.rootPath"
          ></el-input>
        </el-form-item>
        <el-form-item label="源地址" label-width="80px" prop="targetUrl">
          <el-input
            type="text"
            placeholder="请填写源地址"
            v-model="projectObj.targetUrl"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <button class="btn confirm" @click="confirm()">确定</button>
      <button class="btn cancel" @click="modalCancel()">取消</button>
    </div>
    <loaders :loader="loader" :smallRange="true"></loaders>
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
import useHttp from "@/service/httpService.js";
import $msg from "@/service/toast/toast";
import dayjs from "dayjs";
export default defineComponent({
  name: "editTask",
  props: {
    modalCancel: {
      type: Function,
      default: () => {},
    },
    modalConfirm: {
      type: Function,
      default: () => {},
    },
    id: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props, { emit }) {
    const { get, post } = useHttp();
    const { proxy } = getCurrentInstance();
    let data = reactive({
      taskInfoForm: null,
      loader: "",
      projectObj: {
        rootPath: "",
        projectName: "",
        projectDescription: "",
        isEnabled: "true",
        targetUrl: "",
      },
    });

    let rules = reactive({
      projectName: [
        {
          required: true,
          message: "项目名称不能为空！",
          trigger: "change",
        },
      ],
      projectDescription: [
        {
          required: true,
          message: "描述不能为空！",
          trigger: ["change", "blur"],
        },
      ],
      rootPath: [
        {
          required: true,
          message: "根目录不能为空！",
          trigger: ["change", "blur"],
        },
      ],
      targetUrl: [
        {
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("源地址不能为空！"));
              return;
            }
            var regExp1 =
              /^(http:|ftp:|https:)?(\/\/)?[a-z-A-z\d]*(\.)?[a-z-A-z\d]+(\.)?[a-z-A-z\d]+(\.(?:[a-z-A-z\d]+))+(\:(?:\d+))?(\/?|(\/.+)?)$/; //校验域名加端口号
            var regExp2 =
              /^(http:|ftp:|https:)?(\/\/)?(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])(\:?(:\d+))?(\/?|(\/.+)?)$/;
            let flag = regExp1.test(value) || regExp2.test(value);
            flag ? callback() : callback(new Error("请输入合法地址"));
          },
          required: true,
        },
      ],
    });

    /**
     * @description: 接口获取任务详情
     * @param {*}
     * @return {*}
     */

    /**
     * @description: 确定
     * @param {*}
     * @return {*}
     */
    const confirm = () => {
      data.taskInfoForm.validate(async (valid) => {
        if (!valid) return;
        props.id?edit():save()
      });
    };
    /**
     * @descripttion: 修改信息
     * @return {*}
     */    
    const edit = async() => {
       let params = {
        id: props.id,
        ...data.projectObj,
      };
      let { message, code } = await(
        (data.loader = post(`${repeatData}/editProject`, params))
      );
      proxy.$msg({
        type: String(code),
        content: message,
      });

      props.modalConfirm();
    };
    /**
     * @descripttion: 保存信息
     * @return {*}
     */    
    const save = async() => {
      let params = {
        id: Math.round(Math.random() * 1e8),
        isEnabled: "true",
        projectShow: "true",
        ...data.projectObj,
        createdDate: dayjs(new Date()).format("YYYY-MM-DD"),
      };
      let { message, code } = await(
        (data.loader = post(`${repeatData}/addProject`, params))
      );
      proxy.$msg({
        type: String(code),
        content: message,
      });

      props.modalConfirm();
    };
    /**
     * @descripttion: 获取详细信息
     * @return {*}
     */
    const getinfo = async () => {
      const params = {
        id: props.id,
      };
      let resp = await (data.loader = post(
        `${repeatData}/projectInfo`,
        params
      ));
      data.projectObj.rootPath = resp.data.rootPath;
      data.projectObj.projectName = resp.data.projectName;
      data.projectObj.projectDescription = resp.data.projectDescription;
      data.projectObj.targetUrl = resp.data.targetUrl;
    };
    onMounted(() => {
      props.id ? getinfo() : "";
    });
    return {
      ...toRefs(data),
      rules,
      getinfo,
      edit,
      save,
      confirm,
    };
  },
});
</script>
<style lang="less" scoped>
.edit_task {
  width: 600px;
  .body {
    margin-top: 20px;
    :deep(.el-input) {
      .el-input__inner {
        height: 35px;
        line-height: 35px;
      }
      .el-input__prefix,
      .el-input__suffix {
        top: 3px;
      }
    }
  }
}
</style>
