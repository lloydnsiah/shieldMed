<template>
  <main>
    <section class="px-8 py-10 relative">
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <span class="text-md font-bold text-red-300"
            >Shield Medical Center</span
          >
          <span class="text-[12px] text-gray-500"
            >Created By: {{ props.data.createdBy }}</span
          >
          <span class="text-[12px] text-gray-500"
            >Type: {{ props.data.type }}</span
          >
        </div>
        <div class="flex flex-col items-end">
          <span class="text-4xl font-bold">Invoice</span>
          <span class="text-[12px] text-gray-500">{{ props.data.date }}</span>
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
          <span>{{ props.data.patientName }}</span>
          <span>{{ props.data.patientId }}</span>
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
      <div class="mt-2 flex justify-between px-4 text-gray-500">
        <span>Total</span>
        <span class="text-lg font-bold">{{ props.data.total }} Ghs</span>
      </div>
      <Divider />
      <div class="flex flex-col">
        <div class="flex flex-col">
          <span class="text-[12px] text-gray-500">Add Additional Charges</span>
          <div class="flex justify-between items-center my-4">
            <p class="text-sm text-gray-500">Services</p>
            <el-button @click="addService" type="info"
              >Add Additional Services</el-button
            >
          </div>

          <el-form-item
            v-for="(additionalCharges, index) in form.additionalCharges"
            :key="additionalCharges.key"
            :label="'Additional Charges ' + (index + 1)"
          >
            <div class="flex flex-row items-center gap-2 justify-center w-full">
              <el-autocomplete
                v-model="additionalCharges.name"
                :fetch-suggestions="searchService"
                placeholder="Search service"
                @select="(item) => handleSelectService(item, index)"
                class="w-full"
              />
              <el-input
                v-model="additionalCharges.currency"
                placeholder="Currency"
                disabled
                class="w-80!"
              />
              <el-input-number
                v-model="additionalCharges.price"
                placeholder="Price"
                disabled
                class="w-120!"
              />
              <el-button
                type="danger"
                @click="removeService(additionalCharges)"
              >
                Delete
              </el-button>
            </div>
          </el-form-item>
        </div>
      </div>
      <Divider />
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span class="">Discount</span>
            <el-form-item prop="discount">
              <el-input-number v-model="form.discount" min="0" :step="1" />
            </el-form-item>
          </div>
          <Divider />
          <div>
            <el-form-item prop="paymentMethod">
              <el-select
                v-model="form.paymentMethod"
                placeholder="please select payment method"
              >
                <el-option label="Cash" value="Cash" />
                <el-option label="Momo" value="Momo" />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <Divider />
      <div class="flex flex-col gap-0.5">
        <div class="flex justify-between text-[12px] text-gray-500">
          <span>Services Charges:</span>
          <span>GH₵ {{ form.total.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-[12px] text-gray-500">
          <span>Additional Charges:</span>
          <span>GH₵ {{ additionalChargesTotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-[12px] text-gray-500">
          <span>Discount:</span>
          <span>GH₵ {{ Number(form.discount || 0) }}</span>
        </div>
      </div>
      <Divider />
      <div class="flex justify-between text-[12px] text-gray-500">
        <span>Grand Total:</span> <span>GH₵ {{ grossTotal.toFixed(2) }}</span>
      </div>
      <Divider />
      <div class="grid grid-cols-2 gap-2">
        <Button label="Cancel" severity="secondary" @click="emit('close')" />
        <Button label="Create" @click="onSubmit" />
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive, onMounted, ref, computed, watch } from "vue";
import { defineEmits } from "vue";
import { useStore } from "vuex";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ElLoading, ElMessage } from "element-plus";
import { db } from "../firebase";

const store = useStore();
const emit = defineEmits(["close"]);
const formRef = ref();
const expenses = ref([]);
const servicesData = ref([]);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const generateInvoiceID = () => {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `INV-${date}-${random}`;
};

const form = reactive({
  companyId: store.state.companyID,
  invoiceId: generateInvoiceID(),
  patient: {
    id: "",
    name: "",
  },
  report: {
    id: "",
    type: "",
  },
  services: [],
  additionalCharges: [],
  total: 0,
  discount: 0,
  grandtotal: 0,
  paymentMethod: "",
  date: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
});

const rules = {
  paymentMethod: [
    {
      required: true,
      message: "Payment Method is required",
      trigger: "change",
    },
  ],
  discount: [
    {
      validator: (_, value, callback) => {
        if (value < 0) {
          callback(new Error("Discount cannot be negative"));
        } else if (value > grossTotal.value) {
          callback(new Error("Discount cannot exceed the invoice total"));
        } else {
          callback();
        }
      },
      trigger: "change",
    },
  ],
};

watch(
  () => props.data,
  (data) => {
    if (data) {
      form.patient.name = data.patientName;
      form.patient.id = data.patientId;
      form.report.type = data.type;
      form.services = [...data.services];
      form.total = data.total;
      form.report.id = data.reportID;
    }
  },
  { immediate: true },
);

const handleSelectService = (item, index) => {
  form.additionalCharges[index].name = item.name;
  form.additionalCharges[index].currency = item.currency;
  form.additionalCharges[index].price = item.price;
};

const searchService = (queryString, cb) => {
  const results = queryString
    ? servicesData.value.filter((item) =>
        item.name.toLowerCase().includes(queryString.toLowerCase()),
      )
    : servicesData.value;

  cb(
    results.map((item) => ({
      value: item.name,
      ...item,
    })),
  );
};

const addService = () => {
  form.additionalCharges.push({
    key: Date.now() + Math.random(), // Added randomness to prevent key collisions if double clicked quickly
    name: "",
    currency: "",
    price: null,
  });
};

const removeService = (row) => {
  //   if (form.additionalCharges.length === 1) {
  //     ElMessage.warning("At least one expense is required.");
  //     return;
  //   }

  const index = form.additionalCharges.indexOf(row);

  if (index !== -1) {
    form.additionalCharges.splice(index, 1);
  }
};

const additionalChargesTotal = computed(() => {
  return form.additionalCharges.reduce((sum, item) => {
    return sum + Number(item.price || 0);
  }, 0);
});

const grossTotal = computed(() => {
  return (
    Number(form.total) +
    additionalChargesTotal.value -
    Number(form.discount || 0)
  );
});

onMounted(() => {
  const usersCollection = query(
    collection(db, "services"),
    where("companyId", "==", store.state.companyID),
    // orderBy("createdAt", "desc"),
  );
  onSnapshot(usersCollection, (snapshot) => {
    servicesData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });
});

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error("Please complete all required fields.");
      return;
    }

    const loading = ElLoading.service({
      lock: true,
      text: "Creating Invoice...",
      background: "rgba(0,0,0,.5)",
    });

    try {
       const reportRef = await addDoc(collection(db, "invoices"), {
        ...form,
        grandtotal: grossTotal.value,
        createdAt: serverTimestamp(),
        createdBy: store.state.username,
      });

      await updateDoc(doc(db, "reports", props.data.id), {
          invoiceId: reportRef.invoiceId,
        });


      ElMessage.success("Invoice created successfully");
      emit("close");
    } catch (error) {
      console.error(error);
      ElMessage.error("Failed to create invoice");
    } finally {
      loading.close();
    }
  });
};
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
</style>
