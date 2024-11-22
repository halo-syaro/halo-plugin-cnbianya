<script setup lang="ts">
// @ts-nocheck
import { ref, watch, h } from "vue";
import Title from "./Title.vue";
import { Table, Button, Input, Divider } from "ant-design-vue";
import { postDetail } from "../postDetail";

const dataSource = ref([]);
const columns = [
  {
    title: "图片地址",
    dataIndex: "img",
    key: "img",
  },
  {
    title: "标题",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "文字描述",
    dataIndex: "desc",
    key: "desc",
  },
  {
    title: "操作",
    key: "action",
    width: 280,
  },
];

function handleAdd() {
  dataSource.value.push({ desc: "", edit: true });
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
    const data = val.metadata.annotations.productFeatures;
    dataSource.value = JSON.parse(data || "[]") || [];
  }
);
</script>

<template>
  <div>
    <Title title="产品特点">
      <Button @click="handleAdd">新增</Button>
    </Title>
    <Table :dataSource="dataSource" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'img'">
          <Input
            @focus="inputFocus(record)"
            @blur="inputBlur(record)"
            v-if="record.edit"
            allow-clear
            v-model:value="record.img"
            placeholder="请输入图片地址"
          ></Input>
          <div v-else>{{ record.img }}</div>
        </template>
        <template v-if="column.key === 'title'">
          <Input
            @focus="inputFocus(record)"
            @blur="inputBlur(record)"
            v-if="record.edit"
            allow-clear
            v-model:value="record.title"
            placeholder="请输入标题"
          ></Input>
          <div v-else>{{ record.title }}</div>
        </template>
        <template v-if="column.key === 'desc'">
          <Input
            @focus="inputFocus(record)"
            @blur="inputBlur(record)"
            v-if="record.edit"
            allow-clear
            v-model:value="record.desc"
            placeholder="请输入描述"
          ></Input>
          <div v-else>{{ record.desc }}</div>
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
  </div>
</template>
