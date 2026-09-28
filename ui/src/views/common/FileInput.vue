<template>
  <div>
    <InputGroup compact>
      <Input
        allow-clear
        v-model:value="value"
        :placeholder="placeholder"
        style="width: calc(100% - 45px)"
      ></Input>
      <Button style="height: 34px;" @click="handleOpenModal"><FolderOutlined /></Button>
    </InputGroup>

    <ChooseFile ref="chooseFileRef" @chooseFile="handleChooseFile" />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref } from 'vue'
import { Input, InputGroup, Button } from "ant-design-vue";
import { FolderOutlined } from '@ant-design/icons-vue';
import ChooseFile from './ChooseFile.vue';

defineProps({
  placeholder: {
    type: String,
    default: '请输入图片地址'
  }
})

const value = defineModel('url')
const chooseFileRef = ref(null)

function handleOpenModal() {
  if (chooseFileRef.value) chooseFileRef.value.openModal()
}

function handleChooseFile(url) {
  value.value = url
}
</script>
