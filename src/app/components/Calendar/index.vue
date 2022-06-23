<!--
 * @Author: zeHua
 * @Date: 2022-06-23 21:34:37
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-24 01:14:29
 * @FilePath: /wintao/wintao-daily/src/app/components/Calendar/index.vue
-->
<template>
  <div class="wintao-p-calender">
    <div class="wintao-p-calender-content">
      <el-calendar :range="dateRange" :disabledDate="disabledDateFun">
        <template #header="{ date }">
          {{ currentYyMm }}
        </template>
        <template #dateCell="{ data }">
          <p
            style="position: relative; text-align: center"
            :class="data.isSelected ? 'is-selected' : ''"
            @click="handleClickDate(data)"
          >
            {{ data.day.split('-').slice(2).join('-') }}
            <i
              :class="computeHasDate(data) ? 'edit-active' : 'edit-no'"
              class="edit-round"
            ></i>
          </p>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
const array = ['2022-06-04', '2022-06-07', '2022-06-22']
const dateRange = ref([]) //日期范围
const currentYyMm = ref('') //当前年月

let currentDate = new Date()

let y = currentDate.getFullYear() //年
let m = currentDate.getMonth() + 1 //月
let d = currentDate.getDate() // 日
dateRange.value[0] = y + ',' + m + ',' + '1'
dateRange.value[1] = y + ',' + m + ',' + d
console.log(dateRange)
currentYyMm.value = y + '年' + m + '月'
console.log(currentYyMm)

const computeHasDate = data => {
  return array.indexOf(data.day) > -1
}
const emitDate = defineEmits(['updateDate'])

const handleClickDate = data => {
  emitDate('updateDate', data)
}
const disabledDateFun = time => {
  return time.getTime() < new Date().getTime()
}
</script>

<style scoped>
.is-selected {
  color: #1989fa;
}
.wintao-p-calender {
  height: 100%;
  top: 40px;
  left: 0;
  position: fixed;
  width: 100%;
  background-color: #fff;
}
.wintao-p-calender-content {
  height: 300px;
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
</style>
