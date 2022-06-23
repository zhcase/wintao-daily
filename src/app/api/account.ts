/*
 * @Author: zeHua
 * @Date: 2022-06-23 18:49:10
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-23 19:05:19
 * @FilePath: \sticky-notes\src\app\api\account.ts
 */
import request from "../utils/request";

export class Account {

    public static Login(data){
        // let data = {
    //   username: userName,
    //   password: password,
    // };
    return request({ url: "http://192.168.0.83:5000/login", method: "post", data });
    }

    public static Proxy(data){
        // let data = {
    //   username: userName,
    //   password: password,
    // };
    return request({ url: "http://192.168.0.83:5000/proxy", method: "post", data });
    }

}