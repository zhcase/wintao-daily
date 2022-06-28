<!--
 * @Author: zeHua
 * @Date: 2022-06-23 21:34:37
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-28 18:22:53
 * @FilePath: \sticky-notes\src\app\components\Calendar\index.vue
-->
<template>
  <div class="wintao-p-calender">
    <n-spin
      :show="!isShowCalendar"
      description="加载中，请耐心等待..."
      style="mrgin-top: 100px"
    >
      <div class="wintao-p-calender-content">
        <!-- :range="dateRange" :disabledDate="disabledDateFun" -->
        <el-calendar :disabledDate="disabledDateFun">
          <!-- <template #header="{ date }">
            {{ currentYyMm }}
          </template> -->
          <template #dateCell="{ data }">
            <p
              style="position: relative; text-align: center"
              :class="data.isSelected ? 'is-selected' : ''"
              @click="handleClickDate(data)"
            >
              {{ data.day.split("-").slice(2).join("-") }}
              <i
                :class="computeHasDate(data) ? 'edit-active' : 'edit-no'"
                class="edit-round"
              ></i>
            </p>
          </template>
        </el-calendar>
      </div>
      <div class="work-content">
        <el-input
          v-model="workContent"
          :rows="4"
          clearable
          type="textarea"
          placeholder="请输入今日工作内容"
        />
      </div>
    </n-spin>
  </div>
</template>

<script lang="ts" setup>
import { Account } from "@/app/api/account";
import { onMounted, reactive, ref } from "vue";
import { NSpin } from "naive-ui";
const dateArray = [];
const workContent = ref("");
const dateRange = ref([]); //日期范围
const currentYyMm = ref(""); //当前年月
const isShowCalendar = ref(false);
let currentDate = new Date();
let user: any = localStorage.getItem("user");
user = JSON.parse(user);
let y = currentDate.getFullYear(); //年
let m = currentDate.getMonth() + 1; //月
let d = currentDate.getDate(); // 日
dateRange.value[0] = y + "," + (m - 1) + "," + d;
dateRange.value[1] = y + "," + m + "," + d;
console.log(dateRange);
currentYyMm.value = y + "年" + m + "月";
console.log(currentYyMm);

const getDaily = async () => {
  isShowCalendar.value = false;
  // http://192.168.0.12:8080/WDMS/DailyController/loadDailyDataList
  let data = {
    url: "http://192.168.0.12:8080/WDMS/DailyController/loadDailyDataList",
    cookie: localStorage.getItem("sessionId"),
    method: "POST",
    data: {
      startDate: `${y}-${m - 1}-${d}`,
      endDate: `${y}-${m}-${d}`,
      // staffName: user.useraccount,
      userAccount: user && user.useraccount,
      page: 1,
      rows: 100,
    },
  };
  let result: any = await Account.Proxy(data);
  result = result.data;
  let workArray = [];

  result.rows.map((item) => {
    console.log(item);
    let currentDateTime = item.reportDate.substring(0, 10);

    if (item.wordType === 1) {
      workArray.push({
        date: currentDateTime,
        workHour: item.workHour,
      });
    }
  });
  let maxWorkTime = {};
  workArray.map((item) => {
    if (maxWorkTime[item.date]) {
      maxWorkTime[item.date] += item.workHour;
    } else {
      maxWorkTime[item.date] = item.workHour;
    }
  });
  for (let item in maxWorkTime) {
    console.log(maxWorkTime[item]);
    if (maxWorkTime[item] >= 7.5) {
      console.log(maxWorkTime[item]);
      console.log(item);

      dateArray.push(item);
    }
  }
  console.log(dateArray);
  isShowCalendar.value = true;
};
getDaily();

const computeHasDate = (data) => {
  return dateArray.indexOf(data.day) > -1;
};
const emitDate = defineEmits(["updateDate"]);

const handleClickDate = (data) => {
  emitDate("updateDate", data);
};
const disabledDateFun = (time) => {
  return time.getTime() < new Date().getTime();
};
defineExpose({
  getDaily,
  workContent,
});
</script>

<style scoped>
.is-selected {
  color: #1989fa;
}
.wintao-p-calender {
  height: calc(100% - 40px);
  top: 40px;
  left: 0;
  position: fixed;
  width: 100%;
  background-color: #fff;
}
.wintao-p-calender-content {
  height: auto;
  position: relative;
}
.wintao-p-calender .el-calendar {
  --el-calendar-cell-width: auto !important;
  color: #010101 !important;
  position: relative;
}
.wintao-p-calender .el-calendar-day span {
}
.edit-no {
  background-color: #f56c6c;
}
.edit-active {
  background-color: #67c23a;
}

.edit-round {
  height: 5px;
  cursor: pointer;
  display: inline-block;
  border-radius: 50%;
  left: 50%;
  margin-left: -2.5px;
  position: absolute;
  bottom: -4px;
  width: 5px;
}
.work-content {
  padding: 0 20px;
  /* margin */
}
</style>
