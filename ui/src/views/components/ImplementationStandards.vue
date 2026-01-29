<script setup lang="ts">
// @ts-nocheck
import { ref, watch, h } from "vue";
import Title from "./Title.vue";
import { Table, Button, Input, Divider } from "ant-design-vue";
import { postDetail } from "../postDetail";
import FileInput from "../common/FileInput.vue";

const dataSource = ref([]);

const columns = [
  {
    title: "标准编号",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "标准名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "操作",
    key: "action",
    width: 280,
  },
];

function handleAdd() {
  dataSource.value.push({ id: "", name: "" });
}


function handleDel(index) {
  dataSource.value.splice(index, 1);
}

function handleMoveUp(index) {
  if (index > 0) {
    const temp = dataSource.value[index];
    dataSource.value[index] = dataSource.value[index - 1];
    dataSource.value[index - 1] = temp;
  }
}

function handleMoveDown(index) {
  if (index < dataSource.value.length - 1) {
    const temp = dataSource.value[index];
    dataSource.value[index] = dataSource.value[index + 1];
    dataSource.value[index + 1] = temp;
  }
}

defineExpose({ dataSource });

watch(
  () => postDetail.value,
  (val) => {
    const data = val.metadata.annotations.implementationStandards;
    dataSource.value = JSON.parse(data || "[]") || [];
  }
);
</script>

<template>
  <div>
    <Title title="执行标准" tip="最佳4条数据" :tipType="1">
      <Button @click="handleAdd">新增</Button>
    </Title>
    <Table :dataSource="dataSource" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'id'">
          <Input
            allow-clear
            v-model:value="record.id"
          ></Input>
        </template>
        <template v-if="column.key === 'name'">
          <Input
            allow-clear
            v-model:value="record.name"
          ></Input>
        </template>
        <template v-if="column.key === 'action'">
          <Button size="small" type="primary" danger @click="handleDel(index)"
            >删除</Button
          >

          <Divider type="vertical" />

          <Button
            size="small"
            class="mr-2"
            @click="handleMoveUp(index)"
            :disabled="index === 0"
            >上移</Button
          >
          <Button @click="handleMoveDown(index)" size="small" :disabled="index === dataSource.length - 1">下移</Button>
        </template>
      </template>
    </Table>
  </div>
</template>
