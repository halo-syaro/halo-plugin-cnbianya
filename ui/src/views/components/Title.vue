<template>
  <div class="flex justify-between title items-center">
    <h1>{{ title }}模块</h1>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: "" }
})
</script>

<style lang="scss" scoped>
.title {
  font-size: 18px;
  padding-bottom: 5px;
  border-bottom: 1px solid #f1f1f1;
  margin-bottom: 10px;
  font-weight: bold;
}
</style>
