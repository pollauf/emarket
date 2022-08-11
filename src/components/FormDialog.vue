<template>
  <q-dialog
    v-model="dialogOpened"
    :maximized="true"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-white">
      <q-bar class="bg-primary text-white q-pa-lg">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn
          @click="cancelButton"
          dense
          flat
          icon="close"
          size="md"
          :disable="loading"
        >
        </q-btn>
      </q-bar>

      <q-card-section class="q-pt-lg">
        <q-form @submit="submitForm" ref="form" class="row">
          <div
            class="col-12 col-sm-8 offset-sm-2 q-pa-sm q-pt-lg q-pb-lg"
            :style="`background-color: ${background}`"
          >
            <slot></slot>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions
        style="border-top: 1px solid lightgray"
        align="right"
        class="bg-white text-teal q-pa-md q-mb-sm q-mt-md"
      >
        <div class="offset-md-2"></div>
        <q-btn
          class="text-black"
          style="background-color: #cfcfcf"
          @click="cancelButton"
          flat
          icon="arrow_back_ios"
          size="md"
          :disable="loading"
        >
          <span class="q-pl-sm"> Voltar </span>
        </q-btn>
        <q-space />
        <q-btn
          v-if="showSaveButton"
          class="bg-positive text-white"
          @click="saveButton"
          flat
          icon-right="save"
          size="md"
          :disable="loading"
          :loading="loading"
        >
          <span class="q-pr-sm"> Salvar </span>
        </q-btn>
        <div class="offset-md-2"></div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormDialog",

  data() {
    return {
      dialogOpened: this.dialog,
      loading: false,
    };
  },

  methods: {
    async submitForm() {
      this.loading = true;

      let result = await this.save();

      if (result == true) {
        this.closeModal();
      }

      this.loading = false;
    },
    saveButton() {
      this.$refs.form.submit();
    },
    cancelButton() {
      this.cancel();
      this.closeModal();
    },
    closeModal() {
      this.loading = false;
      this.$emit("update:dialog", false);
    },
  },

  watch: {
    dialog(dialog) {
      this.dialogOpened = dialog;
    },
  },

  props: {
    title: {
      type: String,
      default: "",
    },
    dialog: {
      type: Boolean,
      default: false,
    },
    save: {
      type: Function,
      default: () => {},
    },
    cancel: {
      type: Function,
      default: () => {},
    },
    showSaveButton: {
      type: Boolean,
      default: true,
    },
    background: {
      type: String,
      default: "#ededed",
    },
  },
});
</script>
