/*
 * @Author: zeHua
 * @Date: 2022-06-21 11:15:09
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-23 22:22:42
 * @FilePath: /wintao/wintao-daily/src/app/main.ts
 */
import { createApp } from 'vue'
import App from './pages/App'
import './index.less'
import '@/common/load'
import './render'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import router from './routers'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App);

app.config.globalProperties.sessionId=localStorage.getItem('sessionId')

app.use(ElementPlus, {
    locale: zhCn,
  })
app.use(router);
app.mount('#app');
