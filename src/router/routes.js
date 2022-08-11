const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/login",
    component: () => import("layouts/BasicLayout.vue"),
    children: [{ path: "", component: () => import("pages/LoginPage.vue") }],
  },
  {
    path: "/product/type",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/ProductTypePage.vue") },
    ],
  },
  {
    path: "/product",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/ProductPage.vue") }],
  },
  {
    path: "/sale",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/SalePage.vue") }],
  },
  {
    path: "/sale/report",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/SaleReportPage.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("src/pages/Error404.vue"),
  },
];

export default routes;
