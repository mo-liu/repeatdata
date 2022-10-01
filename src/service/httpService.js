/*
 * @Descripttion: 
 * @version: 
 * @Author: mqq
 * @Date: 2022-09-11 20:43:18
 * @LastEditors: mqq
 */
import axios from "axios";
import qs from "qs"
import $msg from '@/service/toast/toast';
const tasksQueue = new Map();
const CancelToken = axios.CancelToken;


function post(
    url,
    params,
    forbidden = false,
    applicationJson = false,
    timeout = 30000
) {
    let self = this;
    return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: url,
                data: params,
                timeout: timeout,
                headers: {
                    'Content-Type': applicationJson ?
                        'application/json' : 'application/x-www-form-urlencoded',
                },
                transformRequest: [
                    function (data) {
                        data = applicationJson ?
                            JSON.stringify(params) :
                            qs.stringify(data);
                        return data;
                    },
                ],
                cancelToken: cancelRequest(url),
            }).then(
                (response) => {
                    handleResponse.call(self, response, resolve, reject, forbidden);
                },
                (err) => {
                    if (typeof err === 'object' && err.message.type === 'cancel') {
                        console.log(`${err.message.msg},${url}请求已取消`);
                    } else {
                        $msg({
                            type: 'toast',
                            content: '连接失败，请检查网络',
                            time: 1500,
                        });
                    }
                    reject(err);
                }
            );
        },
    );
}

function get(url, params, forbidden) {
    let self = this;
    return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: url,
                params: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                cancelToken: cancelRequest(url),
            }).then(
                (response) => {
                    handleResponse.call(self, response, resolve, reject, forbidden);
                },
                (err) => {
                    if (typeof err === 'object' && err.message.type === 'cancel') {
                        console.log(`${err.message.msg},${url}请求已取消`);
                    } else {
                        $msg({
                            type: 'toast',
                            content: '连接失败，请检查网络',
                            time: 1500,
                        });
                    }
                    reject(err);
                }
            );
        },
        (response) => {
            handleResponse.call(self, response, resolve, reject, forbidden);
        }
    );
}

async function handleResponse(response, resolve, reject, forbidden) {
    if (response.data.status == 'nologin') {
        // let store = () => import('@/store/index.js')
        // store = await store()
        // const {
        //     state
        // } = store.default
        /* if (state.runtimeEnv === 'DingTalk') {
          ddAutoLogin();
        } else { */
        // window.location.replace(`${process.env.NODE_ENV == 'development' ? '/wzNetDigitalManage/login' : '/ids/admin/login.jsp'}?beforeLoginTargetUrl=${window.location.href}`);
        /* } */
        // reject(response.data);
    } else if (response.data.code === undefined) {
        //在返回值没有code的情况下直接resolve
        resolve(response.data);
    } else if (response.data.code != 200) {
        //错误或者警告信息
        reject(response.data);
        if (!forbidden) {
            $msg({
                type: response.data.code ? response.data.code : 'toast',
                content: response.data.message,
                time: 2000,
            });
        }
    } else {
        resolve(response.data);
    }
}

/**
 * [cancelRequest description] 组件销毁时取消请求
 * @return {[type]} [description]
 */
function cancelRequest(url) {
    let source = CancelToken.source();
    /**
     * [doCancel description] 执行取消
     * @return {[type]} [description]
     */
    function doCancel() {
        source.cancel({
            type: 'cancel',
            msg: '组件销毁，取消请求'
        });
    }

    const tasks = tasksQueue.get(url) || [];
    tasks.push(doCancel);
    tasksQueue.set(url, tasks);
    return source.token;
}

export default function useHttp() {
    return {
        get,
        post,
    };
}