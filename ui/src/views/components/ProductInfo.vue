<script setup lang="ts">
// @ts-nocheck
import { ref, watch } from 'vue'
import Title from './Title.vue';
import { Table, Button, Input, Textarea, Form, FormItem } from "ant-design-vue";
import { postDetail } from '../postDetail'
import FileInput from '../common/FileInput.vue';

const data = ref({ desc: "", img: "" })

watch(() => postDetail.value, (val) => {
  const info = val.metadata.annotations.productInfo
  data.value = JSON.parse(info || '{}') || {}
})


defineExpose({ data })
</script>

<template>
  <div>
    <Title title="产品介绍"></Title>
    <Form layout="vertical">
      <FormItem label="文字描述">
        <Textarea v-model:value="data.desc" placeholder="请输入产品介绍文字描述" allow-clear :auto-size="{ minRows: 2, maxRows: 5 }"></Textarea>
      </FormItem>
      <FormItem label="图片地址">
        <!-- <Input v-model:value="data.img" placeholder="请输入图片地址" allow-clear></Input> -->
        <FileInput v-model:url="data.img" />
      </FormItem>
    </Form>
  </div>
</template>
