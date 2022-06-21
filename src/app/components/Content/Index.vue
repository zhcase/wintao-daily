<!--
 * @Author: zeHua
 * @Date: 2022-06-21 11:15:09
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-21 18:40:37
 * @FilePath: \sticky-notes\src\app\components\Content\Index.vue
-->
<template>
  <n-space vertical>
    <n-input
      v-model:value="data.useraccount"
      type="text"
      placeholder="请输入账号"
    />

    <n-input
      v-model:value="data.password"
      type="password"
      placeholder="请输入密码"
    />
    <n-grid x-gap="12" :cols="4">
      <n-gi>
        <n-input
          v-model:value="data.code"
          type="text"
          placeholder="请输入验证码"
        />
      </n-gi>
      <n-gi @click="getImageUrl">
        <img :src="data.imageUrl" />
      </n-gi>
    </n-grid>

    <n-button @click="handleLogin">登录</n-button>
  </n-space>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { NButton, NInput, useMessage } from "naive-ui";
import axios from "axios";
export default defineComponent({
  components: {
    NButton,
    NInput,
  },
  setup() {
    const message = useMessage();

    const data = reactive({
      useraccount: "", // 用户名
      password: "", //用户密码
      code: "", // 验证码
      imageUrl: "", // 图片路径
    });
    function handleLogin() {
      console.log(getCookie("JSESSIONID"));
      axios.defaults.withCredentials = true;
      axios({
        url: "http://192.168.0.12:8080/WDMS/system/login",
        method: "POST",
        data: `useraccount=${data.useraccount}&password=${data.password}&code=${data.code}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookies: getCookie("JSESSIONID"),
        },
      }).then((response) => {
        let data = response.data;
        if (data.code !== 200) {
          message.warning(data.message);
        }
      });
      //   axios
      //     .post("http://192.168.0.12:8080/WDMS/system/login", {
      //       useraccount: data.useraccount,
      //       password: data.password,
      //       code: data.code,
      //     })
      //     .then(function (response) {
      //       console.log(response);
      //       let data = response.data;
      //       if (data.code !== 200) {
      //         message.warning(data.message);
      //       }
      //     })
      //     .catch(function (error) {
      //       console.log(error);
      //     });
    }

    // 获取图片路径
    function getImageUrl() {
      data.imageUrl =
        "http://192.168.0.12:8080/WDMS/system/checkCode?a=" + new Date();
    }

    function getCookie(cookie_name) {
      var allcookies = document.cookie;
      //索引长度，开始索引的位置
      var cookie_pos = allcookies.indexOf(cookie_name);

      // 如果找到了索引，就代表cookie存在,否则不存在
      if (cookie_pos != -1) {
        // 把cookie_pos放在值的开始，只要给值加1即可
        //计算取cookie值得开始索引，加的1为“=”
        cookie_pos = cookie_pos + cookie_name.length + 1;
        //计算取cookie值得结束索引
        var cookie_end = allcookies.indexOf(";", cookie_pos);

        if (cookie_end == -1) {
          cookie_end = allcookies.length;
        }
        //得到想要的cookie的值
        var value = unescape(allcookies.substring(cookie_pos, cookie_end));
      }
      return value;
    }

    onMounted(() => {
      document.cookie = "JSESSIONID=68AEDC33545F0374A97421F279D9F8FF";
      getImageUrl();
    });

    return {
      data,
      handleLogin,
      getImageUrl,
    };
  },
});
</script>
