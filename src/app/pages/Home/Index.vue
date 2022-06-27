<template>
  <div
    class="home"
    :class="{
      leave: leave,
    }"
  >
    <NMessageProvider :abstract="true">
      <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" ref="parentRefs">
        <TopNav v-model:lock="lock" />
        <!-- <Content /> -->
        <!-- <Login @handleLogin="handleLogin" v-if="!isLogin" /> -->
        <!-- v-if="isLogin" -->

        <PageCalendar @updateDate="handleChangeDate" ref="calendarRefs" />
        <!-- v-if="isShowWorkForm" -->

        <CycleSetting
          :currentDate="selectCurrentDate"
          :workContent="workContent"
          @update:show="isShowWorkForm = false"
          @ok="refreshWorkTable"
        />
        <!-- <BottomNav /> -->
      </NConfigProvider>
    </NMessageProvider>
  </div>
</template>

<script setup lang="ts">
import { NMessageProvider, NConfigProvider, zhCN, dateZhCN } from 'naive-ui'
import TopNav from '@app/components/TopNav'
import Content from '@app/components/Content'
import BottomNav from '@app/components/BottomNav'
import { onMounted, Ref, ref, watch, getCurrentInstance } from 'vue'
import { leaveToZero, moveToZero } from '@/app/utils/event'
import remote from '@/app/utils/render'
import Login from '@/app/components/Setting/Login'
import PageCalendar from '@/app/components/Calendar' //选择日期
import CycleSetting from '@/app/components/Content/components/CycleSetting'
import { ElNotification } from 'element-plus'

const win = remote.getCurrentWindow()
console.log(window)

win.setIgnoreMouseEvents(false)

// 锁定
const lock = ref(false)
const isShowWorkForm = ref(false) //是否显示工作表单
const selectCurrentDate = ref(null) //选中的当前日期
const calendarRefs = ref('') //
const workContent = ref('') // 工作内容
const parentRefs = ref('')
watch(lock, newV => {
  if (newV) {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  } else {
    if (win.getPosition()[1] <= 0) {
      initInfo()
    }
  }
})

// 隐藏
const leave = ref(false)
const isLogin = ref(false)

let intervalId
const handleLogin = () => {
  isLogin.value = true
}

// 选择完成日期
const handleChangeDate = data => {
  isShowWorkForm.value = true

  workContent.value = (calendarRefs.value as any).workContent

  selectCurrentDate.value = data.day
}
const checkShowOrHidden = () => {
  const cursorPos = remote.screen.getCursorScreenPoint()
  if (!leave.value) {
    if (
      cursorPos.x < posXMin ||
      cursorPos.x > posXMax ||
      cursorPos.y > posYMax
    ) {
      leave.value = true
      win.setIgnoreMouseEvents(true, { forward: true })
    }
  } else {
    if (
      cursorPos.x >= posXMin &&
      cursorPos.x <= posXMax &&
      cursorPos.y < posYMaxHidden
    ) {
      leave.value = false
      remote.getCurrentWindow().setIgnoreMouseEvents(false)
    }
  }
}
const refreshWorkTable = () => {
  ;(calendarRefs.value as any).getDaily()
}

// 是否可以贴边隐藏
const canHidden = ref(true)
let posXMin = 0
let posXMax = 0
let posYMin = win.getPosition()[1]
let posYMax = 0
let posYMaxHidden = 2
const initInfo = () => {
  let size = win.getSize()
  posXMin = win.getPosition()[0]
  posXMax = posXMin + size[0]
  posYMin = 0
  posYMax = size[1]
  canHidden.value = true
  win.setResizable(false)
  if (!intervalId) intervalId = setInterval(checkShowOrHidden, 300)
}
if (posYMin <= 0) initInfo()
moveToZero(initInfo)
leaveToZero(() => {
  win.setResizable(true)
  canHidden.value = false
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
})
onMounted(() => {
  isLogin.value = localStorage.getItem('sessionId') ? true : false
})
</script>

<style lang="less" scoped>
.leave {
  transform: translateY(-100%);
}
.home {
  position: relative;
  width: 100%;
  height: 100%;
  background: fade(#414141, 50%);
  transition: all 0.3s ease-out;
}
.show {
  height: 9px;
  width: 100%;
  position: absolute;
  bottom: -9px;
  left: 0;
  background: white;
}
</style>
