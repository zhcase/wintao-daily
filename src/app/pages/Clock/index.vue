<template>
  <div></div>
</template>

<script lang="ts" setup>
import { ElNotification } from "element-plus";
import { ref } from "vue";
import remote from "@/app/utils/render";

const isShowClock = ref(false);
setInterval(() => {
  let myDate = new Date();
  let h = myDate.getHours(); //获取当前小时数(0-23)
  let m = myDate.getMinutes(); // 获取分钟数
  if (h == 17 && m == 55) {
    if (isShowClock.value == false) {
      ElNotification({
        title: "元道日报",
        message: "快下班啦，请记得填写今天的日报喔!",
        showClose: false,
        duration: 15000,
      });
    } else {
      setTimeout(() => {
        isShowClock.value = false;
      }, 60000);
    }
    // remote.getCurrentWindow().setIgnoreMouseEvents(false);

    // remote.getCurrentWindow().setIgnoreMouseEvents(true, { forward: true });

    isShowClock.value = true;
  }
  //   console.log(2233345);
}, 5000);
</script>
