<!--
 * @Author: zeHua
 * @Date: 2022-06-21 11:15:09
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-23 16:06:14
 * @FilePath: \sticky-notes\src\app\components\Content\components\AddTodo\Index.vue
-->
<template>
  <div class="add-todo">
    <n-button class="add-todo-btn" v-if="!isEdit" ghost @click="addClick"
      >新增日报</n-button
    >
    <AddTodoInfo @close="closeClick" @ok="okClick" v-else />
  </div>
</template>

<script setup lang="ts">
import { playAddAudio } from "@/app/utils/audio";
import { addTodo } from "@/app/utils/send";
import { TodoModel } from "@/common/interface";
import { NButton, useMessage } from "naive-ui";
import { ref } from "vue";
import AddTodoInfo from "../AddTodoInfo";
import axios from "axios";
const emits = defineEmits<{
  (e: "refresh"): void;
}>();
const isEdit = ref(false);
// 新增按钮
const addClick = () => {
  isEdit.value = true;
};
const message = useMessage();

// 关闭
const closeClick = () => {
  isEdit.value = false;
};
// 确认新增按钮
const okClick = (todo: any) => {
  console.log(todo);
  let houresArray = todo.remind.planListForm.map((v) => v.hours || 0);
  console.log(houresArray);
  let totalHours = 0;
  houresArray.map((item) => {
    totalHours += Number(item);
  });
  // 如果超过7.5
  if (todo.remind.wordType === 1 && totalHours > 7.5) {
    message.error("正常工作时间不能大于7.5小时");
    return;
  }
  let config = {
    wordType: todo.remind.workType,
    itemId: todo.remind.funName,
    proId: todo.remind.projectName,
    reportDate: todo.remind.date,
    workHour: totalHours,
    describe: todo.content,
    size: todo.remind.planListForm.length,
    hours: houresArray,
  };

  config = { ...config };
  todo.remind.planListForm.map((item, index) => {
    config[index] = JSON.stringify(item);
  });
  // ?wordType=${config.wordType}&itemId=${config.itemId}&reportDate=${config.reportDate}&describe=${config.describe}&size=${config.size}&hours=${}
  let data = {
    url: `http://192.168.0.12:8080/WDMS/DailyController/insertDaily`,
    cookie: localStorage.getItem("sessionId"),
    method: "POST",
    data: config,
  };
  axios.post("http://192.168.0.83:5000/proxy", data).then((res) => {
    if (res.data.code == 200) {
      let datas = res.data.data;
      if (datas.code === 100000) {
        message.success("日报添加成功");
      } else {
        message.error(datas.message);
      }
    } else {
      message.error(res.data.message);
    }
  });
  // const data = addTodo(todo);
  // // if (data.code == 1) emits("refresh");
  closeClick();
  // playAddAudio();
};
</script>

<style lang="less" scoped>
.add-todo {
  padding: 0 5px;

  .add-todo-btn {
    width: 100%;
    color: @base-color;
    --n-border: 1px solid @base-color-5 !important;
    --n-border-hover: 1px solid @base-color !important;
    --n-border-pressed: 1px solid @base-color-5 !important;
    --n-border-focus: none !important;
    --n-ripple-color: 1px solid @base-color !important;
    --n-text-color-hover: @base-color !important;
    --n-text-color-pressed: @base-color !important;
    --n-text-color-focus: @base-color !important;
  }
}
</style>
