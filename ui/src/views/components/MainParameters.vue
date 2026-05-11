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
    title: "图片",
    dataIndex: "img",
    key: "img",
  },
  {
    title: "图片Alt",
    dataIndex: "alt",
    key: "alt",
  },
  {
    title: "操作",
    key: "action",
    width: 280,
  },
];

function handleAdd() {
  dataSource.value.push({ name: "", value: "", img: "", alt: "" });
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
    <Title title="主要参数" tip="最佳4条数据" :tipType="1">
      <Button @click="handleAdd">新增</Button>
    </Title>
    <Table :dataSource="dataSource" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'name'">
          <Input
            allow-clear
            v-model:value="record.name"
            placeholder="请输入参数名"
          ></Input>
        </template>
        <template v-if="column.key === 'value'">
          <Input
            allow-clear
            v-model:value="record.value"
            placeholder="请输入参数值"
          ></Input>
        </template>
        <template v-if="column.key === 'img'">
          <FileInput v-model:url="record.img"></FileInput>
        </template>
        <template v-if="column.key === 'alt'">
          <Input
            allow-clear
            v-model:value="record.alt"
            placeholder="请输入图片Alt"
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
