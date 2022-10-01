/*
 * @Descripttion: 
 * @version: 
 * @Author: mqq
 * @Date: 2022-09-11 21:09:51
 * @LastEditors: mqq
 */
/*
 * @Descripttion: 公用方法
 * @version: 
 * @Author: flj
 * @Date: 2021-04-27 16:44:25
 * @LastEditors: flj
 */
import dayjs from 'dayjs';
import deepCopy from 'deepcopy'; //深拷贝组件
/**
 * [copy description] 深度复制
 * @param  {[type]} obj [description] 被复制对象或数组
 * @return {[type]}     [description]
 */
export const copy = deepCopy;
/**
 * [clone 深拷贝]
 * @param   {[type]}  obj  [obj description]
 * @return  {[type]}       [return description]
 */
export const clone = (obj) => {
  let result = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = clone(obj[key]); //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
};

/**
 * [spliceStringNoAttribute description] 字符串拼接
 * @param  {[type]} array [description] 传入数组
 * @param  {[type]} symbol [description] 分割符号
 * @return {[type]}      [description] 返回拼接好的字符串
 */
export const spliceStringNoAttribute = function (array, symbol) {
  var myString = '';
  $.each(array, function (i, item) {
    myString += item + symbol;
  });
  myString = myString.substring(0, myString.length - symbol.length);
  return myString;
};
/**
 * [spliceString description] 字符串拼接(对象数组)
 * @param  {[type]} array [description] 传入对象数组
 * @param  {[type]} attribute [description] 需要拼接的属性名称
 * @param  {[type]} symbol [description] 分割符号
 * @param  {[type]} neededSubS [description] 是否需要截取,true需要截取,否则不截取
 * @return {[type]}      [description] 返回拼接好的字符串
 */
export const spliceString = (array, attribute, symbol, neededSubS) => {
  var myString = '';
  $.each(array, function (i, item) {
    let str = item[attribute] + '';
    str = neededSubS ? str.substring(0, 50) : str;
    myString += str + symbol;
  });
  myString = myString.substring(0, myString.length - symbol.length);
  return myString;
};

/**
 * [dealwithContent 列表正文处理：替换标签]
 * @param  {[type]} content   [需要处理的内容]
 * @return {[type]}           [处理完之后的内容]
 */
export const dealwithContent = (content, hasFont = true) => {
  let con = '';
  if (content && content.length > 0) {
    content = content
      .replace(/&lt(;)?/g, '<')
      .replace(/&nbsp(;)?/g, ' ')
      .replace(/&amp(;)?/g, '&')
      .replace(/&quot(;)?/g, "'")
      .replace(/&gt(;)?/g, '>')
      .replace(/\n/g, '')
      .replace(/<(\/)?[^>]*>/g, function ($a) {
        if (hasFont && ($a.indexOf('font') == 1 || $a.indexOf('font') == 2)) {
          return $a;
        } else {
          return '';
        }
      });
    con = content;
  }
  return con;
};

/**
 * [commGetObjByVal description]根据key获取数组里对应的对象
 * @param {object} datas [description] 数组
 * @param {object} keyAttribute [description] 数组的key属性名称
 * @param {object} key [description] 用于对比的key值
 * @return {[type]} [description] 匹配到的对象
 */
export const commGetObjByVal = function (datas, keyAttribute, key) {
  let obj = {};
  if (datas && datas.length > 0) {
    datas.forEach((v, i) => {
      if (v[keyAttribute] == key) {
        obj = v;
      }
    })
  }
  return obj;
};
/**
 * [commGetValByKey description]根据key获取对应的其他值信息
 * @param {object} datas [description] 数组
 * @param {object} keyAttributes [description] 数组的key属性
 * @param {object} valAttributes [description] 需要返回的val属性，如：name
 * @param {fn} key [description] 用于对比的key
 * @return {[type]} [description] 匹配到的值，如：name对应的值
 */
export const commGetValByKey = function (datas, keyAttribute, valAttribute, key) {
  let val = '';
  if (!key) {
    return val;
  }
  if (datas && datas.length > 0) {
    datas.forEach((v, i) => {
      if (v[keyAttribute] == key) {
        val = v[valAttribute];
      }
    })
  }
  return val;
};

