<template>
  <n-space vertical>
    <n-input
      v-model:value="data.useraccount"
      type="text"
      placeholder="请输入账号"
    />

    <n-input
      v-model:value="data.passwold"
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
      <n-gi>
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
      passwold: "", //用户密码
      code: "", // 验证码
      imageUrl: "", // 图片路径
    });
    function handleLogin() {
      alert(data.code);
      axios({
        url: "http://192.168.0.12:8080/WDMS/system/login",
        data: {
          useraccount: data.useraccount,
          passwold: data.passwold,
          code: data.code,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }).then((response) => {
        let data = response.data;
        if (data.code !== 200) {
          message.warning(data.message);
        }
      });
      //   axios
      //     .post("http://192.168.0.12:8080/WDMS/system/login", {
      //       useraccount: data.useraccount,
      //       passwold: data.passwold,
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

    onMounted(() => {
      getImageUrl();
    });

    return {
      data,
      handleLogin,
    };
  },
});
</script>
