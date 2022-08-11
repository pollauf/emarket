<template>
  <q-table
    :title="title"
    :rows="rows"
    :columns="columns"
    :filter="filter"
    :rows-per-page-options="rowsPerPage"
    :row-key="rowKey"
    :style="height > 0 ? `height: ${height}px` : ''"
  >
    <template v-if="actions.length > 0" v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <template v-if="actions.length > 0" v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn-dropdown v-if="actions.length > 1" size="sm" color="primary">
            <q-list>
              <q-item
                v-for="(action, key) in actions"
                :key="key"
                clickable
                v-close-popup
                @click="action.action(props.row)"
              >
                <q-item-section avatar>
                  <q-icon color="primary" :name="action.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ action.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn
            v-else
            dense
            :class="actions[0].class"
            @click="actions[0].action(props.row)"
            flat
            :icon-right="actions[0].icon"
            size="md"
          >
            <span class="q-pr-sm"> {{ actions[0].label }} </span>
          </q-btn>
        </q-td>
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr>
    </template>

    <template v-if="showFilter" v-slot:top-right>
      <q-input
        borderless
        dense
        debounce="300"
        v-model="filter"
        placeholder="Pesquisar"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
  </q-table>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "DataTable",

  props: {
    title: {
      type: String,
      required: true,
    },

    rows: {
      type: Array,
      default: () => [],
    },

    columns: {
      type: Array,
      default: () => [],
    },

    rowKey: {
      type: String,
      default: "id",
    },

    actions: {
      type: Array,
      default: () => [],
    },

    rowsPerPage: {
      type: Array,
      default: () => [5, 10, 25, 50, 100],
    },

    height: {
      type: Number,
      default: 0,
    },

    showFilter: {
      type: Boolean,
      default: true,
    },
  },

  setup() {
    const filter = ref("");

    return {
      filter,
    };
  },
});
</script>
