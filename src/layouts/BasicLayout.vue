<template>
  <q-layout view="hHh Lpr lFr">
    <q-header class="bg-primary" elevated>
      <q-toolbar>
        <q-btn outline rounded no-caps no-wrap class="q-ml-md">
          <q-icon name="store" color="white" size="md" />
          <q-toolbar-title shrink class="text-weight-bold">
            E-MARKET
          </q-toolbar-title>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "BasicLayout",
});
</script>
