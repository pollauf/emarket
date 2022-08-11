<template>
  <q-page>
    <div class="q-pa-md">
      <div class="row q-mt-md">
        <div class="col-12 col-md-12 text-right">
          <q-btn
            @click="() => (this.dialog = true)"
            class="bg-positive text-white"
            flat
            icon="add"
            size="md"
          >
            <span class="q-pl-sm"> Cadastro </span>
          </q-btn>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-12 col-md-12">
          <DataTable
            title="Tipos de Produtos"
            :columns="columns"
            :rows="rows"
            :actions="actions"
          />
        </div>
      </div>
    </div>
  </q-page>
  <FormDialog title="Tipo de Produto" :save="save" v-model:dialog="dialog">
    <div class="row">
      <div class="col-12 col-md-6 offset-md-1 q-pa-sm">
        <q-input
          v-model="form.name"
          class="bg-white"
          outlined
          label="Nome"
          :rules="[(val) => val && val.length > 0] || ''"
          hide-bottom-space
        />
      </div>
      <div class="col-12 col-md-4 q-pa-sm">
        <q-input
          v-model="form.tax"
          type="tel"
          class="bg-white"
          outlined
          label="Taxa de Imposto (%)"
          mask="###.###.###.###,##"
          maxlength="5"
          reverse-fill-mask
          input-class="text-right"
          :rules="[(val) => val && val.length > 0] || ''"
          hide-bottom-space
        />
      </div>
    </div>
  </FormDialog>
</template>

<script>
import { defineComponent } from "vue";
import DataTable from "../components/DataTable.vue";
import FormDialog from "../components/FormDialog.vue";
import { api } from "src/boot/axios";

export default defineComponent({
  name: "ProductTypePage",
  data() {
    return {
      rows: [],
      actions: [
        {
          label: "Editar",
          icon: "edit",
          action: (item) => {
            this.editMode = true;

            this.dialog = true;

            let form = JSON.stringify(item);
            form = JSON.parse(form);

            form.tax = parseFloat(form.tax).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
            });

            console.log(form);

            this.form = form;
          },
        },
        {
          label: "Remover",
          icon: "delete",
          action: (item) => {
            this.$q
              .dialog({
                title: "Remover Tipo de Produto",
                message: `Tem certeza que deseja remover ${item.name}?`,
                ok: {
                  flat: true,
                  label: "Sim",
                  color: "green",
                },
                cancel: {
                  flat: true,
                  label: "Não",
                  color: "green",
                },
                persistent: true,
              })
              .onOk(() => {
                let index = this.rows.indexOf(item);

                api.get(`product/type/disable/${item.id}`).then((response) => {
                  this.rows.splice(index, 1);
                });
              });
          },
        },
      ],
      dialog: false,
      form: {
        id: 0,
        name: "",
        tax: "",
      },
      originalForm: "",
    };
  },
  created() {
    this.originalForm = JSON.stringify(this.form);
    this.loadData();
  },
  methods: {
    loadData() {
      api.get("/product/type/list").then((response) => {
        this.rows = response.data.data;
      });
    },
    async save() {
      let data = JSON.stringify(this.form);
      data = JSON.parse(data);
      data.tax = data.tax.replaceAll(".", "").replaceAll(",", ".");

      let response = await api.post("/product/type/store", data);

      this.loadData();

      if (response.data.ok) {
        this.$q.notify({
          type: "positive",
          position: "bottom",
          message: "Sucesso!",
          timeout: 2000,
        });

        this.form = JSON.parse(this.originalForm);

        return true;
      }

      this.$q.notify({
        type: "warning",
        position: "bottom",
        message: response.data.msg,
        timeout: 2000,
      });

      return false;
    },
  },
  setup() {
    const columns = [
      {
        name: "id",
        required: true,
        label: "Cód.",
        align: "center",
        field: (row) => row.id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "name",
        required: true,
        label: "Nome",
        align: "left",
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "tax",
        required: true,
        label: "Taxa de Imposto",
        align: "right",
        field: (row) => row.tax,
        format: (val) => {
          var valor = parseFloat(val);

          if (!isNaN(valor)) {
            return `${valor.toLocaleString("pt-br", {
              minimumFractionDigits: 2,
            })}%`;
          }

          return "-";
        },
        sortable: true,
      },
    ];

    return { columns };
  },
  components: {
    DataTable,
    FormDialog,
  },
});
</script>

<style>
.q-field__bottom {
  display: none !important;
}
</style>
