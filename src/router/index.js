/*
 * @Descripttion: 
 * @version: 
 * @Author: mqq
 * @Date: 2022-09-10 19:32:39
 * @LastEditors: mqq
 */
import {
    createRouter,
    createWebHistory
} from 'vue-router';
const routes = [
    // {
    //     path: '/',
    //     redirect: '/',
    // },
    {
        path: '/:catchAll(.*)',
        redirect: '/',
    },
    {
        path: "/",
        name: "",
        component: () => import("../view/engineering/engineering.vue"),
    },
    {
        path: '/detailsPage', //详情页
        name: 'detailsPage',
        component: () => import('../view/detailsPage/detailsPage.vue')
    },
];
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})
export default router