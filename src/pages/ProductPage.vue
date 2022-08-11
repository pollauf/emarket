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
            title="Produtos"
            :columns="columns"
            :rows="rows"
            :actions="actions"
          />
        </div>
      </div>
    </div>
  </q-page>
  <FormDialog title="Produto" :save="save" v-model:dialog="dialog">
    <div class="row">
      <div class="col-12 col-md-8 q-pa-sm">
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
          v-model="form.reference"
          class="bg-white"
          outlined
          label="Referência/Código de Barras"
          :rules="[(val) => val && val.length > 0] || ''"
          hide-bottom-space
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-4 q-pa-sm">
        <q-select
          v-model="form.id_product_type"
          :options="productTypes"
          option-value="id"
          option-label="name"
          class="bg-white"
          outlined
          label="Tipo"
          emit-value
          map-options
        />
      </div>
      <div class="col-12 col-md-4 q-pa-sm">
        <q-input
          v-model="form.price"
          type="tel"
          class="bg-white"
          outlined
          label="Preço (R$)"
          mask="###.###.###.###,##"
          maxlength="10"
          reverse-fill-mask
          input-class="text-right"
          :rules="[(val) => val && val.length > 0] || ''"
          hide-bottom-space
        />
      </div>
      <div class="col-12 col-md-4 q-pa-sm">
        <q-input
          v-model="form.stock_amount"
          type="tel"
          class="bg-white"
          outlined
          label="Estoque (un.)"
          mask="##########"
          maxlength="10"
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
  name: "ProductPage",
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

            form.price = parseFloat(form.price).toLocaleString("pt-br", {
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
                title: "Remover Produto",
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

                api.get(`product/disable/${item.id}`).then((response) => {
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
        reference: "",
        id_product_type: "",
        price: "",
        stock_amount: "",
      },
      originalForm: "",
      productTypes: "",
    };
  },
  created() {
    this.originalForm = JSON.stringify(this.form);
    this.loadData();

    api.get("/product/type/list").then((response) => {
      this.productTypes = response.data.data;
    });
  },
  methods: {
    loadData() {
      api.get("/product/list/0").then((response) => {
        this.rows = response.data.data;
      });
    },
    async save() {
      let data = JSON.stringify(this.form);
      data = JSON.parse(data);
      data.price = data.price.replaceAll(".", "").replaceAll(",", ".");

      let response = await api.post("/product/store", data);

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
        name: "reference",
        required: true,
        label: "Referência",
        align: "left",
        field: (row) => row.reference,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "name_product_type",
        required: true,
        label: "Tipo",
        align: "left",
        field: (row) => row.name_product_type,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "price",
        required: true,
        label: "Preço",
        align: "right",
        field: (row) => row.price,
        format: (val) => {
          var valor = parseFloat(val);

          if (!isNaN(valor)) {
            return `R$ ${valor.toLocaleString("pt-br", {
              minimumFractionDigits: 2,
            })}`;
          }

          return "-";
        },
        sortable: true,
      },
      {
        name: "stock_amount",
        required: true,
        label: "Estoque (un.)",
        align: "right",
        field: (row) => row.stock_amount,
        format: (val) => `${val}`,
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