/**
 * [commDateFormat 时间展示格式化]
 * @param  {[type]} dateStr [description]所需要处理的时间字符串「一般后端返回」
 * @return {[type]}         [description] 转换后的时间「今年之前：【2020-04-05 13:58】；本年度今日前数据：【04-05 13:58】；4小时-今日内：【今日 18:20】；4小时内：【3分钟前、2小时前】」
 */
export const commDateFormat = function (dateStr) {
  //将字符串转换成时间格式
  let result = '';
  if (typeof dateStr === "string") { //兼容safari浏览器的日期无法转换问题
    dateStr = dateStr.replace(/-/g, "/");
  }
  var curTime = new Date(dateStr);
  var nowTime = new Date();
  if (nowTime.getFullYear() - curTime.getFullYear() == 0) { //本年度今日前数据：【04-05 13:58】
    //let duration = dayjs.duration(dayjs(nowTime).diff(dayjs(curTime)));
    let duration = require('dayjs/plugin/duration');
    dayjs.extend(duration);
    duration = dayjs.duration(dayjs(nowTime).diff(dayjs(curTime)));
    let curTimeStr = dayjs(curTime).format('YYYY-MM-DD');
    let nowTimeStr = dayjs(nowTime).format('YYYY-MM-DD');
    if (dayjs(curTimeStr).isSame(dayjs(nowTimeStr))) { //今日(isSame判断是否是今日) 
      if (duration.hours() > 4) { //4小时-今日内：【今日 18:20】
        result = '今日 ' + dayjs(curTime).format('HH:mm');
      } else if (duration.hours() >= 1 && duration.hours() <= 4) { //4小时内：【3分钟前、2小时前】
        result = duration.hours() + '小时前';
      } else if (duration.hours() < 1 && duration.minutes() > 0) {
        result = duration.minutes() + '分钟前';
      } else {
        result = "刚刚";
      }
    } else {
      result = dayjs(curTime).format('MM-DD HH:mm');
    }
  } else { //今年之前：【2020-04-05 13:58】以及超前时间
    result = dayjs(curTime).format('YYYY-MM-DD HH:mm');
  }
  return result;
};
/**
 * [commDateFormatByYear 时间展示格式化]
 * @param  {[type]} dateStr [description]所需要处理的时间字符串「一般后端返回」
 * @return {[type]}         [description] 转换后的时间「今年之前：【2020-04-05 13:58】；本年度数据：【04-05 13:58】，即（本年内：月日时分，往年：年月日时分）」
 */
export const commDateFormatByYear = function (dateStr) {
  //将字符串转换成时间格式
  let result = '';
  if (typeof dateStr === "string") { //兼容safari浏览器的日期无法转换问题
    dateStr = dateStr.replace(/-/g, "/");
  }
  var curTime = new Date(dateStr);
  var nowTime = new Date();
  if (nowTime.getFullYear() - curTime.getFullYear() == 0) { //本年度今日前数据：【04-05 13:58】
    result = dayjs(curTime).format('MM-DD HH:mm');
  } else { //今年之前：【2020-04-05 13:58】以及超前时间
    result = dayjs(curTime).format('YYYY-MM-DD HH:mm');
  }
  return result;
};
//今日4小时以内的数据，即在列表上显示为“X分钟前”“X小时前”的时间，转化为显示“XX-XX XX:XX”
export const dateFormatTo_ = function (dateStr) {
  //将字符串转换成时间格式
  let result = '';
  if (typeof dateStr === "string") { //兼容safari浏览器的日期无法转换问题
    dateStr = dateStr.replace(/-/g, "/");
  }
  // var curTime = new Date(dateStr);
  // var nowTime = new Date();
  // let duration = moment.duration(moment(nowTime).diff(moment(curTime)));
  // let curTimeStr = moment(curTime).format('YYYY-MM-DD');
  // let nowTimeStr = moment(nowTime).format('YYYY-MM-DD');
  // if (moment(curTimeStr).isSame(moment(nowTimeStr))) { //今日(isSame判断是否是今日) 
  //     if (duration.hours() <= 4) {
  //         result = moment(curTime).format('MM-DD HH:mm'); //今日4小时以内的数据，即在列表上显示为“X分钟前”“X小时前”的时间
  //     }
  // }
  return result;
};

/**
 * [listSerial 列表序号]
 *
 * @param   {[type]}  index  [index description]
 *
 * @return  {[type]}         [return description]
 */
