/*
 * @Author: zeHua
 * @Date: 2022-06-21 11:15:09
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-22 15:57:06
 * @FilePath: \sticky-notes\src\app\main.ts
 */
import { createApp } from 'vue'
import App from './pages/App'
import './index.less'
import '@/common/load'
import './render'
import router from './routers'

const app = createApp(App);
app.config.globalProperties.sessionId=localStorage.getItem('sessionId')
app.use(router);
app.mount('#app');
