// @ts-ignore
import { createRouter, createWebHashHistory } from "vue-router";
import beforeEach from "./before-each";

const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/blog",
  },
  {
    path: "/blog",
    name: "blog",
    component: () => import("@/views/BlogIndex.vue"),
  },
  {
    path: "/blog/:slug",
    name: "blog-post",
    component: () => import("@/views/BlogPost.vue"),
  },
  {
    path: "/resume",
    name: "resume",
    component: () => import("@/views/ResumePage.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

beforeEach(router);

export default router;