export const listSerial = (index, page) => {
  return index + 1 + (page.currentPage - 1) * page.pageSize;
};

/**
 * [isAllChecked 判断是否全部选中]
 *
 * @return  {[type]}  [return description]
 */
export const isAllChecked = (items, selectedItems) => {
  return items.length > 0 && selectedItems.length === items.length;
};

/**
 * [allChoose 全选操作]
 *
 * @return  {[type]}  [return description]
 */
export const allChoose = (items, selectedItems) => {
  if (isAllChecked(items, selectedItems)) {
    selectedItems.length = 0;
  } else {
    selectedItems.length = 0;
    selectedItems.push(...items);
  }
};

/**
 * [isChecked description]
 *
 * @param   {[type]}  item  [item description]
 *
 * @param   {[type]}  data  [data 外部传入需要查找的数组]
 *
 * @return  {[type]}        [return description]
 */
export const isChecked = (item, data, id = 'id') => {
  let index = -1;
  if (data.length === 0)
    return {
      flag: false,
      index: -1,
    };
  const flag = data.some((_item, _index) => {
    index = _index;
    return _item[id] === item[id];
  });
  return {
    flag,
    index
  };
};

/**
 * [singleChoose description]
 *
 * @param   {[type]}  item  [item description]
 *
 * @param   {[type]}  data  [item description]
 *
 * @return  {[type]}        [return description]
 */
export const singleChoose = (item, data, id = 'id', isSingleChoose = false) => {
  let {
    flag,
    index
  } = isChecked(item, data, id);
  if (isSingleChoose) {
    if (flag) {
      data.splice(index, 1);
    } else {
      data.splice(0, data.length);
      data.push(item);
    }
  } else {
    flag ? data.splice(index, 1) : data.push(item);
  }
};
import useHttp from '@/service/httpService';

import store from '../store';
const {
  post,
  get
} = useHttp();

/**
 * [getLoginUserInfo 获取用户信息]
 *
 * @return  {[type]}  [return description]
 */
export const getLoginUserInfo = () => {
  return new Promise((resolve, reject) => {
    let loginUser = store.state.loginUser;
    if (
      loginUser instanceof Object &&
      JSON.stringify(loginUser) != '{}' &&
      !!loginUser
    ) {
      resolve({
        message: loginUser
      });
      return;
    }
    post(`${wzNetUrl}/getLoginUser`, {}, true).then(
      (res) => {
        if (res.code == 200) {
          let {
            message: loginUser
          } = res;
          store.commit('setLoginUserInfo', loginUser);
          localStorage.setItem('wzSztUserInfo', JSON.stringify(loginUser));
        } else {
          store.commit('setLoginUserInfo', {});
        }
        resolve(res);
      },
      (err) => {
        reject(err);
      }
    );
  });
};
/**
 * [authorized 查询是否拥有权限]
 *
 * @param   {[String,Array]}  authName  [authName 权限名称，用逗号隔开的中文字符串或数组]
 *
 * @return  {[Boolean]}            [return description]
 */
export const authorized = (authName) => {
  let flag = false;
  let newAuthName = '通用,' + authName;
  if (newAuthName instanceof Array) {
    newAuthName.forEach((item) => {
      authorized(item);
    });
  } else {
    authorized(newAuthName);
  }
  if (store.state.loginUser.tenantId == 41) {
    //市本级用户
    let newAuthName1 = '市本级,' + authName;
    if (newAuthName1 instanceof Array) {
      newAuthName1.forEach((item) => {
        authorized(item);
      });
    } else {
      authorized(newAuthName1);
    }
  } else {
    //区县用户
    let newAuthName1 = '区县,' + authName;
    if (newAuthName1 instanceof Array) {
      newAuthName1.forEach((item) => {
        authorized(item);
      });
    } else {
      authorized(newAuthName1);
    }
  }
  /**
   * [authorized description] 查询是否拥有权限私有方法
   * @param  {[type]} authName [description] [权限名称，用逗号隔开的中文字符串]
   * @return {[type]}          [description]
   */
  function authorized(authName) {
    if (!authName) return (flag = true);
    let authNameArray = authName.split(',');
    queryAuthor(authNameArray, store.state.loginUserAuth);
  }

  /**
   * [queryAuthor description] 查询指定名称的权限是否存在
   * @param  {[Array]} nameArray [description] 权限名称数组
   * @param  {[Array]} authTreeArray [description] 权限数组（树结构）
   * @return {[type]}               [description]
   */
  function queryAuthor(nameArray, authTreeArray) {
    for (let i = 0; i < authTreeArray.length; i++) {
      let authTreeNode = authTreeArray[i];
      let name = nameArray[0];
      if (authTreeNode.menuMame !== name) {
        continue;
      }
      nameArray.splice(0, 1);
      if (nameArray.length === 0) {
        flag = true;
      } else {
        queryAuthor(nameArray, authTreeNode.childs);
      }
      break;
    }
  }
  return flag;
};
/**
 * [getLoginUserAuth 获取登录用户权限]
 *
 * @return  {[type]}  [return description]
 */
