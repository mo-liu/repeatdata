/*
 * @Descripttion: 
 * @version: 
 * @Author: flj
 * @Date: 2021-03-23 07:43:24
 * @LastEditors: flj
 */
import { createApp } from "vue"
async function $ask({
    type,
    content,
    detail,
    confirm,
    cancel,
}) {
    let askComponent = () =>
        import('./ask.vue');
    askComponent = await askComponent();
    let app;
    const Ask = askComponent.default;
    const id = `ask_container_${Math.round(Math.random() * 1e6)}`
    let askContainer;
    const propsData = {
        type,
        content,
        detail,
        confirm() {
            app.unmount()
            if (typeof confirm === "function") {
                document.body.removeChild(askContainer)
                confirm()
            }
        },
        cancel() {
            app.unmount()
            if (typeof cancel === "function") {
                document.body.removeChild(askContainer)
                cancel()
            }
        }
    }
    app = createApp(Ask, propsData)
    askContainer = document.createElement('div')
    askContainer.setAttribute("id", id)
    askContainer.style = "position:absolute;left:0;top:0;"
    document.body.appendChild(askContainer)
    app.mount(askContainer)
}
export default $ask;