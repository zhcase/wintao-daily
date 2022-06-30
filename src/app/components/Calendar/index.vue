<!--
 * @Author: zeHua
 * @Date: 2022-06-23 21:34:37
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-30 19:26:24
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
        <el-calendar :disabledDate="disabledDateFun" v-model="currentMonth">
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
import { onMounted, reactive, ref, watch } from "vue";
import { NSpin } from "naive-ui";
let dateArray = [];
const workContent = ref("");
const dateRange = ref([]); //日期范围
const currentMonth = ref(new Date());
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
currentYyMm.value = y + "年" + m + "月";
let year = `${y}-${m < 10 ? "0" + m : m}-${d}`;
const formatDateTime = (date) => {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  var h = date.getHours();
  var minute = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  // return y + '-' + m + '-' + d+' '+h+':'+minute;
  return [y + "-" + m + "-" + d, y, m];
};

const getDaily = async (startYear, endYear) => {
  dateArray = [];
  console.log(startYear);
  console.log(endYear);

  isShowCalendar.value = false;
  // http://192.168.0.12:8080/WDMS/DailyController/loadDailyDataList
  let data = {
    url: "http://192.168.0.12:8080/WDMS/DailyController/loadDailyDataList",
    cookie: localStorage.getItem("sessionId"),
    method: "POST",
    data: {
      startDate: startYear,
      endDate: endYear,
      // staffName: user.useraccount,
      userAccount: user && user.useraccount,
      page: 1,
      rows: 200,
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
  isShowCalendar.value = true;
};
getDaily(`${y}-${m}-${1}`, `${y}-${m}-${31}`);

const computeHasDate = (data) => {
  return dateArray.indexOf(data.day) > -1;
};
const emitDate = defineEmits(["updateDate"]);

const handleClickDate = (data) => {
  console.log(year);

  console.log(data.day > year);
  if (data.day > year) {
    return;
  }
  emitDate("updateDate", data);
};
const disabledDateFun = (time) => {
  return time.getTime() < new Date().getTime();
};

watch(
  () => currentMonth.value,
  (newV, oldV) => {
    if (formatDateTime(newV)[0] > year) {
      return;
    }
    console.log(
      formatDateTime(newV)[0],
      `${formatDateTime(newV)[1]}-${formatDateTime(newV)[2]}-${31}`
    );

    getDaily(
      `${formatDateTime(newV)[1]}-${Number(formatDateTime(newV)[2]) - 1}-${25}`,
      `${formatDateTime(newV)[1]}-${Number(formatDateTime(newV)[2]) + 1}-${10}`
    );
  }
);
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
