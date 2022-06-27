<template>
  <transition name="slide-fade">
    <n-spin :show="isShowLoading" description="添加中，请耐心等待...">
      <div class="cycle-setting">
        <NCard class="content">
          <Type
            ref="typeRef"
            :currentDate="currentDate"
            :workContent="workContent"
          />
          <n-tag
            type="success"
            size="small"
            class="work-detail"
            @click="handleDetail"
            round
          >
            明细
          </n-tag>
          <!-- <n-tabs
          default-value="select"
          size="large"
          display-directive="show"
          justify-content="space-evenly"
        >
          <n-tab-pane name="select" tab="选择">
          </n-tab-pane>
          <n-tab-pane name="setting" tab="设置">
            <n-form
              ref="formRef"
              size="small"
              label-width="auto"
              label-placement="left"
              :model="model"
              :rules="formRules"
            >
              <n-form-item label="循环方式" path="way">
                <n-select
                  :on-update:value="changeSelectWay"
                  :options="selectWayOptions"
                  placeholder="请选择循环方式"
                  :value="model.way"
                />
              </n-form-item>
              <n-form-item
                label="循环设置"
                path="waySetting.ms"
                v-if="model.way > -1 && model.way != RemindWayModel.每天"
              >
                <n-date-picker
                  v-if="model.way == RemindWayModel.仅一次"
                  to="#date"
                  type="date"
                  placeholder="请选择年月日"
                  :on-update:value="selectDate"
                  :value="model.waySetting.ms"
                />
                <n-date-picker
                  v-if="model.way == RemindWayModel.每年"
                  to="#date"
                  type="date"
                  format="MM-dd"
                  placeholder="请选择月日"
                  :on-update:value="selectDate"
                  :value="model.waySetting.ms"
                />
                <n-select
                  v-if="model.way == RemindWayModel.每周"
                  :on-update:value="selectWeek"
                  :options="weekOptions"
                  placeholder="请选择周几"
                  :value="model.waySetting?.week"
                />
                <n-select
                  v-if="model.way == RemindWayModel.每月"
                  :on-update:value="selectDay"
                  :options="dayOptions"
                  :value="model.waySetting?.day"
                  placeholder="请选择哪日"
                />
              </n-form-item>
              <n-form-item label="提醒时间" path="ms">
                <n-time-picker
                  style="width: 100%"
                  format="HH:mm"
                  :on-update:value="selectTimer"
                  :value="model.ms"
                />
              </n-form-item>
            </n-form>
          </n-tab-pane>
        </n-tabs> -->
          <template #footer>
            <n-button type="error" @click="cancelClick" style="width: 44%"
              >取消</n-button
            >
            <n-button type="success" @click="sureClick" style="width: 45%"
              >确认</n-button
            >
          </template>
        </NCard>
      </div>
    </n-spin>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref, toRaw, watch } from "vue";
import Type from "./components/type"; //选择类型
import { Account } from "@/app/api/account";

import {
  NButton,
  NTabs,
  NTabPane,
  NCard,
  NForm,
  NFormItem,
  NSelect,
  SelectOption,
  NTimePicker,
  NDatePicker,
  FormRules,
  FormInst,
  useMessage,
  NCalendar,
  NTag,
} from "naive-ui";
import {
  RemindModel,
  RemindWayModel,
  TodoModel,
  WeekModel,
} from "@/common/interface";
import moment from "moment";

interface Props {
  show: boolean;
  remind: RemindModel;
  currentDate: String;
  workContent: String;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  remind: null,
  currentDate: null,
  workContent: null,
});

// 表单设置
const formRef: Ref<FormInst> = ref(null);
const isShowLoading = ref(false);
const typeRef = ref(null);
console.log(props);

const currentDate = ref(props.currentDate);
const message = useMessage();
const workContent = ref(props.workContent);

const formRules: FormRules = {
  way: {
    required: true,
    message: "循环方式必填",
  },
  ms: {
    required: true,
    message: "提醒时间必填",
  },
  waySetting: {
    ms: {
      required: true,
      message: "循环设置必填",
    },
  },
};
let model: Ref<RemindModel> = ref({
  waySetting: {},
});

// if (props.remind) {
//   model.value = props.remind;
// }
watch(
  () => props.remind,
  (newV, oldV) => {
    model.value = newV;
  }
);

const emits = defineEmits<{
  (e: "close"): void;
  (e: "ok", todo: RemindModel): void;
  (e: "update:show", v: boolean): void;
}>();

// 循环方式
const selectWayOptions: Ref<SelectOption[]> = ref([]);
for (let key in RemindWayModel) {
  if (typeof RemindWayModel[key] == "string") {
    selectWayOptions.value.push({
      label: RemindWayModel[key],
      value: Number(key) as RemindWayModel,
    });
  }
}

