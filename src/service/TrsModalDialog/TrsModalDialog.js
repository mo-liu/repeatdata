import { createApp } from 'vue';
import router from '@/router';
import store from '@/store';
// import validation from '@/service/validation/index.js'; // 表单校验
import toastSingleton from '@/service/toast/toast.js'; //toast提示
import commonComponents from '@/components/index.js'; // 全局组件
import $ from 'jquery/dist/jquery.slim.min.js';
import './TrsModalDialog.less';
import sortSwitch from '@/directives/sortSwitch/sortSwitch.js'; //v-sortSwitch
// import init from '@/directives/v-init';
import disabled from '@/directives/v-disabled';
import tooltip from '@/directives/tooltipster/tooltipster';
import minimizeCardComponent from './TrsMinimizeCard.vue';
const modalContainer = {}; //用于存放弹窗
/**
 * [generateId description] 生成Id
 * @return {[type]} [description]
 */
function generateId() {
  return `modalContainer_${Math.round(Math.random() * 1e8)}`;
}
/**
 * [buildContainer description] 创建容器
 * @param  {[type]} modalContainerId [description] 容器id
 * @return {[type]}                  [description]
 */
function buildContainer(modalContainerId) {
  let $div = $('<div/>');
  $('body').append($div);
  $div.attr({
    class: 'trs_modal_dialog_container',
    id: modalContainerId,
  });
  setTimeout(() => {
    $div.css({
      opacity: 1,
    });
  });
  return $div;
}
/**
 * [resumeScrolling description] 恢复页面滚动
 * @return {[type]} [description]
 */
function resumeScrolling() {
  if ($('.trs_modal_dialog_container').length === 0) {
    $('html').css({
      overflow: '',
    });
  }
}
/**
 * [initMinimizeCardComponent description] 初始化最小化标题卡组件
 * @param {object} [self] [description] 父实例
 * @param {String} [title] [description] 卡片标题
 * @param {object} [$publicModalContainers] [description] 卡片容器
 * @return {[type]} [description]
 */
function initMinimizeCardComponent(self, title, $publicModalContainers) {
  let Component = Vue.extend(minimizeCardComponent); // 组件挂入Vue
  let node = document.createElement('div');
  $publicModalContainers.append(node);
  let minimizeCard = new Component({
    // 组件实例化
    el: node,
    parent: self,
    propsData: {
      title: title,
    },
  });
  return minimizeCard;
}
/**
 * [loadComponent description] 初始化加载组件
 * @param  {[type]} Component [description] 传入组件
 * @return {[type]}           [description]
 */
function loadComponent(Component) {
  if (typeof Component === 'function') {
    return new Promise((resolve) => {
      Component().then((resp) => {
        resolve(resp.default);
      });
    });
  } else {
    return Promise.resolve(Component);
  }
}
/**
 * [publicModal description] 公用弹窗方法
 * @param  {[type]} Component [description]
 * @param  {[type]} props     [description]
 * @return {[type]}           [description]
 */
