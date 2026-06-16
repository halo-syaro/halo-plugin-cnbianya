<template>
  <div class="flex justify-between title items-center">
    <div class="flex items-center gap-2">
      <h1 v-if="leave == 1">{{ title }}</h1>
      <h2 v-if="leave == 2">{{title}}</h2>
      <Tag v-if="tip" :color="tagColor">{{ tip }}</Tag>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Tag } from "ant-design-vue";
const props = defineProps({
  title: { type: String, default: "" },
  tip: { type: String, default: "" },
  tipType: { type: Number, default: 0 },
  leave: { type: Number, default: 1 },
})

const tagColorMap = {
  0: "#ff4d50",
  1: "#1677ff"
}

// @ts-ignore
const tagColor = computed(() => tagColorMap[props.tipType])
</script>

<style lang="scss" scoped>
.title {
  font-size: 18px;
  padding-bottom: 5px;
  border-bottom: 1px solid #f1f1f1;
  margin-bottom: 10px;
  font-weight: bold;
}
h2 {
  font-weight: normal;
  font-size: 16px;
}
</style>
