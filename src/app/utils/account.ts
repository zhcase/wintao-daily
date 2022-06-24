/*
 * @Author: zeHua
 * @Date: 2022-06-23 19:18:48
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-23 19:32:33
 * @FilePath: \sticky-notes\src\app\utils\account.ts
 */
import { Account } from "@/app/api/account";
import { useMessage } from 'naive-ui'


export async function login(){    
    const message = useMessage()
    interface user {
        useraccount:string,
        password:string
    }
    let user:any = localStorage.getItem("user");
    if(user){
        console.log(user);
        
        user=JSON.parse(user);
        let params = {
            useraccount:user.useraccount,
            password: user.password,
          };
          let data:any = await Account.Login(params);          
          localStorage.setItem("sessionId", data.Cookie);
          location.reload();

    }else{
        location.reload();

    }
 
}