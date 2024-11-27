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
  TypographyTitle,
  Spin,
  Select,
  SelectOption
} from "ant-design-vue";
import { getPost, getPostDetail, updatePostDetail } from "@/api/modules/post";
import { getCategory } from "@/api/modules/categories";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { postDetail } from './postDetail'
import { LinkOutlined } from '@ant-design/icons-vue'

import Banner from "./components/Banner.vue";
import ProductInfo from "./components/ProductInfo.vue";
import ScopeOfApplication from "./components/ScopeOfApplication.vue";
import ProductDescription from "./components/ProductDescription.vue";
import ProductFeatures from "./components/ProductFeatures.vue";
import MainParameters from "./components/MainParameters.vue";
import MainParametersImage from "./components/MainParametersImage.vue";
import ImplementationStandards from "./components/ImplementationStandards.vue";
import TechnicalAdvantages from "./components/TechnicalAdvantages.vue";

const bannerRef = ref(null)
const productInfoRef = ref(null)
const scopeOfApplicationRef = ref(null)
const productDescriptionRef = ref(null)
const productFeaturesRef = ref(null)
const mainParametersRef = ref(null)
const mainParametersImageRef = ref(null)
const implementationStandardsRef = ref(null)
const technicalAdvantagesRef = ref(null)

const modal = ref(false);
const loading = ref(false);
const editInfo = ref({})
const dataSource = ref({ items: [], total: 0 });
const category = ref([])
const categoryId = ref(null)
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

async function getData() {
  loading.value = true;
  const obj = searchParams.value
  if (categoryId.value) obj.fieldSelector = `spec.categories=${categoryId.value}`
  await getPost(obj)
    .then((result) => {
      dataSource.value = result;
    }).finally(() => loading.value = false)
}

function handleSearch() {
  searchParams.value.page = 1
  getData();
}

function onChange(page: number, pageSize: number) {
  searchParams.value.page = page;
  searchParams.value.size = pageSize;
  getData();
}

async function handleOpenModal(data: any) {
  modal.value = true;
  loading.value = true;
  editInfo.value = data;
  postDetail.value = await getPostDetail(editInfo.value.post.metadata.name).finally(() => loading.value = false)
}

async function handleUpdatePostDetail() {
  loading.value = true
  const obj = {
    banner: JSON.stringify(bannerRef.value.dataSource),
    productInfo: JSON.stringify(productInfoRef.value.data),
    scopeOfApplication: JSON.stringify(scopeOfApplicationRef.value.data),
    productDescription: JSON.stringify(productDescriptionRef.value.dataSource),
    productFeatures: JSON.stringify(productFeaturesRef.value.dataSource),
    mainParameters: JSON.stringify(mainParametersRef.value.dataSource),
    mainParametersImage: JSON.stringify(mainParametersImageRef.value.dataSource),
    implementationStandards: JSON.stringify(implementationStandardsRef.value.dataSource),
    technicalAdvantages: JSON.stringify(technicalAdvantagesRef.value.dataSource)
  }
  postDetail.value.metadata.annotations = {
    ...postDetail.value.metadata.annotations,
    ...obj
  }

  const res = await updatePostDetail(editInfo.value.post.metadata.name, postDetail.value).finally(() => loading.value = false)
  modal.value = false
  console.log('updatePostDetail', res)
}

const drawerTitle = computed(() => {
  // @ts-ignore
  return editInfo.value?.post?.spec?.title
})

function handleCategoryChange() {
  searchParams.value.page = 1
  getData()
}

getCategory().then((data) => {
  data.items.map(ele => {
    category.value.push({ id: ele.metadata.name, name: ele.spec.displayName, postCount: ele.postCount })
  })
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
            <div class="flex items-center">
              <Select @change="handleCategoryChange" allow-clear size="default" v-model:value="categoryId" style="width: 350px; margin-right: 20px" placeholder="筛选分类">
                <SelectOption v-for="item in category" :key="item.id" :value="item.id">{{ item.name }}({{ item.postCount }}篇)</SelectOption>
              </Select>
              <Input
                allow-clear
                size="default"
                v-model:value="searchParams.keyword"
                placeholder="请输入关键字搜索"
              ></Input>
              <Button class="ml-[10px]" type="primary" @click="handleSearch"
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
              <template v-if="column.key === 'title'">
                {{ record.post.spec.title }}
                <a target="_blank" :href="record.post.status.permalink"><LinkOutlined /></a>
              </template>
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
          width="1000px"
          rootClassName="full-modal"
          :maskClosable="false"
        >
          <template #extra>
            <Button type="default" class="mr-[8px]" @click="modal = false">关闭</Button>
            <Button type="primary" @click="handleUpdatePostDetail" :loading="loading">提交</Button>
          </template>


          <Spin :spinning="loading">
            <Banner ref="bannerRef" class="mb-[40px]" />
            <ProductInfo ref="productInfoRef" class="mb-[40px]" />
            <ScopeOfApplication ref="scopeOfApplicationRef" class="mb-[40px]" />
            <ProductDescription ref="productDescriptionRef" class="mb-[40px]" />
            <ProductFeatures ref="productFeaturesRef" class="mb-[40px]" />
            <MainParameters ref="mainParametersRef" class="mb-[40px]" />
            <MainParametersImage ref="mainParametersImageRef" class="mb-[40px]" />
            <ImplementationStandards ref="implementationStandardsRef" class="mb-[40px]" />
            <TechnicalAdvantages ref="technicalAdvantagesRef" />
          </Spin>
        </Drawer>
      </ConfigProvider>
    </div>
  </div>
</template>


<style lang="scss">
@import url("../output.css");
span[role="img"] {
  vertical-align: text-bottom;
}

.ant-btn-primary {
  color: #fff;
  background-color: #1677ff !important;
  box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
}

.ant-input {
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

.ant-btn {
  font-size: 14px;
  height: 32px;
  padding: 4px 15px;
  border-radius: 6px;
}

.ant-btn.ant-btn-sm {
  font-size: 14px;
  height: 24px;
  padding: 0px 7px;
  border-radius: 4px;
}

.ant-input-affix-wrapper {
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

.ant-btn-primary.ant-btn-dangerous {
  background-color: #ff4d4f !important;
  box-shadow: 0 2px 0 rgba(255, 38, 5, 0.06);
}

.ant-btn-primary:disabled {
  cursor: not-allowed;
  border-color: #d9d9d9;
  color: rgba(0, 0, 0, 0.25);
  background-color: rgba(0, 0, 0, 0.04) !important;
  box-shadow: none;
}
</style>
