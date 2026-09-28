<script setup lang="ts">
// @ts-nocheck
import { ref, watch } from 'vue'
import Title from './Title.vue';
import { Table, Button, Input, Textarea, Form, FormItem } from "ant-design-vue";
import { postDetail } from '../postDetail'
import FileInput from '../common/FileInput.vue';

const data = ref({ title1: "", title2: "", img: "", alt: "" })

watch(() => postDetail.value, (val) => {
  const info = val.metadata.annotations.headerImage
  const infoObj = JSON.parse(info || '{}') || {}
  data.value = { title1: "", title2: "", img: "", alt: "", ...infoObj }
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
      <FormItem label="图片Alt">
        <Input allow-clear v-model:value="data.alt" placeholder="请输入图片Alt" />
      </FormItem>
    </div>
  </div>
</template>
