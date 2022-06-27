<!--
 * @Author: zeHua
 * @Date: 2022-06-27 18:25:50
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-27 20:56:29
 * @FilePath: /wintao/wintao-daily/src/app/components/Content/components/CycleSetting/components/detailList/index.vue
-->
<template>
  <div class="daily">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title=" IDMP智慧数字管理平台(3.5h)" name="1">
        <el-descriptions direction="vertical" :column="4" size="small" border>
          <el-descriptions-item label="姓名">陈泽华</el-descriptions-item>
          <el-descriptions-item label="功能名称">功能开发</el-descriptions-item>
          <el-descriptions-item label="时长(h)">7.5</el-descriptions-item>
          <el-descriptions-item label="申报日期"
            >2022-06-01</el-descriptions-item
          >
          <el-descriptions-item label="备注" :span="4">
            No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
          </el-descriptions-item>
          <el-descriptions-item label="操作">
            <el-button type="primary" :icon="Edit" circle />
            <el-button type="danger" :icon="Delete" circle />
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
      <el-collapse-item title="Feedback" name="2">
        <div>
          Operation feedback: enable the users to clearly perceive their
          operations by style updates and interactive effects;
        </div>
        <div>
          Visual feedback: reflect current state by updating or rearranging
          elements of the page.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Efficiency" name="3">
        <div>
          Simplify the process: keep operating process simple and intuitive;
        </div>
        <div>
          Definite and clear: enunciate your intentions clearly so that the
          users can quickly understand and make decisions;
        </div>
        <div>
          Easy to identify: the interface should be straightforward, which helps
          the users to identify and frees them from memorizing and recalling.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Controllability" name="4">
        <div>
          Decision making: giving advices about operations is acceptable, but do
          not make decisions for the users;
        </div>
        <div>
          Controlled consequences: users should be granted the freedom to
          operate, including canceling, aborting or terminating current
          operation.
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'
const activeNames = ref(['1'])
const size = ref('samll')

const handleChange = (val: string[]) => {
  console.log(val)
}
</script>

<style lang="less" scoped>
.daily {
  position: fixed;
  top: 40px;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: calc(100% - 40px);
  border: 1px solid red;
  background-color: #fff;
}
</style>
