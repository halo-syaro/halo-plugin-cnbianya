<script setup lang="ts">
// @ts-nocheck
import dayjs from "dayjs";
import { ref, computed } from "vue";
import {
  Card,
  Table,
  Tag,
  Pagination,
  ConfigProvider,
  Button,
  Input,
  Modal,
  Drawer,
  Divider,
  Typography,
  TypographyTitle
} from "ant-design-vue";
import { getPost, getPostDetail, updatePostDetail } from "@/api/modules/post";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import Banner from "./components/Banner.vue";

const modal = ref(false);
const loading = ref(false);
const editInfo = ref({})
const postDetail = ref({})
const dataSource = ref({ items: [], total: 0 });
const columns = [
  {
    title: "标题",
    dataIndex: ["post", "spec", "title"],
    key: "title",
  },
  {
    title: "分类",
    key: "categories",
  },
  {
    title: "发布时间",
    dataIndex: ["post", "spec", "publishTime"],
    key: "publishTime",
  },
  {
    title: "操作",
    key: "action",
  },
];
const searchParams = ref({ keyword: "", page: 1, size: 10 });

function getData() {
  loading.value = true;
  getPost(searchParams.value)
    .then((result) => {
      console.log("getPost", result);
      dataSource.value = result;
    })
    .finally(() => (loading.value = false));
}

function onChange(page: number, pageSize: number) {
  searchParams.value.page = page;
  searchParams.value.size = pageSize;
  getData();
}

async function handleOpenModal(data: any) {
  modal.value = true;
  editInfo.value = data;
  console.log("editInfo", editInfo.value);
  postDetail.value = await getPostDetail(editInfo.value.post.metadata.name);
  console.log('postDetail', postDetail.value)
}

async function handleUpdatePostDetail() {
  console.log('123', postDetail.value)
  const res = await updatePostDetail(editInfo.value.post.metadata.name, postDetail.value)
  // console.log('handleUpdatePostDetail', res)
}

const drawerTitle = computed(() => {
  // @ts-ignore
  return editInfo.value?.post?.spec?.title
})

getData();
</script>

<template>
  <div>
    <div class="flex items-center justify-between bg-white p-4 h-14">
      <h2 class="flex items-center truncate text-xl font-bold text-gray-800">
        产品详情页数据配置
      </h2>
    </div>

    <div class="m-0 md:m-4">
      <ConfigProvider :locale="zhCN">
        <Card>
          <template #extra>
            <div class="flex">
              <Input
                allow-clear
                v-model:value="searchParams.keyword"
                placeholder="请输入关键字搜索"
              ></Input>
              <Button class="ml-[10px]" type="primary" @click="getData"
                >搜索</Button
              >
            </div>
          </template>
          <Table
            :dataSource="dataSource.items"
            :columns="columns"
            :pagination="false"
            :loading="loading"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'publishTime'">
                <template v-if="record.post.spec.publish">
                  {{
                    dayjs(record.post.spec.publishTime).format(
                      "YYYY-MM-DD HH:mm",
                    )
                  }}
                </template>
                <template v-else> 未发布 </template>
              </template>
              <template v-if="column.key === 'categories'">
                <Tag
                  color="default"
                  v-for="(item, index) in record.categories"
                  :key="index"
                  >{{ item.spec.displayName }}</Tag
                >
              </template>
              <template v-if="column.key === 'action'">
                <Button
                  type="primary"
                  size="small"
                  @click="handleOpenModal(record)"
                  >编辑</Button
                >
              </template>
            </template>
          </Table>

          <div class="mt-[20px] flex justify-end items-center">
            <Pagination
              :show-total="(total: number) => `共 ${total} 条`"
              :pageSize="searchParams.size"
              v-model:current="searchParams.page"
              show-quick-jumper
              :total="dataSource.total"
              @change="onChange"
            />
          </div>
        </Card>

        <Drawer
          v-model:open="modal"
          :title="drawerTitle"
          placement="left"
          width="800px"
          rootClassName="full-modal"
          :maskClosable="false"
        >
          <template #extra>
            <Button type="default" class="mr-[8px]">关闭</Button>
            <Button type="primary" @click="handleUpdatePostDetail">提交</Button>
          </template>

          <Banner />
        </Drawer>
      </ConfigProvider>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url("../output.css");
:deep(span[role="img"]) {
  vertical-align: text-bottom;
}

:deep(.ant-btn-primary) {
  color: #fff;
  background-color: #1677ff;
  box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
}

:deep(.ant-input) {
  box-sizing: border-box;
  margin: 0;
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  background-color: #ffffff;
  background-image: none;
  border-width: 1px;
  border-style: solid;
  border-color: #d9d9d9;
  border-radius: 6px;
  transition: all 0.2s;
}

:deep(.ant-btn) {
  font-size: 14px;
  height: 32px;
  padding: 4px 15px;
  border-radius: 6px;
}

:deep(.ant-btn.ant-btn-sm) {
  font-size: 14px;
  height: 24px;
  padding: 0px 7px;
  border-radius: 4px;
}

:deep(.ant-input-affix-wrapper) {
  position: relative;
  display: inline-flex;
  width: 100%;
  min-width: 0;
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  line-height: 1.5714285714285714;
  background-color: #ffffff;
  background-image: none;
  border-width: 1px;
  border-style: solid;
  border-color: #d9d9d9;
  border-radius: 6px;
  transition: all 0.2s;
}
</style>

<style lang="scss">
.full-modal .ant-drawer-content-wrapper {
  .ant-btn {
    font-size: 14px;
    height: 32px;
    padding: 4px 15px;
    border-radius: 6px;
  }

  .ant-btn-default {
    background-color: #ffffff;
    border-color: #d9d9d9;
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
    border: 1px solid #d9d9d9;
  }

  .ant-btn-primary {
    color: #fff;
    background-color: #1677ff;
    box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
  }
}
</style>
