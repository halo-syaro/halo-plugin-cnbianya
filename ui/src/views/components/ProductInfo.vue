<script setup lang="ts">
// @ts-nocheck
import { ref, watch } from 'vue'
import Title from './Title.vue';
import { Table, Button, Input, Textarea, Form, FormItem } from "ant-design-vue";
import { postDetail } from '../postDetail'
import FileInput from '../common/FileInput.vue';

const data = ref({ title1: "", title2: "", desc: "", img: "", downloadUrl: "" })

watch(() => postDetail.value, (val) => {
  const info = val.metadata.annotations.productInfo
  const infoObj = JSON.parse(info || '{}') || {}
  data.value = { title1: "", title2: "", desc: "", img: "", downloadUrl: "", ...infoObj }
})


defineExpose({ data })
</script>

<template>
  <div>
    <Title title="产品介绍"></Title>
    <div class="flex gap-4">
      <FormItem label="前标题">
        <Input allow-clear v-model:value="data.title1" placeholder="前标题" />
      </FormItem>
      <FormItem label="后标题">
        <Input allow-clear v-model:value="data.title2" placeholder="后标题" />
      </FormItem>
    </div>
    <Form layout="vertical">
      <FormItem label="文字描述">
        <Textarea v-model:value="data.desc" placeholder="请输入产品介绍文字描述" allow-clear :auto-size="{ minRows: 2, maxRows: 5 }"></Textarea>
      </FormItem>
      <FormItem label="下载链接">
        <FileInput v-model:url="data.downloadUrl" placeholder="请输入下载链接" />
      </FormItem>
      <!-- <FormItem label="图片地址">
        <FileInput v-model:url="data.img" />
      </FormItem> -->
    </Form>
  </div>
</template>
