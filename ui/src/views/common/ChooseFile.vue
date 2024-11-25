<template>
  <div>
    <Modal centered bodyStyle="height: 75vh" v-model:open="open" title="选择文件" width="1000px">
      <Segmented v-model:value="currentGroup" :options="group">
        <template #label="{ payload = {} }">
          {{ payload.title }}
        </template>
      </Segmented>
      
      <Spin :spinning="loading">
        <div v-if="open" class="grid grid-cols-8 gap-2" style="margin: 10px 0;">
          <div v-for="item in fileList.items">
            <ShowFile :item="item" :key="item.metadata.name" />
          </div>
        </div>
      </Spin>
    </Modal>
  </div>
</template>
<script setup lang="ts">
// @ts-nocheck
import { ref, watch } from 'vue'
import { Modal, Segmented, Spin } from 'ant-design-vue';
import { getGroups, getFileList } from '@/api/modules/file'
import ShowFile from './ShowFile.vue';

const open = ref(false)
const page = ref(1)
const size = ref(60)
const loading = ref(false)
const fileList = ref({ page: page.value, size: size.value, items: [] })

const group = ref([
  { value: 'all', payload: { title: "全部" } },
  { value: 'ungroup', payload: { title: "未分组" } }
])
const currentGroup = ref('all')

async function openModal() {
  open.value = true
  await handleGetGroups()
  await handleGetFileList()
}

async function handleGetGroups() {
  const res = await getGroups()
  group.value.splice(2)
  res.items.map(ele => {
    group.value.push({ value: ele.metadata.name, payload: { title: ele.spec.displayName }})
  })
}

async function handleGetFileList() {
  loading.value = true
  let ungrouped = false
  let fieldSelector = null
  switch (currentGroup.value) {
    case 'all':
      ungrouped = false
      break;
    case 'ungroup':
      ungrouped = true
      break;
    default:
      ungrouped = false
      fieldSelector = `spec.groupName=${currentGroup.value}`
      break;
  }

  const res = await getFileList(page.value, size.value, ungrouped, fieldSelector).finally(() => loading.value = false)
  console.log('handleGetFileList', res)
  fileList.value = res
}

defineExpose({ openModal })

watch(() => currentGroup.value, () => {
  handleGetFileList()
})
</script>
