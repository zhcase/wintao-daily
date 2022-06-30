<template>
  <div style="height: 550px; overflow: auto">
    <n-form ref="formRef" :model="model" :rules="rules" size="small">
      <n-form-item path="workType" label="工作类型">
        <n-select
          @change="changeWorkType"
          v-model:value="model.workType"
          placeholder="Select"
          :options="generalOptions"
        />
      </n-form-item>
      <n-form-item path="declareDate" label="申报日期">
        <n-date-picker
          type="date"
          value-format="yyyy-MM-dd"
          v-model:formatted-value="model.declareDate"
          :actions="['now']"
          style="width: 100%"
        />
      </n-form-item>
      <n-form-item path="projectName" label="项目名称">
        <n-select
          v-model:value="model.projectName"
          placeholder="请选择项目名称"
          @change="changeProject"
          :options="projectList"
        />
      </n-form-item>
      <n-form-item path="funName" label="功能模块">
        <n-select
          v-model:value="model.funName"
          placeholder="请选择功能模块"
          :options="funList"
        />
      </n-form-item>
      <n-form-item
        path="funName"
        :label="item.name + '(' + item.overtime.toFixed(1) + 'h)'"
        v-for="(item, index) of planList"
        :key="index"
      >
        <n-input-number
          style="width: 100%"
          v-model:value="model.planListForm[index].hours"
          size="small"
          :min="0"
          :max="model.workType == 1 ? 7.5 : 24"
        />
      </n-form-item>
      <n-form-item label="工作内容" path="workContent">
        <n-input
          v-model:value="model.workContent"
          type="textarea"
          placeholder="请输入工作内容"
        />
      </n-form-item>

      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <!-- <n-button
            :disabled="model.age === null"
            round
            type="primary"
            @click="handleValidateButtonClick"
          >
            验证
          </n-button> -->
          </div>
        </n-col>
      </n-row>
    </n-form>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
import { Account } from "@/app/api/account.ts";
import {
  useMessage,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NResult,
  NSelect,
  NDatePicker,
  NInputNumber,
} from "naive-ui";

