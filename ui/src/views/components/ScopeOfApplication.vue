<script setup lang="ts">
// @ts-nocheck
import { ref, watch } from 'vue'
import Title from './Title.vue';
import { Table, Button, Input, Textarea, Form, FormItem } from "ant-design-vue";
import { postDetail } from '../postDetail'

const data = ref({ desc: "" })

watch(() => postDetail.value, (val) => {
  const info = val.metadata.annotations.scopeOfApplication
  data.value = JSON.parse(info || '{}') || {}
})


defineExpose({ data })
</script>

<template>
  <div>
    <Title title="适用范围"></Title>
    <Form layout="vertical">
      <FormItem label="文字描述">
        <Textarea v-model:value="data.desc" placeholder="请输入适用范围文字描述" allow-clear :auto-size="{ minRows: 2, maxRows: 5 }"></Textarea>
      </FormItem>
    </Form>
  </div>
</template>