export const getLoginUserAuth = () => {
  return new Promise((resolve) => {
    let loginUserAuth = store.getters.getLoginUserAuth;
    if (loginUserAuth !== '') {
      resolve(loginUserAuth);
    } else {
      post(`${window.wzNetUrl}/getLoginUserAuth`).then((resp) => {
        let { childs } = resp.currUserAuth;
        store.commit('setLoginUserAuth', childs);
        resolve();
      });
    }
  });
};

/**
 * [getMenuButtonAuthTree 获取完整页面权限树结构]
 *
 * @return  {[type]}  [return description]
 */
export const getMenuButtonAuthTree = () => {
  return new Promise((resolve) => {
    let menuButtonAuthTree = store.getters.getMenuButtonAuthTree;
    if (menuButtonAuthTree !== '') {
      resolve(menuButtonAuthTree);
    } else {
      post(`${window.wzNetUrl}/menu/menuButtonTree`).then((resp) => {
        let { data } = resp;
        store.commit('setMenuButtonAuthTree', data);
        resolve();
      });
    }
  });
};


/*================ 文件类型 end =============*/
/**
 * @description: 持续时间(秒)转换,如果超过24小时，则转换为“1天xx小时”；如果未超过24小时，转换为“xx小时xx分钟”；如果不足1小时，转换为“xx分钟
 * @param {*}
 * @return {*}
 */
export const dourationTransfer = (douration) => {
  if (typeof douration === 'number' && !isNaN(douration)) {
    let minute = 60;
    let hour = minute * 60;
    let day = hour * 24;
    if (douration < minute) {
      //小于一分钟
      return `${douration}秒`;
    } else if (douration >= minute && douration < hour) {
      //不足一小时
      return `${parseInt(douration / minute)}分钟${douration % minute}秒`;
    } else if (douration >= hour && douration < day) {
      //大于一不超过一天
      return (
        parseInt(douration / hour) +
        "小时" +
        parseInt((douration % hour) / minute) +
        "分钟"
      );
    } else {
      //超过24小时
      return (
        parseInt(douration / day) +
        "天" +
        parseInt((douration % day) / hour) +
        "小时"
      );
    }
  }
  return ''
};

/**
 * [commGetValByKey description]根据key获取对应的其他值信息
 * @param {array} arr [description] 数组
 * @param {string} key [description] 数组待取的的key属性
 * @param {string} resultType [description] 需要返回的val属性
 * @param {string} separator [description] 用于分隔的字符，arr不填
 */
export const extractByKey = function (arr, key, resultType = 'String', separator = ',') {
  let resultArr = [];
  arr.map(item => {
    if (item[key]) resultArr.push(item[key]);
  })
  if (resultType === 'Array') return resultArr;
  else if (resultType === 'String') return resultArr.join(separator)
  else throw new Error("resultType无效");
}

/**
 * @description: 判断运行环境是否是钉钉
 * @param {*}
 * @return {*}
 */
export function runtimeEnv() {
  const flag = window.navigator.userAgent.indexOf('DingTalk') > 0 && window.AlipayJSBridge !== undefined ? 'DingTalk' : 'NormalBrowser';
  return flag
}
/**
 * [numberValueFormatPravite description] 数字格式化
 * @param  {[type]} value [description] 数字值
 * @return {[type]}       [description]
 */
