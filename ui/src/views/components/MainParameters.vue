<script setup lang="ts">
// @ts-nocheck
import { ref, watch, h } from "vue";
import Title from "./Title.vue";
import { Table, Button, Input, Divider } from "ant-design-vue";
import { postDetail } from "../postDetail";

const dataSource = ref([]);
const imgData = ref([])

const columns = [
  {
    title: "参数名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "参数值",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "操作",
    key: "action",
    width: 280,
  },
];

function handleAdd() {
  dataSource.value.push({ name: "", value: "", edit: true });
}

function inputBlur(data) {
  data.edit = false;
}

function inputFocus(data) {
  data.edit = true;
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
    const data = val.metadata.annotations.mainParameters;
    dataSource.value = JSON.parse(data || "[]") || [];
  }
);
</script>

<template>
  <div>
    <Title title="主要参数">
      <Button @click="handleAdd">新增</Button>
    </Title>
    <Table :dataSource="dataSource" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'name'">
          <Input
            @focus="inputFocus(record)"
            @blur="inputBlur(record)"
            v-if="record.edit"
            allow-clear
            v-model:value="record.name"
            placeholder="请输入参数名"
          ></Input>
          <div v-else>{{ record.name }}</div>
        </template>
        <template v-if="column.key === 'value'">
          <Input
            @focus="inputFocus(record)"
            @blur="inputBlur(record)"
            v-if="record.edit"
            allow-clear
            v-model:value="record.value"
            placeholder="请输入参数值"
          ></Input>
          <div v-else>{{ record.value }}</div>
        </template>
        <template v-if="column.key === 'action'">
          <Button
            size="small"
            class="mr-2"
            type="primary"
            :disabled="record.edit"
            @click="record.edit = true"
            >编辑</Button
          >
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
    <div class="mt-[20px]">
      askdl;akdl;akl;a
    </div>
  </div>
</template>
