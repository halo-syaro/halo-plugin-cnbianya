<script setup lang="ts">
// @ts-nocheck
import { ref, watch, h } from "vue";
import Title from "./Title.vue";
import { Table, Button, Input, Divider } from "ant-design-vue";
import { postDetail } from "../postDetail";
import FileInput from "../common/FileInput.vue";

const props = defineProps({
  category: {
    type: Array,
    default: () => [],
  },
  cpzxid: {
    type: String,
    default: '',
  },
});

const dataSource = ref([]);
const columns = [
  {
    title: "分类",
    dataIndex: "label",
    key: "label",
  },
  {
    title: "排名",
    dataIndex: "rank",
    key: "rank",
  },
];

function getCategoryDataById(categoryId: string) {
  return props.category.find((item) => item.id === categoryId);
}

function generateTableDataSource(data: object) {
  const bindCategories = postDetail.value.spec.categories || [];
  const tableData = []
  bindCategories.map(ele => {
    const category = getCategoryDataById(ele)
    const obj = {
      label: category?.name,
      rankKey: category?.id,
      rank: ele === props.cpzxid ? postDetail.value.metadata.annotations.rank || null : data[category?.id] || null,
    }
    tableData.push(obj)
  })
  return tableData
}

function generateSubmitMap() {
  const map = {}
  dataSource.value.forEach(ele => {
    map[ele.rankKey] = ele.rank
  })
  return map
}

defineExpose({ generateSubmitMap });

watch(
  () => postDetail.value,
  (val) => {
    const data = JSON.parse(val.metadata.annotations.rankMap || '{}');
    dataSource.value = generateTableDataSource(data)
  },
);
</script>

<template>
  <div>
    <Title title="排名"></Title>
    <Table :dataSource="dataSource" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'label'">
          {{ record.label }}
        </template>
        <template v-if="column.key === 'rank'">
          <Input
            allow-clear
            v-model:value="record.rank"
            placeholder="请输入排名"
            type="number"
          ></Input>
        </template>
      </template>
    </Table>
  </div>
</template>