// 查看明细
const handleDetail = (val) => {};
// 周
const weekOptions: Ref<SelectOption[]> = ref([]);
for (let key in WeekModel) {
  if (typeof WeekModel[key] == "string") {
    weekOptions.value.push({
      label: WeekModel[key],
      value: key,
    });
  }
}

// 日
const dayOptions: Ref<SelectOption[]> = ref([
  {
    label: "最后一天",
    value: 0,
  },
]);
for (let i = 1; i < 32; i++) {
  dayOptions.value.push({
    label: i + "号",
    value: i,
  });
}

// 循环方式改变
const changeSelectWay = (value: RemindWayModel) => {
  model.value.way = value;
  model.value.waySetting = {
    ms: undefined,
  };
};
// 提醒时间改变
const selectTimer = (value) => {
  let time = moment(value);
  model.value.hour = time.hour();
  model.value.minute = time.minute();
  model.value.seconds = time.second();
  model.value.ms = value;
};
// 日期
const selectDate = (value) => {
  let date = moment(value);
  model.value.waySetting.year = date.year();
  model.value.waySetting.month = date.month() + 1;
  model.value.waySetting.day = date.date();
  model.value.waySetting.ms = value;
};
// 周几
const selectWeek = (value) => {
  model.value.waySetting.week = value as WeekModel;
  model.value.waySetting.ms = 0;
};
// 日
const selectDay = (value) => {
  model.value.waySetting.day = value as number;
  model.value.waySetting.ms = 0;
};
// 确认点击
const sureClick = (val) => {
  typeRef.value.formRef.validate(async (errors) => {
    if (!errors) {
      let houresArray = typeRef.value.model.planListForm.map(
        (v) => v.hours || 0
      );
      console.log(houresArray);
      let totalHours = 0;
      houresArray.map((item) => {
        totalHours += Number(item);
      });
      // 如果超过7.5
      if (typeRef.value.model.wordType === 1 && totalHours > 7.5) {
        message.error("正常工作时间不能大于7.5小时");
        return;
      }
      console.log(typeRef);
      let currentDate = new Date();

      let y = currentDate.getFullYear(); //年
      let m = currentDate.getMonth() + 1; //月
      let d = currentDate.getDate(); // 日
      let config: any = {
        wordType: typeRef.value.model.workType,
        itemId: typeRef.value.model.funName,
        proId: typeRef.value.model.projectName,
        reportDate: String(typeRef.value.model.declareDate),
        workHour: totalHours,
        describe: typeRef.value.model.workContent,
        size: typeRef.value.model.planListForm.length,
        hours: houresArray,
      };
      let yearTime = `${y}-${Number(m) < 10 ? "0" + m : m}-${d}`;

      if (typeRef.value.model.declareDate < yearTime) {
        config.exAssist = 3;
      }
      console.log(typeRef.value.model.declareDate);

      config = { ...config };

      typeRef.value.model.planListForm.map((item, index) => {
        config[index] = JSON.stringify(item);
      });
      // ?wordType=${config.wordType}&itemId=${config.itemId}&reportDate=${config.reportDate}&describe=${config.describe}&size=${config.size}&hours=${}
      let data = {
        url: `http://192.168.0.12:8080/WDMS/DailyController/insertDaily`,
        cookie: localStorage.getItem("sessionId"),
        method: "POST",
        data: config,
      };
      isShowLoading.value = true;
      let result = await Account.Proxy(data);
      emits("ok", toRaw(model.value));
      emits("update:show", false);
      isShowLoading.value = false;
      message.success("添加成功");
      // context.emit('ok', 'sucess')
    } else {
      console.log(errors);
      message.error("验证失败");
    }
  });
};

// 取消点击
const cancelClick = () => {
  emits("update:show", false);
};

// 日历
const today = ref(moment().milliseconds());
</script>

<style lang="less">
#date {
  .n-date-panel--date {
    transform: translateX(33px);
  }
}
</style>

<style lang="less" scoped>
/* 可以为进入和离开动画设置不同的持续时间和动画函数 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(500px);
}

.cycle-setting {
  position: fixed;
  top: 40px;
  left: 0;
  width: 100%;
  height: 100%;
  // display: flex;
  justify-content: center;
  align-items: center;

  .content {
    // border-radius: 10px;
    width: 100%;
    padding: 20px 0px;
    height: calc(100% - 40px);
    background: white;

    --n-padding-bottom: 0px !important;

    :deep(.n-card__footer) {
      margin-bottom: 12px;
      display: flex;
      justify-content: space-around;
    }
  }
}
.work-detail {
  position: fixed;
  cursor: pointer;
  right: 0;
  top: 50px;
}
</style>