export function numberValueFormatPravite(value) {
  if (!isNaN(value)) {
    let countingUnit = "";
    value = Number(value);
    if (value >= 1e8) {
      value = parseInt((value / 1e8));
      countingUnit = "亿";
    } else if (value >= 1e4) {
      value = parseInt((value / 1e4));
      countingUnit = "万";
    } else {
      value = numberValueFormat(value);
    }
    return `${value}${countingUnit}`;
  } else {
    return 0
  }
}
/**
 * [numberValueFormat 将数字转化为‘,’号分割形式，如：1000000 转换为 1,000,000]
 *
 * @param   {[type]}  value  [value string,number....]
 *
 * @return  {[type]}         [return description]
 */
 function numberValueFormat(value) {
  let newValue = 0;
  if (value && value != "") {
    newValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    if (value == undefined || value == null) {
      newValue = 0;
    }
  }
  return newValue == "[object Object]" ? 0 : newValue;
}
/**
 * @description: 预览或下载 文件
 * @param {*} filePath
 * @return {*}
 */
export function previewFile(file) {
  var str = /\.(gif|jpg|jpeg|png|bmp|BMP|JPG|PNG|JPEG|pdf|mp4|wma|wav|avi|mp3|mov)$/;
  const filePath = `${process.env.NODE_ENV == "development" ? "/upload" : file.basePath
    }/${file.filePath}`;
  if (str.test("." + file.fileExt)) {
    //直接新窗口打开预览
    window.open(filePath, '_blank');
  } else {
    //下载
    let a = document.createElement("a");
    a.href = `${process.env.NODE_ENV == "development" ? "/upload" : file.basePath
      }/${file.filePath}`;
    a.download = file.srcfile;
    a.click();
  }
}
/*============== 地图相关function start =============*/
/**
 * 动态加载高德地图
 *
 * @export
 * @param {*} key 高德地图key
 * @param {*} plugins 高德地图插件
 * @param {string} [v='1.4.14'] 高德地图版本
 * @returns
 */
export const loadMap = (key, plugins, v = '1.4.14') => {
  return new Promise(function (resolve, reject) {
    if (typeof AMap !== 'undefined') {
      // eslint-disable-next-line no-undef
      resolve(AMap)
      return true
    }
    window.onCallback = function () {
      // eslint-disable-next-line no-undef
      resolve(AMap)
    }
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://webapi.amap.com/maps?v=${v}&key=${key}&plugin=${plugins}&callback=onCallback`
    script.onerror = reject
    document.head.appendChild(script)
  })
}
/*============== 地图相关function end =============*/
/**
 * [initCommYearOptions 年份下拉框数据]
 * @param   {[type]}  yearSpread  [item description]年份下拉数据从当前年份往前推几年
 * @return  {[type]}  [return description]
 */
export const initCommYearOptions = (yearSpread) => {
  let yearOptions = [];
  yearOptions.push({
    name: dayjs(new Date()).format("YYYY"),
    value: dayjs(new Date()).format("YYYY"),
    date: new Date(),
  });
  for (let i = 0; i < yearSpread; i++) {
    yearOptions.push({
      name: dayjs(new Date())
        .subtract(i + 1, "year")
        .format("YYYY"),
      value: dayjs(new Date())
        .subtract(i + 1, "year")
        .format("YYYY"),
      date: dayjs(new Date())
        .subtract(i + 1, "year")
        .toDate(),
    });
  }
  return yearOptions;
};

/**
 * @description: 根据域名返回智控地址前缀
 * @param {*}
 * @return {*}
 */
export function getInfoByCurDocumentDomain() {
  const domain = document.domain.indexOf('szt.wenzhou.gov.cn') > -1 ? 'https://yqzk.wxb.zj.gov.cn' : 'http://web.trshz.com:10002';//包含szt.wenzhou.gov.cn的则为正式环境
  return domain;
}
/**
 * @descripttion: 上级下发，跳转详情页
 * @param {*} flag  backUrl是地址，其他的是参数，parameter是前端智控项目中的路由地址
 * @return {*} 
 */
export const openShengbanzhikongOperation = async (flag = true) => {
  const { code, data } = await get(`${window.wzNetUrl}/zkSSO/getZkToken`);
  if (code == 200) {
    let url =
      data.backUrl +
      "?token=" +
      data.token +
      "&appKey=" +
      data.appKey +
      "&timestamp=" +
      data.timestamp +
      "&sign=" +
      data.sign;
    return flag ? url + '&parameter=' : url
  }
}

