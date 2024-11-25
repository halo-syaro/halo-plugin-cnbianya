<template>
  <div>
    <Modal
      centered
      bodyStyle="height: 75vh"
      v-model:open="open"
      title="选择文件"
      width="1000px"
      class="choose-file-modal"
    >
      <Segmented v-model:value="currentGroup" :options="group">
        <template #label="{ payload = {} }">
          {{ payload.title }}
        </template>
      </Segmented>

      <Spin :spinning="loading">
        <div v-if="open" class="grid grid-cols-8 gap-2 overflow-y-auto" style="margin: 10px 0; height: calc(75vh - 100px)">
          <div v-for="item in fileList.items">
            <ShowFile
              @click="handleFileClick(item)"
              :item="item"
              :currentPermalink="currentPermalink"
              :key="item.metadata.name"
            />
          </div>
        </div>
        <div class="mt-[20px] flex items-center justify-between">
          <div>共 {{fileList.total}} 项数据</div>
          <Pagination
            :pageSize="size"
            v-model:current="page"
            show-quick-jumper
            :total="fileList.total"
            @change="onChange"
            :showSizeChanger="false"
          />
        </div>
      </Spin>

      <template #footer>
        <Button key="back" @click="handleCancel">取消</Button>
        <Button
          key="submit"
          type="primary"
          :loading="loading"
          :disabled="!currentPermalink.length"
          @click="handleOk"
          >确定</Button
        >
      </template>
    </Modal>
  </div>
</template>
<script setup lang="ts">
// @ts-nocheck
import { ref, watch } from "vue";
import { Modal, Segmented, Spin, Button, Pagination } from "ant-design-vue";
import { getGroups, getFileList } from "@/api/modules/file";
import ShowFile from "./ShowFile.vue";

const open = ref(false);
const page = ref(1);
const size = ref(64);
const loading = ref(false);
const fileList = ref({ page: page.value, size: size.value, items: [] });
const currentPermalink = ref("");

const emits = defineEmits(["chooseFile"]);

const group = ref([
  { value: "all", payload: { title: "全部" } },
  { value: "ungroup", payload: { title: "未分组" } },
]);
const currentGroup = ref("all");

async function openModal() {
  open.value = true;
  await handleGetGroups();
  await handleGetFileList();
}

async function handleGetGroups() {
  const res = await getGroups();
  group.value.splice(2);
  res.items.map((ele) => {
    group.value.push({
      value: ele.metadata.name,
      payload: { title: ele.spec.displayName },
    });
  });
}

async function handleGetFileList() {
  loading.value = true;
  let ungrouped = false;
  let fieldSelector = null;
  switch (currentGroup.value) {
    case "all":
      ungrouped = false;
      break;
    case "ungroup":
      ungrouped = true;
      break;
    default:
      ungrouped = false;
      fieldSelector = `spec.groupName=${currentGroup.value}`;
      break;
  }

  const res = await getFileList(page.value, size.value, ungrouped, fieldSelector).finally(
    () => (loading.value = false)
  );
  console.log("handleGetFileList", res);
  fileList.value = res;
}

function handleFileClick(data) {
  if (currentPermalink.value === data.status.permalink) {
    return (currentPermalink.value = "");
  }
  currentPermalink.value = data.status.permalink;
}

function handleCancel() {
  open.value = false;
  currentPermalink.value = "";
}

async function onChange(ppage, pageSize) {
  page.value = ppage;
  size.value = pageSize
  await handleGetFileList();
}

function handleOk() {
  emits("chooseFile", currentPermalink.value);
  open.value = false;
}

defineExpose({ openModal });

watch(
  () => currentGroup.value,
  () => {
    page.value = 1
    handleGetFileList();
  }
);
</script>


<style lang="scss" scoped>
.choose-file-modal .ant-spin-nested-loading {
  height: 90% !important;
  .ant-spin-container {
    height: 100% !important;
    overflow-y: auto;
  }
}
</style>