export async function trsModalDialog(Component, props) {
  const destroyes = [];
  Component = await loadComponent(Component);
  return new Promise((resolve, reject) => {
    let modalDialog; // 弹窗的组件实例变量声明
    let modalContainerId = generateId(); // 生成唯一标识
    let minimizeCard; // 最小化卡片实例
    let node = document.createElement('div'); // 创建组件dom容器
    modalContainer[modalContainerId] = buildContainer(modalContainerId); // 创建弹窗容器
    $(modalContainer[modalContainerId]).css('display', 'flex'); // 为弹窗指定布局方式
    $(modalContainer[modalContainerId]).append(node); // 将组件dom放入弹窗容器
    /**
     * [keyClose description] 键盘关闭事件
     * @param  {[type]} e [description] 事件
     * @return {[type]}   [description]
     */
    function keyClose(e) {
      if (e.keyCode !== 27) {
        return; // 非esc键，不执行下面函数
      }
      if (modalContainer[modalContainerId].hasClass('minimize')) return; // 如果处于最小化状态，则不允许esc关闭
      let $publicModalContainers = $(
        '.trs_modal_dialog_container:not(.minimize)'
      ); // 找到所有非minimize得弹窗
      if (
        $publicModalContainers[$publicModalContainers.length - 1] !==
        modalContainer[modalContainerId][0]
      ) {
        return; // 如果当前弹窗不是最后一个打开的弹窗，不执行下面函数
      }
      cancel();
    }
    /**
     * [minimizePosition description] 最小化弹窗定位
     * @return {[type]} [description]
     */
    function minimizePosition() {
      let $modalContainer = self[modalContainerId]; // 获取到当前的弹窗容器
      let $minimizePublicModalContainers = $(
        '.trs_modal_dialog_container.minimize'
      ); // 获取已有的最小化弹窗集合
      let minimizeHeight = 40; // 设置最小化弹窗的高度
      let minimizeWidth = 200; // 设置最小化弹窗的宽度
      let orgMinimizeLeft = $modalContainer.attr('orgMinimizeLeft'); // 获取原始的最小化卡片占为
      let left = $minimizePublicModalContainers.length * minimizeWidth; // 最小化弹窗的左边距
      let css = {
        // 设置最小化弹窗的样式
        width: `${minimizeWidth}px`,
        height: `${minimizeHeight}px`,
        top: `${$(document).scrollTop() +
          window.innerHeight -
          minimizeHeight}px`,
        left: orgMinimizeLeft || `${left}px`,
      };
      if ($modalContainer.hasClass('minimize')) {
        // 如果当前弹窗已经最小化，则不需要再设置宽高和左边距
        delete css.width;
        delete css.height;
        delete css.left;
      }
      $modalContainer.addClass('minimize'); // 为当前弹窗加上最小化类
      $modalContainer.css(css);
    }
    /**
     * [restoreSize description] 弹窗恢复正常大小
     * @param  {[type]} e [description] 点击事件
     * @return {[type]}   [description]
     */
    function restoreSize(e) {
      let $modalContainer = self[modalContainerId]; // 获取到当前的弹窗容器
      window.removeEventListener('scroll', minimizePosition); // 滚动事件绑定定位
      window.removeEventListener('resize', minimizePosition); // resize事件绑定定位
      // minimizeCardScaleWatcher() //最小化弹窗的销毁纵向缩放监控
      $modalContainer.attr('orgMinimizeLeft', $modalContainer.css('left')); // 记录第一次最小化占位
      // scaleYModeAdaptation(modalContainerId) //纵轴缩放模式适配
      $modalContainer.removeClass('minimize');
      $('html').css({
        // 禁止页面滚动条出现
        overflow: 'hidden',
      });
    }
    /**
     * [minimize description] 最小化
     * @return {[type]} [description]
     */
    function minimize() {
      minimizePosition(); // 定位
      let flag = true; // 标识，是否当前界面上还有其他正常弹窗
      let $publicModalContainers = $('.trs_modal_dialog_container'); // 获取所有弹窗容器
      if (!minimizeCard) {
        minimizeCard = initMinimizeCardComponent(
          self,
          $publicModalContainers
            .find('.header span')
            .eq(0)
            .text(),
          $publicModalContainers
        ); // 初始化最小化卡片组件，并获取它的实例
        minimizeCard.restoreSize = restoreSize; // 为最小化弹窗绑定还原事件
      }
      window.addEventListener('scroll', minimizePosition); // 滚动事件绑定定位
      window.addEventListener('resize', minimizePosition); // resize事件绑定定位
      // minimizeCardScaleWatcher = self.$watch('$store.state.scaleY', (newV, oldV) => { //监控有没有切换大屏纵向缩放模式，重新定位
      //     if (newV == oldV) return
      //     minimizePosition()
      // })
      $publicModalContainers.each(function() {
        let $modal = $(this);
        if (!$modal.hasClass('minimize')) {
          // 如果还有一个正常弹窗存在，就不能恢复当前滚动条
          flag = false;
        }
      });
      if (flag) {
        $('html').css({
          // 弹窗已经最小化，恢复弹窗
          overflow: '',
        });
      }
    }
    /**
     * [getMinimizeCard description] 获取最小化卡片实例
     * @return {[type]} [description]
     */
    function getMinimizeCard() {
      return minimizeCard;
    }
    /**
     * [bindDragMove description] 绑定拖动窗口位置功能
     * @return {[type]} [description]
     */
    function bindDragMove() {
      let modal = modalDialog._container;
      let $modal = $(modal);
      let mousedown = false;
      let orgMouseX,
        orgMouseY,
        modalX,
        modalY,
        minDiffY,
        maxDiffY,
        minDiffX,
        maxDiffX;
      let header = modal.querySelector('.header');
      if (!header) return;
      header.addEventListener('mousedown', mousedownFn);

      function mousedownFn(e) {
        $('body').css({
          cursor: 'all-scroll',
          'user-select': 'none',
          '-webkit-user-select': 'none',
          '-o-user-select': 'none',
          '-moz-user-select': 'none',
        });
        orgMouseX = e.x;
        orgMouseY = e.y;
        try {
          modalX = $modal.css('left').replace(/px/g, '');
          modalY = $modal.css('top').replace(/px/g, '');
        } catch (e) {
          modalX = 0;
          modalY = 0;
        }
        if (isNaN(modalX)) {
          modalX = 0;
        }
        if (isNaN(modalY)) {
          modalY = 0;
        }
        modalX = Number(modalX);
        modalY = Number(modalY);
        let modalWidth = $modal.width();
        let modalHeight = $modal.height();
        let $modalContainer = $modal.parents().eq(0);
        let modalContainerWidth = $modalContainer.width();
        let modalContainerHeight = $modalContainer.height();
        minDiffY = -modal.offsetTop;
        maxDiffY =
          modalContainerHeight -
          (modal.offsetTop + modalHeight) +
          modalHeight / 2;
        minDiffX = -modal.offsetLeft - modalWidth / 2;
        maxDiffX =
          modalContainerWidth -
          (modal.offsetLeft + modalWidth) +
          modalWidth / 2;
        mousedown = true;
      }
      window.addEventListener('mouseup', mouseupFn);

      function mouseupFn(e) {
        $('body').css({
          cursor: '',
          'user-select': '',
          '-webkit-user-select': '',
          '-o-user-select': '',
          '-moz-user-select': '',
        });
        mousedown = false;
      }
      window.addEventListener('mousemove', mousemoveFn);

      function mousemoveFn(e) {
        if (!mousedown) return;
        let diffX = e.x - orgMouseX;
        let diffY = e.y - orgMouseY;

        let left = modalX + diffX;
        let top = modalY + diffY;
        if (diffY < minDiffY) {
          top = modalY + minDiffY;
        }
        if (diffY > maxDiffY) {
          top = modalY + maxDiffY;
        }
        if (diffX < minDiffX) {
          left = modalX + minDiffX;
        }
        if (diffX > maxDiffX) {
          left = modalX + maxDiffX;
        }
        $modal.css({
          left: `${left}px`,
          top: `${top}px`,
        });
      }

      function destroyed() {
        window.removeEventListener('mouseup', mouseupFn);
        window.removeEventListener('mousemove', mousemoveFn);
      }
      destroyes.push(destroyed);
    }
    /**
     * [cancel description] 取消函数
     * @param  {[type]} data [description] 返回数据
     * @return {[type]}      [description]
     */
    function cancel(data) {
      window.removeEventListener('keydown', keyClose); // 取消全局键盘事件
      setTimeout(() => {
        $(modalDialog._container).remove(); // 从页面上删除组件dom
        modalDialog.unmount(); // 销毁组件实例
        self[modalContainerId].remove(); // 销毁弹窗容器
        resumeScrolling(); // 恢复页面滚动
        destroyFns();
        reject(data);
      }, 200);
    }
    /**
     * [confirm description] 确认函数
     * @param  {[type]} data [description] 返回数据
     * @return {[type]}      [description]
     */
    function confirm(data) {
      // 创建确认方法
      window.removeEventListener('keydown', keyClose); // 取消全局键盘关闭事件
      setTimeout(() => {
        $(modalDialog._container).remove(); // 从页面上删除组件dom
        modalDialog.unmount(); // 销毁组件实例
        self[modalContainerId].remove(); // 销毁弹窗容器
        resumeScrolling(); // 恢复页面滚动
        destroyFns();
        resolve(data);
      }, 200);
    }

    function destroyFns() {
      destroyes.forEach((fn) => {
        fn();
      });
    }
    props = typeof props === 'object' ? props : {};
    props.modalConfirm = confirm;
    props.modalCancel = cancel;
    const app = createApp(Component, props);
    // app.directive('init', init);
    modalDialog = app
      .use(store)
      // .use(validation)
      .use(sortSwitch)
      .use(disabled)
      .use(tooltip)
      .use(commonComponents)
      .use(router); // 组件挂入Vue
    // modalDialog.config.globalProperties.get = get;
    // modalDialog.config.globalProperties.post = post;
    modalDialog.config.globalProperties.$msg = toastSingleton;
    modalDialog.mount(node);
    let buttons = $(modalDialog.$el).find('.footer button'); // 为弹窗组件内的按钮加入样式（可优化，用纯cssflex布局实现）
    if (buttons.length === 1) {
      buttons.eq(0).addClass('single');
    }
    $('html').css({
      // 禁止页面滚动条出现
      overflow: 'hidden',
    });
    // scaleYModeAdaptation(modalContainerId) //纵轴缩放模式适配
    window.addEventListener('keydown', keyClose); // 全局绑定键盘事件
    // initWatchScaleY(self, modalContainerId) //初始化监听scaleY
    bindDragMove(); // 绑定拖动窗口位置功能
  });
}