export default defineComponent({
  components: {
    useMessage,
    NForm,
    NFormItem,
    NInput,
    NButton,
    NResult,
    NSelect,
    NDatePicker,
    NInputNumber,
  },
  props: {
    currentDate: {
      type: String,
      default: "",
    },
    workContent: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const formRef = ref(null);
    console.log(props);
    const { currentDate, workContent } = props;

    const rPasswordFormItemRef = ref(null);
    const projectList = ref([]); //项目列表
    const funList = ref([]); //功能列表
    const planList = ref([]); //计划列表
    const message = useMessage();
    console.log(currentDate);
    const modelRef = ref({
      workType: 1, //工作类型
      declareDate: currentDate, //申报日期
      projectName: null, // 项目名称
      funName: null, // 模块名称
      planListForm: [], //计划列表
      workContent: workContent,
    });
    function validatePasswordStartWith(rule, value) {
      return (
        !!modelRef.value.password &&
        modelRef.value.password.startsWith(value) &&
        modelRef.value.password.length >= value.length
      );
    }
    // 改变项目
    function changeProject(value) {
      modelRef.value.projectName = value;
      getFunModule(); // 获取功能列表
      getPlanContent(); // 获取计划列表
    }
    function validatePasswordSame(rule, value) {
      return value === modelRef.value.password;
    }
    const rules = {
      workType: [
        {
          required: true,
          message: "请选择工作类型",
        },
      ],
      declareDate: [
        {
          required: true,
          message: "请选择申报时间",
        },
      ],
      projectName: [
        {
          required: true,
          message: "请选择项目名称",
        },
      ],
      workContent: [
        {
          required: true,
          message: "请输入工作内容",
        },
      ],
    };
    console.log(modelRef.value.planListForm);
    // 获取项目列表
    async function getProjectName() {
      let data = {
        url: "http://192.168.0.12:8080/WDMS/ProjectDefineController/loadProjectByProgressNew",
        cookie: localStorage.getItem("sessionId"),
        method: "POST",
        data: {},
      };
      let res = await Account.Proxy(data);
      console.log(res);
      let datas = res.data;
      console.log(datas);

      if (datas.code === 100000) {
        projectList.value = datas.rtn.list.map((v) => ({
          label: v.projectName,
          value: v.id,
        }));
        if (projectList.value[0]) {
          modelRef.value.projectName = projectList.value[0].value;
        }
        getFunModule(); // 获取功能列表
        getPlanContent(); // 获取计划列表
      }
    }

    // 获取功能模块
    async function getFunModule() {
      let data = {
        url:
          "http://192.168.0.12:8080/WDMS/ProjectItemController/loadProjectItem?proId=" +
          modelRef.value.projectName,
        cookie: localStorage.getItem("sessionId"),
        method: "POST",
        data: {},
      };
      let res = await Account.Proxy(data);
      let datas = res.data;
      if (datas.code === 100000) {
        funList.value = datas.rtn.list.map((v) => ({
          label: v.itemName,
          value: v.itemId,
        }));
        //   优先考虑功能开发 如果不是功能开发 就默认给第一个
        if (funList.value[0]) {
          let label = "";
          funList.value.map((item) => {
            if (item.label === "功能开发") {
              modelRef.value.funName = item.value;
              label = item.label;
            }
          });
          if (label != "功能开发") {
            modelRef.value.funName = funList.value[0].value;
          }
        }
      }
    }

    // 获取计划内容
    async function getPlanContent() {
      let data = {
        url:
          "http://192.168.0.12:8080/WDMS/ProgressController/loadProjectProgressByProject?projectId=" +
          modelRef.value.projectName,
        cookie: localStorage.getItem("sessionId"),
        method: "POST",
        data: {},
      };
      let res = await Account.Proxy(data);
      let datas = res.data;
      if (datas.code === 100000) {
        planList.value = datas.rtn.list;
        let t = 0; //计算是否超过7.5
        console.log(planList.value);
        planList.value.map((item, index) => {
          if (Number(item.overtime) >= 7.5 && t == 0) {
            modelRef.value.planListForm[index] = {
              content: item.name,
              hours: 7.5,
              id: item.id,
            };
          } else {
            t = Number(t);
            if (t < 7.5) {
              let sh =
                Number(item.overtime) >= (7.5 - Number(t.toFixed(1))).toFixed(1)
                  ? (7.5 - Number(t.toFixed(1))).toFixed(1)
                  : Number(item.overtime).toFixed(1);
              modelRef.value.planListForm[index] = {
                content: item.name,
                hours: sh,
                id: item.id,
              };
            } else {
              modelRef.value.planListForm[index] = {
                content: item.name,
                hours: 0.0,
                id: item.id,
              };
            }
          }
          t += item.overtime.toFixed(1);
        });
      }
    }
    // 改变工作类型
    const changeWorkType = (type) => {
      if (type === 2) {
        modelRef.value.planListForm.map((item) => {
          item.hours = 0;
        });
      }
    };
    onMounted(() => {
      getProjectName();
    });

    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      changeWorkType,
      rules,
      funList,
      getProjectName,
      planList,
      changeProject,
      generalOptions: [
        { label: "正常工作", value: 1 },
        { label: "加班工作", value: 2 },
      ].map((v) => ({
        label: v.label,
        value: v.value,
      })),
      projectList,
      handlePasswordInput() {
        if (modelRef.value.reenteredPassword) {
          rPasswordFormItemRef.value?.validate({ trigger: "password-input" });
        }
      },
      handleValidateButtonClick() {
        // e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            message.success("验证成功");
            // context.emit('ok', 'sucess')
          } else {
            console.log(errors);
            message.error("验证失败");
          }
        });
      },
    };
  },
});
</script>
