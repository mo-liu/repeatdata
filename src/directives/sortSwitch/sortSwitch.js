/*
 * @Author: Qian.qianchen
 * @Date: 2021-03-22 11:17:35
 * @LastEditors: flj
 * @Description: 顺逆序排序
 * @FilePath: /cs-data-reporting/src/directives/sortSwitch/sortSwitch.js
 */
const sortSwitch = {
  beforeMount(el, binding) {
    const $el = $(el);
    let $span = $(`<span class="sort_inner"></span>`);
    let topTriangle = $(`<span class="topTriangle"></span>`);
    let bottomTriangle = $(`<span class="bottomTriangle"></span>`);
    $span.append(topTriangle);
    $span.append(bottomTriangle);
    $el.append($span);
  },
  mounted(el, binding) {
    const $el = $(el);
    const $belongsTable = $(el).parents('table');
    let tableId;
    if ($belongsTable.attr('tableid')) {
      tableId = $belongsTable.attr('tableid');
    } else {
      tableId = Math.round(Math.random() * 1e8);
      $belongsTable.attr('tableid', tableId);
    }
    const sortScope = $el.attr('sort-scope');
    const sortAttr = $el.attr('sort-attr');
    const sortColspan = $el.attr('sort-colspan');
    const isHighlight = $el.attr('is-highlight') ? JSON.parse($el.attr('is-highlight')) : true;
    const initDirection = $el.attr('init-direction');
    if (sortScope === sortAttr && isHighlight) {
      setColumnStyle($el.parents('th'), tableId, sortColspan);
    }
    //初始化默认的选中方式desc/asc，有则选中
    if (initDirection) {
      el.setAttribute('direction', initDirection);
    }
    el.onclick = function () {
      let direction = el.getAttribute('direction') ?
        el.getAttribute('direction') :
        '';
      let _scope = el.getAttribute('sort-scope');
      if (_scope != el.getAttribute('sort-attr') && _scope != null) {
        direction = '';
      }
      direction == 'asc' && direction != '' ?
        el.setAttribute('direction', 'desc') :
        el.setAttribute('direction', 'asc');
      if (direction == '') el.setAttribute('direction', 'desc');
      binding.value(el.getAttribute('direction'), el.getAttribute('sort-attr'));
    };
  },
  updated(el) {
    const $el = $(el);
    const $belongsTable = $(el).parents('table');
    const sortScope = $el.attr('sort-scope');
    const sortAttr = $el.attr('sort-attr');
    const sortColspan = $el.attr('sort-colspan');
    const isHighlight = $el.attr('is-highlight') ? JSON.parse($el.attr('is-highlight')) : true;
    if (sortScope === sortAttr && isHighlight) {
      const $style = $(`#style_${tableId}`);
      let tableId = $belongsTable.attr('tableid');
      if ($style.length > 0) {
        $style.remove();
      }
      setColumnStyle($el.parents('th'), tableId, sortColspan);
    }
  },
  beforeUnmount(el) {
    const $belongsTable = $(el).parents('table');
    let tableId;
    if ($belongsTable.attr('tableid')) {
      tableId = $belongsTable.attr('tableid');
    } else {
      tableId = Math.round(Math.random() * 1e8);
      $belongsTable.attr('tableid', tableId);
    }
    const $style = $(`#style_${tableId}`);
    if ($style.length > 0) {
      $style.remove();
    }
  },
};
/**
 * @description: 设置列样式
 * @param {*}
 * @return {*}
 */
function setColumnStyle($th, tableId, colspan) {
  const index = $th.index();
  const styleId = `style_${tableId}`;
  let $style = $(`#${styleId}`);
  let offset = index + 1;
  if ($style.length == 0) {
    $style = $(`<style id="${styleId}"></style>`);
  }

  let styleText = `
    table[tableid="${tableId}"] tr:nth-child(1) th:nth-child(${index + 1}),
    table[tableid="${tableId}"] tr td:nth-child(${index + 1}){
     background-color:#EFF8FD !important;
    }
    table[tableid="${tableId}"] tr:nth-child(1) th:nth-child(${index + 1}){
      border-bottom-color: #EFF8FD !important;
    }
    table[tableid="${tableId}"] tr td:nth-child(${index + 1}){
      border-bottom-color: #EFF8FD !important;
    }
  `;
  if (colspan != undefined) {
    offset += parseInt(colspan);
    styleText = `
      table[tableid="${tableId}"] tr:nth-child(2) th:nth-child(${index + 1}),
      table[tableid="${tableId}"] tr td:nth-child(${offset}){
      background-color:#EFF8FD !important;
      }
      table[tableid="${tableId}"] tr:nth-child(2) th:nth-child(${index + 1}){
        border-bottom-color: #EFF8FD !important;
      }
      table[tableid="${tableId}"] tr td:nth-child(${offset}){
        border-bottom-color: #EFF8FD !important;
      }
    `;
  }
  $style.html(styleText);
  document.head.appendChild($style[0]);
}
export default {
  install(app) {
    app.directive('sortSwitch', sortSwitch);
  },
};