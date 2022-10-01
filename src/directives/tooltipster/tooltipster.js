import { nextTick } from 'vue';
import $ from 'jquery';
import '../../../public/tooltipster/dist/js/tooltipster.bundle.js';
import '../../../public/tooltipster/dist/css/tooltipster.bundle.min.css';
import { dealwithContent } from '@/service/commonService.js';

const tooltip = {
  created(el, binding, vnode) {
    nextTick(() => {
      let $el = $(el);
      let trigger = $el.attr('trigger');
      let title = $el.attr('title');
      let zIndex = $el.attr('zIndex');
      let single = $el.attr('single') == 'false' ? false : true;
      let stop = $el.attr('stop') == 'false' ? false : true;
      let functionPositionName = $el.attr('functionposition');
      let functionPosition = self[functionPositionName];
      functionPosition =
        typeof functionPosition == 'function'
          ? functionPosition
          : (instance, helper, position) => {
            position.coord.left =
              position.coord.left === 0 ? 90 : position.coord.left; //如果左边距为0，改为90
            if (position.size.height > 400 && position.side == 'top') {
              position.coord.top =
                position.coord.top + (position.size.height - 400);
              position.size.height = 400;
            }
            return position;
          };
      trigger = trigger ? trigger : 'hover';
      let template = $el.attr('template') == 'true';
      let $template;
      let side = $el.attr('side');
      let theme = $el.attr('theme') ? $el.attr('theme') : '';
      side = side ? side : 'bottom';
      let maxWidth = $el.attr('maxWidth')
        ? $el.attr('maxWidth')
        : window.innerWidth / 2;//window.innerWidth - 200;
      let options = {
        theme: `custom_theme ${theme}`,
        contentCloning: false,
        contentAsHTML: true,
        side: side,
        maxWidth: maxWidth, //window.innerWidth - 300,//最大宽度
        zIndex: isNaN(zIndex) ? 100 : zIndex,
        interactive: true,
        trigger: 'custom',
        triggerOpen: {
          [trigger == 'hover' ? 'mouseenter' : trigger]: true,
        },
        triggerClose: {
          [trigger == 'hover' ? 'mouseleave' : trigger]: true,
        },
        functionPosition: (instance, helper, position) => {
          return functionPosition(instance, helper, position);
        },
      };
      if (!template) {
        if (title) {
          options.content = dealwithContent(title); //替换标签处理
        } else {
          options.content = $el[0].innerHTML;
        }
        if (!options.content) {
          //没有内容时不展示tip
          return;
        }
      } else {
        $template = $el.find('.tooltip_templates>*').eq(0);
        let random = Math.round(Math.random() * 10000);
        let newId = $template.attr('id')
          ? `#${$template.attr('id')}`
          : '#tooltip_' + random;
        $el.attr('data-tooltip-content', newId);
        $template.attr('id', newId.replace(/#/, ''));
      }
      $el.tooltipster(options);
      let instance = $el.tooltipster('instance');
      let dataVvalue = (() => {
        let data = $el.data();
        for (let i in data) {
          if (i.match(/v-/)) {
            return `data-${i}`;
          }
        }
      })();
      if ($template) {
        instance.on('position', (e) => {
          let $containers = $template.parents();
          $containers.attr(dataVvalue, '');
          let $tooltipsterArrow = $containers.last().find('.tooltipster-arrow');
          $tooltipsterArrow.attr(dataVvalue, '');
          $tooltipsterArrow.children().attr(dataVvalue, '');
        });
      }
      if (stop) {
        instance.on('before', (e) => {
          let event = e.event.originalEvent;
          event.stopPropagation();
          if (single) {
            var instances = $.tooltipster.instances();

            instances.forEach((item) => {
              if (item == instance) return;
              if (item.__state == 'closed') return;
              item.close();
              //console.log(item.__state);
            });
          }
          title = $el.attr('title') ? $el.attr('title') : title;
          if (template) {
            //template更新慢bug处理预留位置
          } else if (title) {
            instance.content(dealwithContent(title));
            $el.attr('title', '');
          } else if (!title) {
            instance.content($el[0].innerHTML);
          }
        });
        instance.on('close', (e) => {
          e.stopPropagation();
        });
      }
    });
  },
  unmounted(el) {
    let $el = $(el);
    if ($el.className) {
      //没有内容时不展示tip则没有instance，则不需要销毁
      let instance = $el.tooltipster('instance');
      instance.destroy();
    }
  },
};

const closeTooltip = (id) => {
  id = id ? id : $(this.$el).attr('id');
  let selector = `*[data-tooltip-content='#${id}']`;
  let $triggerPoint = $(selector);
  let instance = $triggerPoint.tooltipster('instance');
  instance.close();
};

// export {
//     tooltip,
//     closeTooltip,
// };
export default {
  install(app) {
    app.directive('tooltip', tooltip);
    app.config.globalProperties.closeTooltip = closeTooltip;
  },
};
