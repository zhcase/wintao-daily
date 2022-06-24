/*
 * @Author: zeHua
 * @Date: 2022-06-23 18:49:10
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-24 15:49:28
 * @FilePath: \sticky-notes\src\app\api\account.ts
 */
import request from "../utils/request";
const apiUrl="http://192.168.0.245:5000"
export class Account {

    public static Login(data){
        // let data = {
    //   username: userName,
    //   password: password,
    // };
    return request({ url:apiUrl+"/login", method: "post", data });
    }

    public static Proxy(data){
        // let data = {
    //   username: userName,
    //   password: password,
    // };
    return request({ url: apiUrl+"/proxy", method: "post", data });
    }

}