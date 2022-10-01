/*
 * @Descripttion: 
 * @version: 
 * @Author: flj
 * @Date: 2021-03-23 07:43:24
 * @LastEditors: flj
 */
import { createApp } from 'vue';
async function $msg({
    type,
    content,
    time,
    callback,
    errorsMsg
}) {
    let ToastComponent = () =>
        import('./toast.vue');
    ToastComponent = await ToastComponent();
    let app;
    let toastContainer
    const id = `toast_container_${Math.round(Math.random() * 1e6)}`
    const Toast = ToastComponent.default;
    const propsData = {
        type,
        msg: content,
        time,
        errorsMsg: errorsMsg,
        callback() {
            app.unmount()
            document.body.removeChild(toastContainer)
            if (typeof callback === "function") {
                callback()
            }
        }
    }
    app = createApp(Toast, propsData)
    toastContainer = document.createElement('div')
    toastContainer.setAttribute("id", id)
    toastContainer.style = "position:absolute;left:0;top:0;"
    document.body.appendChild(toastContainer)
    app.mount(toastContainer)
}
export default $msg;