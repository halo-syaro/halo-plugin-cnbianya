<script setup lang="ts">
// @ts-nocheck
import { ref, watch, h } from 'vue'
import Title from './Title.vue';
import { Table, Button, Input, Divider } from "ant-design-vue";
import { postDetail } from '../postDetail'

const dataSource = ref([])
const columns = [
  {
    title: '图片地址',
    dataIndex: 'img',
    key: 'img',
  },
  {
    title: '操作',
    key: 'action',
    width: 280,
  },
]

function handleAdd() {
  dataSource.value.push({ img: "", edit: true })
}

function inputBlur(data) {
  data.edit = false
}

function handleDel(index) {
  dataSource.value.splice(index, 1)
}

function handleMoveUp(index) {
  if (index > 0) {
    const temp = dataSource.value[index]
    dataSource.value[index] = dataSource.value[index - 1]
    dataSource.value[index - 1] = temp
  }
}

defineExpose({ dataSource })

watch(() => postDetail.value, (val) => {
  const data = val.metadata.annotations.banner
  dataSource.value = JSON.parse(data || '[]') || []
})
</script>

<template>
  <div>
    <Title title="轮播图">
      <Button @click="handleAdd">新增</Button>
    </Title>
    <Table :dataSource="dataSource" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'img'">
          <Input @blur="inputBlur(record)" v-if="record.edit" allow-clear v-model:value="record.img" placeholder="请输入图片地址"></Input>
          <div v-else>{{ record.img }}</div>
        </template>
        <template v-if="column.key === 'action'">
          <Button size="small" class="mr-2" type="primary" :disabled="record.edit" @click="record.edit = true">编辑</Button>
          <Button size="small" type="primary" danger @click="handleDel(index)">删除</Button>
          
          <Divider type="vertical" />

          <Button size="small" class="mr-2" @click="handleMoveUp(index)" :disabled="index === 0">上移</Button>
          <Button size="small" :disabled="index === (dataSource.length - 1)">下移</Button>
        </template>
      </template>
    </Table>
  </div>
</template>
