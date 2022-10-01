/*
 * @Author: li.shaowei
 * @Date: 2021-03-03 16:55:04
 * @Description: In User Settings Edit
 */
import Vue from "vue";
import $ from "jquery";
import "../../public/tooltipster/dist/js/tooltipster.bundle.js";
import "../../public/tooltipster/dist/css/tooltipster.bundle.min.css";
// import "./tooltipster/dayMode.less";
// import "./tooltipster/nightMode.less";
const disabled = {
  mounted(el, binding) {
    disabledFunc(el, binding);
  },
  updated(el, binding) {
    disabledFunc(el, binding);
  },
  unmounted(el) {
    //解绑时，销毁残留style元素
    let $el = $(el);
    let disabledId = $el.attr("disabledid");
    $(`#style_${disabledId}`).remove();
  }
};

/**
 * [disabledFunc 禁用方法]
 * @param  {[type]} el      [el dom元素]
 * @param  {[type]} binding [绑定值]
 * @return {[type]}         [description]
 */
function disabledFunc(el, binding) {
  let $el = $(el),
    disabledTip = $el.attr("disabledtip"), //需要提示的语句
    tipZIndex = $el.attr("tipZIndex"), //tooltip的显示层级
    tipSide = $el.attr("tipSide"), //tooltip的默认显示防线
    trigger = $el.attr("trigger"),
    tooltipInstance, //toolTip进程
    disabledId = $el.attr("disabledid")
      ? $el.attr("disabledid")
      : `disabledId_${Math.round(Math.random() * 1e6)}`, //为按钮或点击模块分配的唯一标识
    //设置禁止点击div
    $disabledDiv = $(`<div id="disabledDiv_${disabledId}"></div>`)
      .click(e => {
        e.stopPropagation();
      })
      .mousedown(e => {
        e.stopPropagation();
      }),
    disabledStyle = `
                <style id="style_${disabledId}">
                    *[disabledid='${disabledId}']{
                        position:relative;
                    }
                    #disabledDiv_${disabledId}{
                        content:' ';
                        position:absolute;
                        width:calc(100% + 2px);
                        height:calc(100% + 2px);
                        left:0px;
                        top:0px;
                        margin-left:-1px;
                        margin-top:-1px;
                        cursor:not-allowed;
                        opacity:0.3;
                    }
                </style>
            `;
  disabledTip = disabledTip ? disabledTip : "抱歉，无法点击"; //默认显示的提示语句
  tipSide = tipSide ? tipSide : "top"; //默认向顶部浮出
  let theme = $el.attr('theme') ? $el.attr('theme') : '';//主题样式
  $el.attr("disabledid", disabledId); //将唯一标识赋给点击将点击的节点
  $el.removeClass("disabled");
  try {
    tooltipInstance = $el.tooltipster("instance"); //获取tooltip进程
    tooltipInstance.content(disabledTip);
  } catch (e) { }
  if (binding.value) {
    if (!tooltipInstance) {
      if ($(`style_${disabledId}`).length == 0) {
        $("head").append(disabledStyle);
        $el.append($disabledDiv);
      }
      let options = {
        theme: theme ? "custom_theme " + theme : "custom_theme",
        contentCloning: false,
        contentAsHTML: true,
        side: tipSide,
        maxWidth: window.innerWidth - 100,
        zIndex: isNaN(tipZIndex) ? 99 : tipZIndex,
        interactive: true,
        trigger: trigger ? trigger : "hover",
        content: disabledTip
      };
      tooltipInstance = $el.tooltipster(options);
    }
    $el.addClass("disabled");
  } else if (!binding.value && tooltipInstance) {
    tooltipInstance.destroy();
    $(`#style_${disabledId}`).remove();
    $(`#disabledDiv_${disabledId}`).remove();
    $el.removeAttr("disabledid");
  }
}

export default {
  install(app) {
    app.directive("disabled", disabled);
  }
};
