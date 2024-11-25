<template>
  <div>
    <InputGroup compact>
      <Input
        allow-clear
        v-model:value="value"
        placeholder="请输入图片地址"
        style="width: calc(100% - 45px)" 
      ></Input>
      <Button style="height: 34px;" @click="handleOpenModal"><FolderOutlined /></Button>
    </InputGroup>

    <ChooseFile ref="chooseFileRef" />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref } from 'vue'
import { Input, InputGroup, Button } from "ant-design-vue";
import { FolderOutlined } from '@ant-design/icons-vue';
import ChooseFile from './ChooseFile.vue';

const value = defineModel('url')
const chooseFileRef = ref(null)

function handleOpenModal() {
  if (chooseFileRef.value) chooseFileRef.value.openModal()
}
</script>
