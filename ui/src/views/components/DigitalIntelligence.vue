<script setup lang="ts">
// @ts-nocheck
import { ref, watch, h } from "vue";
import Title from "./Title.vue";
import {Table, Button, Input, Divider, FormItem} from "ant-design-vue";
import { postDetail } from "../postDetail";
import FileInput from "../common/FileInput.vue";

const left = ref({ title: "", img: "", alt: "" })
const right = ref({
  title: "",
  subtitle: "",
  data: []
});

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
  if (!right.value?.data) right.value.data = []
  right.value.data.push({ img: "", title: "", alt: "" });
}

function handleDel(index) {
  right.value.data.splice(index, 1);
}

function handleMoveUp(index) {
  if (index > 0) {
    const temp = right.value.data[index];
    right.value.data[index] = right.value.data[index - 1];
    right.value.data[index - 1] = temp;
  }
}

function handleMoveDown(index) {
  if (index < right.value.data.length - 1) {
    const temp = right.value.data[index];
    right.value.data[index] = right.value.data[index + 1];
    right.value.data[index + 1] = temp;
  }
}

defineExpose({ 
  data: () => {
    return { left: left.value, right: right.value }
  }
});

watch(
  () => postDetail.value,
  (val) => {
    const data = val.metadata.annotations.digitalIntelligence;
    const objData = JSON.parse(data || "{}") || {};
    left.value = objData.left || {}
    right.value = objData.right || { data: [] }
  }
);
</script>

<template>
  <div>
    <Title title="Digital Intelligence & Manufacturing Excellence"></Title>
    <Title title="左侧" :leave="2"></Title>
    <div>
      <FormItem label="标题">
        <Input allow-clear v-model:value="left.title" placeholder="请输入标题" />
      </FormItem>
      <FormItem label="图片">
        <FileInput v-model:url="left.img"></FileInput>
      </FormItem>
      <FormItem label="图片描述">
        <Input allow-clear v-model:value="left.alt" placeholder="请输入图片描述" />
      </FormItem>
    </div>
    <Title title="右侧" :leave="2" tip="共5条数据">
      <Button @click="handleAdd">新增</Button>
    </Title>
    <div>
      <FormItem label="标题">
        <Input allow-clear v-model:value="right.title" placeholder="请输入标题" />
      </FormItem>
      <FormItem label="副标题">
        <Input allow-clear v-model:value="right.subtitle" placeholder="请输入副标题" />
      </FormItem>
    </div>
    <Table :dataSource="right.data" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'img'">
          <FileInput v-model:url="record.img"></FileInput>
        </template>
        <template v-if="column.key === 'title'">
          <Input
            allow-clear
            v-model:value="record.title"
            placeholder="请输入标题"
          ></Input>
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
          <Button @click="handleMoveDown(index)" size="small" :disabled="index === right.data.length - 1">下移</Button>
        </template>
      </template>
    </Table>
  </div>
</template>
