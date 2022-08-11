<template>
  <q-page>
    <div class="q-pa-md">
      <div class="row q-mt-sm">
        <div class="col-12 col-md-10 offset-md-1">
          <q-card class="my-card full-width non-selectable">
            <q-card-section
              class="row bg-primary text-white"
              style="min-height: 100px"
            >
              <div
                :class="thereIsSelectedProduct ? 'col-12 col-md-8' : 'col-12'"
              >
                <div v-if="thereIsSelectedProduct">
                  <div class="text-h6" style="text-transform: uppercase">
                    {{ this.product.name }}
                  </div>
                  <div
                    class="text-subtitle2"
                    style="color: whitesmoke; margin-top: 10px"
                  >
                    Ref. {{ this.product.reference }}
                  </div>
                </div>
                <div v-else>
                  <div class="text-h6">Escolha um produto...</div>
                </div>
              </div>
              <div
                v-if="thereIsSelectedProduct"
                class="col-12 col-md-4 text-right"
              >
                <div
                  class="text-h6 text-bold"
                  style="text-transform: uppercase"
                >
                  R$
                  {{
                    parseFloat(
                      this.product.price * this.quantity
                    ).toLocaleString("pt-br", {
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
                    parseFloat(
                      (
                        ((this.product.price * this.product.tax) / 100) *
                        this.quantity
                      ).toFixed(2)
                    ).toLocaleString("pt-br", {
                      minimumFractionDigits: 2,
                    })
                  }}
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="left">
              <div class="col-12 col-md-3 q-pa-sm">
                <q-btn
                  v-if="!thereIsSelectedProduct"
                  :disabled="loading"
                  @click="openProductModal"
                  class="bg-primary text-white full-width"
                  flat
                  icon="view_list"
                  size="md"
                >
                  <span class="q-pl-sm"> Escolher </span>
                </q-btn>
                <q-btn
                  v-if="thereIsSelectedProduct"
                  :disabled="loading"
                  @click="clearForm"
                  class="bg-negative text-white full-width"
                  flat
                  icon="block"
                  size="md"
                >
                  <span class="q-pl-sm"> Cancelar Produto </span>
                </q-btn>
              </div>
              <div class="col-12 col-md-2 offset-md-4 q-pa-sm">
                <q-input
                  :readonly="!thereIsSelectedProduct"
                  dense
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :max="maxProductQuantity"
                  @keypress="forceValue"
                  class="q-mr-sm full-width"
                  label="Quantidade"
                  outlined
                />
              </div>
              <div class="col-12 col-md-3 q-pa-sm">
                <q-btn
                  :disabled="
                    !thereIsSelectedProduct || quantity <= 0 || loading
                  "
                  @click="addProduct"
                  class="bg-positive text-white full-width"
                  flat
                  icon="add"
                  size="md"
                >
                  <span class="q-pl-sm"> Adicionar à venda </span>
                </q-btn>
              </div>
            </q-card-actions>
          </q-card>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-12 col-md-10 offset-md-1">
          <DataTable
            title="Venda"
            :columns="columnsSale"
            :rows="products"
            row-key="name"
            :actions="saleActions"
            :rowsPerPage="[0]"
            :virtualScroll="true"
            :height="250"
            :filter="null"
            :filter-method="null"
            :showFilter="false"
            hide-no-data
            hide-pagination
            hide-bottom
            virtual-scroll
            dense
          />
        </div>
      </div>
      <div class="row q-mt-md">
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
                <div
                  class="text-h6 text-bold"
                  style="text-transform: uppercase"
                >
                  R$
                  {{
                    parseFloat(totalPrice).toLocaleString("pt-br", {
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
                    parseFloat(totalTax.toFixed(2)).toLocaleString("pt-br", {
                      minimumFractionDigits: 2,
                    })
                  }}
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <div class="col-12 col-md-3">
                <q-btn
                  :disabled="products.length <= 0 || loading"
                  :loading="loading"
                  @click="save"
                  class="bg-positive text-white full-width"
                  flat
                  icon="done"
                  size="md"
                >
                  <span class="q-pl-sm"> Fechar Venda </span>
                </q-btn>
              </div>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
  <FormDialog
    title="Selecione o Produto"
    v-model:dialog="dialog"
    :showSaveButton="false"
    background="white"
  >
    <div class="row">
      <div class="col-12 col-md-12">
        <DataTable
          title="Produtos"
          :columns="columns"
          :rows="productsOptions"
          :actions="productActions"
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
  name: "SalePage",
  data() {
    return {
      productsLoaded: [],
      dialog: false,
      productActions: [
        {
          label: "",
          icon: "chevron_right",
          class: "bg-positive text-white",
          action: (item) => {
            this.dialog = false;
            this.product = item;
          },
        },
      ],
      saleActions: [
        {
          label: "",
          icon: "remove",
          class: "bg-negative text-white",
          action: (item) => {
            let indexOfProduct = this.products.indexOf(item);
            this.products.splice(indexOfProduct, 1);
          },
        },
      ],
      product: null,
      quantity: 1,
      products: [],
      loading: false,
    };
  },
  computed: {
    thereIsSelectedProduct() {
      return this.product != null;
    },
    maxProductQuantity() {
      if (this.thereIsSelectedProduct) {
        return this.product.stock_amount;
      }

      return 10000;
    },
    productsOptions() {
      let selectedProductsID = this.products.map((product) => {
        return product.product.id;
      });

      let products = this.productsLoaded.filter((product) => {
        return !selectedProductsID.includes(product.id);
      });

      return products;
    },
    totalPrice() {
      let total = 0;

      for (var i in this.products) {
        var product = this.products[i];
        total += product.product.price * product.quantity;
      }

      return total;
    },
    totalTax() {
      let total = 0;

      for (var i in this.products) {
        var product = this.products[i];
        total +=
          ((product.product.price * product.product.tax) / 100) *
          product.quantity;
      }

      return total;
    },
  },
  methods: {
    save() {
      this.loading = true;

      setTimeout(async () => {
        let data = {
          products: this.products.map(function (product) {
            return {
              id: product.product.id,
              quantity: product.quantity,
            };
          }),
        };

        let response = await api.post("/sale/create", data);

        if (response.data.ok) {
          this.$q.notify({
            type: "positive",
            position: "bottom",
            message: "Venda salva com sucesso!",
            timeout: 2000,
          });

          this.clearForm();
          this.products = [];
        } else {
          this.$q.notify({
            type: "warning",
            position: "bottom",
            message: response.data.msg,
            timeout: 2000,
          });
        }

        this.loading = false;
      }, 1000);
    },
    forceValue(e) {
      setTimeout(() => {
        if (this.quantity > this.maxProductQuantity) {
          this.quantity = this.maxProductQuantity;

          e.preventDefault();
        } else if (this.quantity <= 0) {
          this.quantity = 1;

          e.preventDefault();
        }
      }, 100);
    },
    addProduct() {
      let newProduct = {
        product: this.product,
        quantity: this.quantity,
      };

      this.products = [newProduct].concat(this.products);

      this.clearForm();
    },
    clearForm() {
      this.product = null;
      this.quantity = 1;
    },
    openProductModal() {
      this.loadData();
      this.dialog = true;
    },
    loadData() {
      api.get("/product/list/1").then((response) => {
        this.productsLoaded = response.data.data;
      });
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

    const columnsSale = [
      {
        name: "name",
        required: true,
        sortable: false,
        label: "Nome",
        align: "left",
        field: (row) => row.product.name,
        format: (val) => `${val}`,
      },
      {
        name: "reference",
        required: true,
        sortable: false,
        label: "Referência",
        align: "left",
        field: (row) => row.product.reference,
        format: (val) => `${val}`,
      },
      {
        name: "price",
        required: true,
        sortable: false,
        label: "Preço",
        align: "right",
        field: (row) => row.product.price,
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
        name: "total",
        required: true,
        sortable: false,
        label: "Total",
        align: "right",
        field: (row) => row.product.price * row.quantity,
        format: (val) => {
          var valor = parseFloat(val.toFixed(2));

          if (!isNaN(valor)) {
            return `R$ ${valor.toLocaleString("pt-br", {
              minimumFractionDigits: 2,
            })}`;
          }

          return "-";
        },
      },
      {
        name: "tax",
        required: true,
        sortable: false,
        label: "Impostos",
        align: "right",
        field: (row) =>
          (row.product.price * row.quantity * row.product.tax) / 100,
        format: (val) => {
          var valor = parseFloat(val.toFixed(2));

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
    DataTable,
  },
});
</script>

<style>
.q-field__bottom {
  display: none !important;
}
</style>
