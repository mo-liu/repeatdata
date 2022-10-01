/*
 * @Descripttion: 
 * @version: 
 * @Author: mqq
 * @Date: 2022-09-11 21:04:29
 * @LastEditors: mqq
 */
/*
 * @Descripttion:
 * @version:
 * @Author: flj
 * @Date: 2021-04-25 11:15:29
 * @LastEditors: HuangXiaojun
 */
import {
  createStore
} from 'vuex'
export default createStore({
  state: {
    loginUser: {},
    interfaceSettingData: {},
    loginUserAuth: '', //全局权限数据
    menuButtonAuthTree: '', //全局完整权限树
    selectedModule: {},
    messageCount: 0, // 左侧导航上的消息数
    undoTaskCount: 0, // 待办模块下左侧导航上的待办总数
    ddAuthCode: null, // 从钉钉获取的authCode
    isProvincialOffice: true
  },
  getters: {
    getLoginUser: (state) => state.loginUser,
    getSelectedModule: (state) => {
      return state.selectedModule
    },
    getLoginUserAuth: (state) => {
      return state.loginUserAuth
    },
    getMenuButtonAuthTree: (state) => {
      return state.menuButtonAuthTree
    },
    getMessageCount: (state) => {
      return state.messageCount
    },
    getUndoTaskCount: (state) => {
      return state.undoTaskCount
    },
    getIsProvincialOffice: (state) => {
      return state.isProvincialOffice
    }
  },
  mutations: {
    /**
     * [setLoginUserInfo 设置用户信息]
     * @param {[type]} state [description]
     * @param {[type]} user  [description]
     */
    setLoginUserInfo(state, user) {
      state.loginUser = user
    },
    setLoginUserAuth(state, auth) {
      state.loginUserAuth = auth
    },
    setMenuButtonAuthTree(state, tree) {
      state.menuButtonAuthTree = tree
    },
    setSelectedModule(state, modules) {
      state.selectedModule = modules
    },
    /**
     * @description: 设置消息未读总数
     * @param {*} state
     * @param {*} count
     * @return {*}
     */
    setMessageCount(state, count) {
      state.messageCount = count
    },
    /**
     * @description: 设置我的待办下的任务未读总数
     * @param {*} state
     * @param {*} count
     * @return {*}
     */
    setUndoTaskCount(state, count) {
      state.undoTaskCount = count
    }
  },
  actions: {},
  modules: {}
})