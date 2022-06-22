<!--
 * @Author: zeHua
 * @Date: 2022-06-21 11:15:09
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-22 23:06:38
 * @FilePath: /wintao/wintao-daily/src/app/components/Setting/Login/index.vue
-->
<template>
  <div class="wintao-login">
    <n-spin :show="isShowLoading" description="登录中，请耐心等待...">
      <n-form ref="formRef" :model="model" :rules="rules" style="padding: 20px">
        <n-form-item path="useraccount" label="用户名">
          <n-input v-model:value="model.useraccount" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="model.password"
            type="password"
            @input="handlePasswordInput"
            @keydown.enter.prevent
          />
        </n-form-item>
        <!--
    <n-form-item path="code" label="验证码">
      <n-input
        v-model:value="model.code"
        type="password"
        style="width: 70%"
        @input="handlePasswordInput"
        @keydown.enter.prevent
      />
      <img :src="imageUrl" style="height: 100%; width: 30%" />
    </n-form-item> -->

        <n-row>
          <n-col>
            <div>
              <n-button
                round
                type="primary"
                @click="handleValidateButtonClick"
                style="width: 100%"
              >
                登 录
              </n-button>
            </div>
          </n-col>
        </n-row>
      </n-form>
    </n-spin>
    <n-result
      v-if="false"
      status="success"
      title="登录成功"
      description="失败的孩子"
      style="margin-top: 50px"
    >
      <template #footer>
        <n-button>我喜欢</n-button>
      </template>
    </n-result>
    <!-- <n-space vertical>
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
  </n-space> -->
  </div>
</template>

<script>
// import { defineComponent, onMounted, reactive, ref } from 'vue'
// import { NButton, NInput, useMessage } from 'naive-ui'
import axios from 'axios'
// export default defineComponent({
//   components: {
//     NButton,
//     NInput,
//   },
//   setup() {
//     const message = useMessage()

//     const data = reactive({
//       useraccount: '', // 用户名
//       password: '', //用户密码
//       code: '', // 验证码
//       imageUrl: '', // 图片路径
//     })
//     function handleLogin() {
//       console.log(getCookie('JSESSIONID'))
//       axios.defaults.withCredentials = true
//       axios({
//         url: 'http://192.168.0.12:8080/WDMS/system/login',
//         method: 'POST',
//         data: `useraccount=${data.useraccount}&password=${data.password}&code=${data.code}`,
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           Cookies: getCookie('JSESSIONID'),
//         },
//       }).then(response => {
//         let data = response.data
//         if (data.code !== 200) {
//           message.warning(data.message)
//         }
//       })
//       //   axios
//       //     .post("http://192.168.0.12:8080/WDMS/system/login", {
//       //       useraccount: data.useraccount,
//       //       password: data.password,
//       //       code: data.code,
//       //     })
//       //     .then(function (response) {
//       //       console.log(response);
//       //       let data = response.data;
//       //       if (data.code !== 200) {
//       //         message.warning(data.message);
//       //       }
//       //     })
//       //     .catch(function (error) {
//       //       console.log(error);
//       //     });
//     }

//     // 获取图片路径
//     function getImageUrl() {
//       data.imageUrl =
//         'http://192.168.0.12:8080/WDMS/system/checkCode?a=' + new Date()
//     }

//     function getCookie(cookie_name) {
//       var allcookies = document.cookie
//       //索引长度，开始索引的位置
//       var cookie_pos = allcookies.indexOf(cookie_name)

//       // 如果找到了索引，就代表cookie存在,否则不存在
//       if (cookie_pos != -1) {
//         // 把cookie_pos放在值的开始，只要给值加1即可
//         //计算取cookie值得开始索引，加的1为“=”
//         cookie_pos = cookie_pos + cookie_name.length + 1
//         //计算取cookie值得结束索引
//         var cookie_end = allcookies.indexOf(';', cookie_pos)

