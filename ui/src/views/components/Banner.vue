<script setup lang="ts">
// @ts-nocheck
import { ref } from 'vue'
import Title from './Title.vue';
import { Table, Button } from "ant-design-vue";

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
  },
]

</script>

<template>
  <div>
    <Title title="轮播图">
      <Button>新增</Button>
    </Title>
    <Table :dataSource="dataSource" :columns="columns" />
  </div>
</template>


