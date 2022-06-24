/*
 * @Author: zeHua
 * @Date: 2021-11-04 13:33:27
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-24 17:49:11
 * @FilePath: \sticky-notes\src\app\utils\request.ts
 */
import axios from "axios";
// import QS from 'qs';
/* tslint:disable  */
import { login } from '../utils/account'
import { ElMessage } from 'element-plus'
import { useMessage } from 'naive-ui'
const message = useMessage()

axios.defaults.baseURL = "/";


axios.interceptors.request.use(
  (config) => {
    //  请求头
    // if (token) {
    //   const mytoken = JSON.parse(token);
    //   document.cookie = "tktoken=" + mytoken.token;
    //   config.headers.common.Authorization = "4bD8NVALX3Kq9qRKgS8SoZjflAkZF1Zp5/IH8Ykam42QGyB/e5233hBuswqBrDwJ"; // 让每个请求携带token ['X-Token'] 为自定义key
    // }

    return config;
  },
  (error) => {
    // Do something with request error
    // console.log(error) // for
    return Promise.reject(error);
  }
);

// respone interceptor
// let that = this;
// let flag = true;
/* tslint:disable  */
axios.interceptors.response.use(
  (response) => {
    // loading.hide(response.config);
    const res = response.data; 
    console.log(res);
     
    console.log(res.code);
          
    if (res.code == 200) {
      return res;
    }else if(res.code==403){
        // console.log(44477887788);
        
        // alert(1)
        login();

     
    }else if(res.code==500){
      ElMessage.error({message:res.message,center: true      })

    }
  },
  (error) => {
    // loading.hide(error.config);
    if (error.response && error.status === 401) {
      // removeToken();
      // that.$message(error.msg);
      // if (error.config.url.indexOf("layout") === -1) {
      //     // message.error("登录信息已过期，请重新登录！");
      // }
    } else if (error.response && error.response.status === 500) {
      

      return Promise.reject(error);
    } else if (error.message && error.message.indexOf("timeout") > -1) {
      //   message.error("网络超时!");
    } else if (error === "403") {
      //   message.error("没有请求权限!");
    } else {
      //   message.error("网络错误!");
    }
    Promise.reject(error);
  }
);
export default axios;