//         if (cookie_end == -1) {
//           cookie_end = allcookies.length
//         }
//         //得到想要的cookie的值
//         var value = unescape(allcookies.substring(cookie_pos, cookie_end))
//       }
//       return value
//     }

//     onMounted(() => {
//       document.cookie = 'JSESSIONID=68AEDC33545F0374A97421F279D9F8FF'
//       getImageUrl()
//     })

//     return {
//       data,
//       handleLogin,
//       getImageUrl,
//     }
//   },
// })

import {
  defineComponent,
  onMounted,
  ref,
  defineEmits,
  getCurrentInstance,
} from 'vue'
import {
  useMessage,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NResult,
  NAlert,
  NSpin,
} from 'naive-ui'

export default defineComponent({
  components: {
    NForm,
    NFormItem,
    NInput,
    NButton,
    NResult,
    NAlert,
    NSpin,
  },
  emits: {
    handleLogin: null,
  },
  setup(props, context) {
    const formRef = ref(null)
    const imageUrl = ref(null)
    const isShowLoading = ref(false)
    const rPasswordFormItemRef = ref(null)
    const message = useMessage()

    const modelRef = ref({
      useraccount: null,
      password: null,
      // code: null,
    })
    function validatePasswordStartWith(rule, value) {
      return (
        !!modelRef.value.password &&
        modelRef.value.password.startsWith(value) &&
        modelRef.value.password.length >= value.length
      )
    }
    function validatePasswordSame(rule, value) {
      return value === modelRef.value.password
    }
    //     // 获取图片路径
    // function getImageUrl() {
    //   imageUrl.value =
    //     "http://192.168.0.12:8080/WDMS/system/checkCode?a=" + new Date();
    // }
    const rules = {
      useraccount: [
        {
          required: true,
          message: '请输入用户名',
        },
      ],
      password: [
        {
          required: true,
          message: '请输入密码',
        },
      ],
      // code: [
      //   {
      //     required: true,
      //     message: "请输入验证码",
      //   },
      // ],
      // reenteredPassword: [
      //   {
      //     required: true,
      //     message: '请再次输入密码',
      //     trigger: ['input', 'blur'],
      //   },
      //   {
      //     validator: validatePasswordStartWith,
      //     message: '两次密码输入不一致',
      //     trigger: 'input',
      //   },
      //   {
      //     validator: validatePasswordSame,
      //     message: '两次密码输入不一致',
      //     trigger: ['blur', 'password-input'],
      //   },
      // ],
    }

    function handleValidateButtonClick(e) {
      e.preventDefault()
      isShowLoading.value = true
      console.log(isShowLoading)
      setTimeout(() => {
        isShowLoading.value = false
      }, 20000)
      formRef.value.validate(errors => {
        if (!errors) {
          axios
            .post('http://192.168.0.83:5000/login', {
              useraccount: modelRef.value.useraccount,
              password: modelRef.value.password,
            })
            .then(function (response) {
              let data = response.data
              if (data.status == 'ok') {
                isShowLoading.value = false

                message.success('登录成功')
                localStorage.setItem('sessionId', data.Cookie)
                localStorage.setItem('user', JSON.stringify(modelRef.value))

                context.emit('handleLogin')
                window.sessionId = data.Cookie
              } else {
                isShowLoading.value = false
                message.error(data.message)
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        } else {
          console.log(errors)
          // message.error("验证失败");
        }
      })
    }

    onMounted(() => {
      // getImageUrl();
    })

    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      isShowLoading,
      // getImageUrl,
      imageUrl,
      handleValidateButtonClick,
      handlePasswordInput() {
        if (modelRef.value.reenteredPassword) {
          rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
        }
      },
    }
  },
})
</script>

<style>
.wintao-login {
  height: 100%;
  top: 40px;
  left: 0;
  position: fixed;
  width: 100%;
  background-color: #fff;
}
</style>
