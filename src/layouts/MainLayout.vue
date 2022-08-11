<template>
  <q-layout view="hHh Lpr lFr">
    <q-header class="bg-primary" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          size="md"
          @click="toggleLeftDrawer"
        />

        <q-btn outline rounded no-caps no-wrap class="q-ml-md">
          <q-icon name="store" color="white" size="md" />
          <q-toolbar-title shrink class="text-weight-bold">
            E-MARKET
          </q-toolbar-title>
        </q-btn>

        <q-space />

        <q-btn
          flat
          dense
          round
          icon="logout"
          aria-label="Logout"
          size="md"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      class="bg-secondary text-white non-selectable"
      v-model="leftDrawerOpen"
      show-if-above
    >
      <q-tabs vertical inline-label>
        <q-route-tab
          v-for="(menu, key) in menus"
          :key="key"
          :icon="menu.icon"
          :label="menu.title"
          :to="menu.route"
          exact-active-class="bg-blue-grey-8"
          style="justify-content: initial; padding-left: 20px"
          exact
        />
      </q-tabs>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

const menus = [
  {
    icon: "home",
    title: "Início",
    route: "/",
  },
  {
    icon: "category",
    title: "Tipos de Produtos",
    route: "/product/type",
  },
  {
    icon: "inventory_2",
    title: "Produtos",
    route: "/product",
  },
  {
    icon: "point_of_sale",
    title: "Venda",
    route: "/sale",
  },
  {
    icon: "receipt_long",
    title: "Relatório de Vendas",
    route: "/sale/report",
  },
];

export default defineComponent({
  name: "MainLayout",

  methods: {
    logout() {
      this.$q.localStorage.clear();
      this.$router.push({ path: "/login" });
    },
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      menus,
    };
  },
});
</script>
