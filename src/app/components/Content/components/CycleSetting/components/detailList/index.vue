<!--
 * @Author: zeHua
 * @Date: 2022-06-27 18:25:50
 * @LastEditors: zeHua
 * @LastEditTime: 2022-06-28 18:14:14
 * @FilePath: \sticky-notes\src\app\components\Content\components\CycleSetting\components\detailList\index.vue
-->
<template>
  <div class="daily">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item
        :title="
          item.wordType == 1
            ? item.projectName + '(正常工作)'
            : item.projectName + '(加班)'
        "
        :name="item.id"
        v-for="(item, index) of detailList"
      >
        <el-descriptions direction="vertical" :column="4" size="small" border>
          <el-descriptions-item label="姓名">{{
            item.staffName
          }}</el-descriptions-item>
          <el-descriptions-item label="工作类型">{{
            item.wordType == 1 ? "正常工作" : "加班"
          }}</el-descriptions-item>

          <el-descriptions-item label="功能名称">{{
            item.itemName
          }}</el-descriptions-item>
          <el-descriptions-item label="时长(h)">{{
            item.wordType == 1 ? item.workHour : item.workHourOverTime
          }}</el-descriptions-item>
          <el-descriptions-item label="申报日期">{{
            item.writeDate
          }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="4">
            {{ item.describe }}
          </el-descriptions-item>
          <el-descriptions-item label="操作">
            <!-- <el-button type="primary" :icon="Edit" circle /> -->
            <el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="取消"
              :icon="InfoFilled"
              @confirm="handleConfirmDelete(item)"
              icon-color="#626AEF"
              title="你确定要删除此日报吗?"
            >
              <template #reference>
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  @click="handleDeleteDaily(item)"
                />
              </template>
            </el-popconfirm>
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
    </el-collapse>
    <el-button type="danger" style="width: 100%" @click="handleBack"
      >返回</el-button
    >
  </div>
</template>
<script>
import { ref, defineComponent, onMounted } from "vue";
import { Account } from "@/app/api/account.ts";
import { Delete, Edit } from "@element-plus/icons-vue";

export default defineComponent({
  props: {
    currentDate: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const activeNames = ref(["1"]);
    const size = ref("samll");
    const detailList = ref([]);
    console.log(props);

    const getDateInfoList = async () => {
      let data = {
        url: "http://192.168.0.12:8080/WDMS/DailyController/loadDailyDataList",
        cookie: localStorage.getItem("sessionId"),
        method: "POST",
        data: {
          startDate: props.currentDate,
          endDate: props.currentDate,
          page: "1",
          rows: "10",
        },
      };
      let result = await Account.Proxy(data);
      detailList.value = result.data.rows;
    };

    const handleDeleteDaily = async () => {};

    const handleChange = (val) => {
      console.log(val);
    };
    // 删除
    const handleConfirmDelete = async (val) => {
      let data = {
        url: "http://192.168.0.12:8080/WDMS/DailyController/deleteDaily",
        cookie: localStorage.getItem("sessionId"),
        method: "POST",
        data: {
          id: "15170",
        },
      };
      let result = await Account.Proxy(data);
      console.log(result);
      detailList.value = result.data.rows;
      console.log(val);
    };
    const handleBack = () => {
      context.emit("cancel");
    };
    onMounted(() => {
      getDateInfoList();
    });
    return {
      handleChange,
      Delete,
      Edit,
      detailList,
      handleDeleteDaily,
      handleConfirmDelete,
      handleBack,
    };
  },
});
</script>

<style lang="less" scoped>
.daily {
  position: fixed;
  top: 40px;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: calc(100% - 40px);
  background-color: #fff;
}
.el-collapse-item__header {
  padding: 0 5px;
}
</style>
