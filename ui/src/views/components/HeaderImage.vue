<script setup lang="ts">
// @ts-nocheck
import { ref, watch } from 'vue'
import Title from './Title.vue';
import { Table, Button, Input, Textarea, Form, FormItem } from "ant-design-vue";
import { postDetail } from '../postDetail'
import FileInput from '../common/FileInput.vue';

const data = ref({ title1: "", title2: "", img: "" })

watch(() => postDetail.value, (val) => {
  const info = val.metadata.annotations.headerImage
  if (info) {
    const infoObj = JSON.parse(info || '{}') || {}
    for (const key in infoObj) {
      if (infoObj.hasOwnProperty(key)) {
        data.value[key] = infoObj[key]
      }
    }
  }
})


defineExpose({ data })
</script>

<template>
  <div>
    <Title title="头图"></Title>
    <div class="flex gap-4">
      <FormItem label="标题">
        <Input allow-clear v-model:value="data.title1" placeholder="标题" />
      </FormItem>
      <FormItem label="副标题">
        <Input allow-clear v-model:value="data.title2" placeholder="副标题" />
      </FormItem>
    </div>
    <div>
      <FormItem label="背景图片">
        <FileInput v-model:url="data.img"></FileInput>
      </FormItem>
    </div>
  </div>
</template>
