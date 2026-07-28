<template>
  <main>
    <section class="px-8 py-10">
      <div id="printArea" class="card relative overflow-hidden">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-md font-bold text-red-300">{{
              store.state.companyName
            }}</span>
            <span class="text-[12px] text-gray-500"
              >Created By: {{ props.data.createdBy }}</span
            >
            <span class="text-[12px] text-gray-500"
              >Type: {{ props.data.report.type }}</span
            >
          </div>
          <div class="flex flex-col items-end">
            <span class="text-4xl font-bold">Invoice</span>
            <span class="text-[12px] text-gray-500">{{ props.data.date }}</span>
            <span class="text-[12px] text-gray-500">{{
              props.data.invoiceId
            }}</span>
          </div>
        </div>

        <div class="flex justify-between text-sm text-gray-500 mt-6">
          <div class="flex flex-col gap-1">
            <span>Office Address</span>
            <span>Opposite TC Pharmarcy</span>
            <span>+233 (0) 243957770</span>
          </div>
          <div class="flex flex-col items-end gap-1">
            <span>To:</span>
            <span>{{ props.data.patient.name }}</span>
            <span>{{ props.data.patient.id }}</span>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-gray-400">Services</span>
          <DataTable
            :value="props.data.services"
            size="small"
            tableStyle="min-width: 40rem"
          >
            <Column field="name" header="Name" style="width: 70%"></Column>
            <Column
              field="currency"
              header="Currency"
              style="width: 20%"
            ></Column>
            <Column field="price" header="Price" style="width: 20%"></Column>
          </DataTable>
        </div>
        <div class="mt-2 flex justify-between text-gray-500">
          <span>Total</span>
          <span>GH₵ {{ props.data.total.toFixed(2) }}</span>
        </div>
        <Divider />
        <div class="flex flex-col">
          <div class="flex flex-col">
            <span class="text-[12px] text-gray-500"
              >Add Additional Charges</span
            >
            <span
              v-if="props.data.additionalCharges.length === 0"
              class="text-sm text-gray-700"
            >
              No Additional Charges
            </span>
            <DataTable
              v-else
              :value="props.data.additionalCharges"
              size="small"
              tableStyle="min-width: 40rem"
            >
              <Column field="name" header="Name" style="width: 70%"></Column>
              <Column
                field="currency"
                header="Currency"
                style="width: 20%"
              ></Column>
              <Column field="price" header="Price" style="width: 20%"></Column>
            </DataTable>
          </div>
        </div>

        <Divider />
        <div class="flex flex-row items-center justify-between">
          <span class="text-sm text-gray-500">Payment Method</span>
          <span>{{ props.data.paymentMethod }}</span>
        </div>
        <Divider />
        <div class="flex flex-col gap-0.5">
          <div class="flex justify-between text-[12px] text-gray-500">
            <span>Services Charges:</span>
            <span>GH₵ {{ props.data.total.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-[12px] text-gray-500">
            <span>Discount:</span>
            <span>GH₵ {{ props.data.discount.toFixed(2) }}</span>
          </div>
        </div>
        <Divider />
        <div class="flex justify-between text-md font-bold text-gray-500">
          <span>Grand Total:</span>
          <span>GH₵ {{ props.data.grandtotal.toFixed(2) }}</span>
        </div>
        <Divider />

        <!-- Watermark -->
        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span
            class="text-[6rem] font-bold text-gray-300 opacity-10 rotate-[-30deg] whitespace-nowrap"
          >
            {{ store.state.companyName }}
          </span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <Button label="Cancel" severity="secondary" @click="emit('close')" />
        <Button label="Print" v-print="'#printArea'" />
      </div>
    </section>
  </main>
</template>

<script setup>
import { defineEmits } from "vue";
import { useStore } from "vuex";
import { db } from "../firebase";
import { reactive, watch } from "vue";

const store = useStore();
const emit = defineEmits(["close"]);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const font = reactive({
  color: "rgba(0, 0, 0, .15)",
});
</script>

<style scoped>
main {
  position: fixed;
  top: 0;
  left: 0;
  background: #000000b9;
  z-index: 50;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

section {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  width: 50rem;
  max-height: 90vh;
  overflow: auto;
  border-radius: 4px;
}

.card {
}
</style>
