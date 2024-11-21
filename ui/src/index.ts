import { definePlugin } from "@halo-dev/console-shared";
import HomeView from "./views/HomeView.vue";
import { IconPlug } from "@halo-dev/components";
import { markRaw } from "vue";

export default definePlugin({
  components: {},
  routes: [
    {
      parentName: "Root",
      route: {
        path: "/postConfig",
        name: "postConfig",
        component: HomeView,
        meta: {
          title: "产品详情配置",
          searchable: true,
          menu: {
            name: "产品详情配置",
            group: "文章配置",
            icon: markRaw(IconPlug),
            priority: 0,
          },
        },
      },
    },
  ],
  extensionPoints: {},
});
