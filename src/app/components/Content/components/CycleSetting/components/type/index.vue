<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="small">
    <n-form-item path="workType" label="工作类型">
      <n-select
        v-model:value="model.workType"
        placeholder="Select"
        :options="generalOptions"
      />
    </n-form-item>
    <n-form-item path="declareDate" label="申报日期">
      <n-date-picker
        type="date"
        v-model:value="model.declareDate"
        :actions="['now']"
        :default-value="Date.now()"
        style="width: 100%"
      />
    </n-form-item>
    <n-form-item path="projectName" label="项目名称">
      <n-select
        v-model:value="model.projectName"
        placeholder="Select"
        @change="changeProject"
        :options="projectList"
      />
    </n-form-item>
    <n-form-item path="funName" label="功能模块">
      <n-select
        v-model:value="model.funName"
        placeholder="Select"
        :options="funList"
      />
    </n-form-item>
    <n-form-item
      path="funName"
      :label="item.name"
      v-for="(item, index) of planList"
      :key="index"
    >
      <n-input-number
        v-model:value="value"
        size="small"
        :min="0"
        :max="item.overtime"
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
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
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
} from 'naive-ui'

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
  setup(props, context) {
    const formRef = ref(null)
    const rPasswordFormItemRef = ref(null)
    const projectList = ref([]) //项目列表
    const funList = ref([]) //功能列表
    const planList = ref([]) //计划列表
    const message = useMessage()
    const modelRef = ref({
      workType: 1, //工作类型
      declareDate: new Date(), //申报日期
      projectName: null, // 项目名称
      funName: null, // 模块名称
    })
    function validatePasswordStartWith(rule, value) {
      return (
        !!modelRef.value.password &&
        modelRef.value.password.startsWith(value) &&
        modelRef.value.password.length >= value.length
      )
    }
    // 改变项目
    function changeProject(value) {
      modelRef.value.projectName = value
      getFunModule() // 获取功能列表
      getPlanContent() // 获取计划列表
    }
    function validatePasswordSame(rule, value) {
      return value === modelRef.value.password
    }
    const rules = {
      workType: [
        {
          required: true,
          message: '请选择工作类型',
        },
      ],
      declareDate: [
        {
          required: true,
          message: '请选择申报时间',
        },
      ],
      projectName: [
        {
          required: true,
          message: '请选择项目名称',
        },
      ],
    }
    // 获取项目列表
    function getProjectName() {
      let data = {
        url: 'http://192.168.0.12:8080/WDMS/ProjectDefineController/loadProjectByProgressNew',
        cookie: localStorage.getItem('sessionId'),
        method: 'POST',
        data: {},
      }
      axios.post('http://192.168.0.83:5000/proxy', data).then(res => {
        let datas = res.data.data
        if (datas.code === 100000) {
          projectList.value = datas.rtn.list.map(v => ({
            label: v.projectName,
            value: v.id,
          }))
          if (projectList.value[0]) {
            modelRef.value.projectName = projectList.value[0].value
          }
          getFunModule() // 获取功能列表
          getPlanContent() // 获取计划列表
        }
      })
    }

    // 获取功能模块
    function getFunModule() {
      let data = {
        url: 'http://192.168.0.12:8080/WDMS/ProjectItemController/loadProjectItem',
        cookie: localStorage.getItem('sessionId'),
        method: 'POST',
        data: {
          proId: modelRef.value.projectName,
        },
      }
      axios.post('http://192.168.0.83:5000/proxy', data).then(res => {
        console.log(res)
        let datas = res.data.data
        if (datas.code === 100000) {
          funList.value = datas.rtn.list.map(v => ({
            label: v.itemName,
            value: v.itemId,
          }))
          if (funList.value[0]) {
            modelRef.value.funName = 18
          }
        }
      })
    }

    // 获取计划内容
    function getPlanContent() {
      let data = {
        url: 'http://192.168.0.12:8080/WDMS/ProgressController/loadProjectProgressByProject?projectId=5',
        cookie: localStorage.getItem('sessionId'),
        method: 'POST',
        data: {
          projectId: modelRef.value.projectName,
        },
      }
      axios.post('http://192.168.0.83:5000/proxy', data).then(res => {
        console.log(res)
        let datas = res.data.data
        if (datas.code === 100000) {
          planList.value = datas.rtn.list
        }
      })
    }
    console.log('hello world')

    onMounted(() => {
      getProjectName()
    })

    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      funList,
      planList,
      changeProject,
      generalOptions: [
        { label: '正常工作', value: 1 },
        { label: '加班工作', value: 2 },
      ].map(v => ({
        label: v.label,
        value: v.value,
      })),
      projectList: [
        { label: '正常工作', value: 1 },
        { label: '加班工作', value: 2 },
      ],
      handlePasswordInput() {
        if (modelRef.value.reenteredPassword) {
          rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
        }
      },
      handleValidateButtonClick() {
        // e.preventDefault()
        formRef.value?.validate(errors => {
          if (!errors) {
            message.success('验证成功')
            // context.emit('ok', 'sucess')
          } else {
            console.log(errors)
            message.error('验证失败')
          }
        })
      },
    }
  },
})
</script>
