import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/play/:path",
      component: () => import("@/views/VideoPlayer.vue"),
    },
    {
      path: "/:404",
      redirect: "/",
    },
  ],
});

export default router;
