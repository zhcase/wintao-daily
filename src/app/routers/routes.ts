/*
 * @Author: zeHua
 * @Date: 2022-06-21 11:15:09
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-27 13:53:56
 * @FilePath: \sticky-notes\src\app\routers\routes.ts
 */
import { RouteRecordRaw } from "vue-router";
import Home from '@pages/Home'
import Tip from "@pages/Tip";
import Setting from "@pages/Setting";
import Clock from "@pages/clock"

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Home
    }, {
        path: "/tip",
        component: Tip
    }, {
        path: "/setting",
        component: Setting,
    }, {
        path: "/clock",
        component: Clock,
    }
    
];

export default routes;
