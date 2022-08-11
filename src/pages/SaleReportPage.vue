<template>
  <q-page>
    <div class="q-pa-md">
      <div class="row q-mt-md">
        <div class="col-12 col-md-12">
          <DataTable
            title="Relatório de Vendas"
            :columns="columns"
            :rows="rows"
            :actions="actions"
          />
        </div>
      </div>
    </div>
  </q-page>
  <FormDialog
    title="Relatório de Venda"
    background="white"
    :showSaveButton="false"
    v-model:dialog="dialog"
  >
    <div class="row">
      <div class="col-12 col-md-10 offset-md-1">
        <q-card class="my-card full-width non-selectable">
          <q-card-section
            class="row bg-secondary text-white"
            style="min-height: 50px"
          >
            <div class="col-6 text-left">
              <div class="text-h6">Código {{ sale.id }}</div>
            </div>
            <div class="col-6 text-right">
              <div class="text-h6">
                {{ formatDate(sale.date) }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-mt-sm">
      <div class="col-12 col-md-10 offset-md-1">
        <DataTable
          title=""
          :columns="columnsSale"
          :rows="products"
          row-key="name"
          :rowsPerPage="[0]"
          :virtualScroll="true"
          :height="300"
          :filter="null"
          :filter-method="null"
          :showFilter="false"
          hide-no-data
          hide-pagination
          hide-bottom
          virtual-scroll
        />
      </div>
    </div>
    <div class="row q-mt-sm">
      <div class="col-12 col-md-10 offset-md-1">
        <q-card class="my-card full-width non-selectable">
          <q-card-section
            class="row bg-secondary text-white"
            style="min-height: 100px"
          >
            <div class="col-12 col-md-8">
              <div class="text-h6">SUBTOTAL</div>
            </div>
            <div class="col-12 col-md-4 text-right">
              <div class="text-h6 text-bold" style="text-transform: uppercase">
                R$
                {{
                  parseFloat(sale.total_price).toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                  })
                }}
              </div>
              <div
                class="text-subtitle2"
                style="color: whitesmoke; margin-top: 10px"
              >
                Impostos: R$
                {{
                  parseFloat(sale.total_tax).toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                  })
                }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </FormDialog>
</template>

<script>
import { defineComponent } from "vue";
import DataTable from "../components/DataTable.vue";
import FormDialog from "../components/FormDialog.vue";
import { api } from "src/boot/axios";

const formatDate = (val) => {
  let valSplit = val.split(" ");

  let date = valSplit[0].split("-");
  let time = valSplit[1];

  let datetime = `${date[2]}/${date[1]}/${date[0]} ${time}`;

  return datetime;
};

export default defineComponent({
  name: "SaleReportPage",
  data() {
    return {
      rows: [],
      actions: [
        {
          label: "",
          icon: "menu",
          class: "bg-positive text-white",
          action: async (item) => {
            this.sale = item;

            await this.loadProducts(this.sale.id);

            this.dialog = true;
          },
        },
      ],
      dialog: false,
      sale: null,
      products: [],
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      api.get("/sale/list").then((response) => {
        this.rows = response.data.data;
      });
    },
    async loadProducts(sale_id) {
      let response = await api.get(`/sale/product/list/${sale_id}`);
      this.products = response.data.data;
    },
    formatDate,
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
        name: "total_price",
        required: true,
        label: "Total",
        align: "right",
        field: (row) => row.total_price,
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
        name: "total_tax",
        required: true,
        label: "Imposto",
        align: "right",
        field: (row) => row.total_tax,
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
        name: "date",
        required: true,
        label: "Data",
        align: "right",
        field: (row) => row.date,
        format: (val) => formatDate(val),
        sortable: true,
      },
    ];

    const columnsSale = [
      {
        name: "name",
        required: true,
        sortable: false,
        label: "Nome",
        align: "left",
        field: (row) => row.name,
        format: (val) => `${val}`,
      },
      {
        name: "reference",
        required: true,
        sortable: false,
        label: "Referência",
        align: "left",
        field: (row) => row.reference,
        format: (val) => `${val}`,
      },
      {
        name: "unit_price",
        required: true,
        sortable: false,
        label: "Preço",
        align: "right",
        field: (row) => row.unit_price,
        format: (val) => {
          var valor = parseFloat(val);

          if (!isNaN(valor)) {
            return `R$ ${valor.toLocaleString("pt-br", {
              minimumFractionDigits: 2,
            })}`;
          }

          return "-";
        },
      },
      {
        name: "quantity",
        required: true,
        sortable: false,
        label: "Quantidade",
        align: "right",
        field: (row) => row.quantity,
        format: (val) => `${val}`,
      },
      {
        name: "total_price",
        required: true,
        sortable: false,
        label: "Total",
        align: "right",
        field: (row) => row.total_price,
        format: (val) => {
          var valor = parseFloat(val);

          if (!isNaN(valor)) {
            return `R$ ${valor.toLocaleString("pt-br", {
              minimumFractionDigits: 2,
            })}`;
          }

          return "-";
        },
      },
      {
        name: "total_tax",
        required: true,
        sortable: false,
        label: "Impostos",
        align: "right",
        field: (row) => row.total_tax,
        format: (val) => {
          var valor = parseFloat(val);

          if (!isNaN(valor)) {
            return `R$ ${valor.toLocaleString("pt-br", {
              minimumFractionDigits: 2,
            })}`;
          }

          return "-";
        },
      },
    ];

    return { columns, columnsSale };
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
