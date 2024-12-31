import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/post/:id",
      component: () => import("@/views/PostPage.vue"),
    },
    {
      path: "/account",
      component: () => import("@/views/AccountPage.vue"),
    },
    {
      path: "/:404",
      redirect: "/",
    },
  ],
});

export default router;
