<template>
  <div class="item" :class="isCurrent ? 'current' : ''">
    <div class="img">
      <img class="w-full h-full object-cover" v-if="isImage" :src="item.status.permalink" />
      <AttachmentFileTypeIcon v-else :fileName="item.spec.displayName" />
    </div>
    <div class="name line-clamp-1 w-full text-center">{{ item.spec.displayName }}</div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  item: { type: Object, default: () => ({}) },
  currentPermalink: { type: String, default: '' }
})

const isImage = computed(() => {
  return props.item.spec.mediaType.startsWith('image')
})

const isCurrent = computed(() => {
  return props.currentPermalink === props.item.status.permalink
})
</script>
<style scoped lang="scss">
.item {
  width: 100%;
  // height: 100%;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  // &:hover {
  //   border-color: #1890ff;
  // }

  .name {
    background-color: #FFF;
    font-size: 12px;
    margin: 8px 0;
    padding: 0 4px;
  }

  .img {
    height: 90px;
    width: 100%;
    background-color: #f8f8fa
  }

  &.current {
    border: 1px solid #1890ff;
  }
}
</style>
