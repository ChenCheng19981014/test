// ts-ignore
import { createRouter, createWebHashHistory } from "vue-router";
import beforeEach from "./before-each";

const routes = [
  {
    path: "/",
    name: "app",
    redirect: "/gis", // 重定向
    // component: () => import("@/views/home.vue"),
    children: [
      {
        path: "/gis/:platform/:token",
        name: "gis",
        component: () => import("@/views/compoment/gis.vue"),
      },
      {
        path: "/waterFlow",
        name: "waterFlow",
        component: () => import("@/views/compoment/waterFlow.vue"),
      },
    ],
  },
    {
    path: "/test",
    name: "test",
    component: () => import("@/views/compoment/test.vue"),
  },
];

// createRouter用于创建路由器实例，可以管理多个路由
const router = createRouter({
  // 路由的模式的设置
  history: createWebHashHistory(),
  routes,
});

beforeEach(router);

export default router;
