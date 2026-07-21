<template>
  <div class="relative page">
    <div class="form">
      <h2 class="text-2xl font-light text-center mb-8">New Report Form</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-splitter>
          <el-splitter-panel size="45%">
            <div class="mx-4">
              <el-form-item label="Patient Name" prop="patientName">
                <el-input v-model="form.patientName" disabled />
              </el-form-item>
              <el-form-item label="Patient ID" prop="patientId">
                <el-input
                  v-model="form.patientId"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  disabled
                />
              </el-form-item>
              <el-form-item label="Created By">
                <el-input v-model="store.state.username" disabled />
              </el-form-item>

              <el-form-item label="Reason">
                <el-input
                  v-model="form.reason"
                  type="textarea"
                  placeholder="Add comments..."
                  disabled
                />
              </el-form-item>
              <el-form-item label="Status" prop="status">
                <el-select
                  placeholder="Select Report status"
                  v-model="form.status"
                >
                  <el-option label="Draft" value="Draft" />
                  <el-option label="Completed" value="Completed" />
                </el-select>
              </el-form-item>
              <el-form-item label="Comment">
                <el-input
                  v-model="form.comment"
                  type="textarea"
                  placeholder="Add comments..."
                />
              </el-form-item>
              <el-form-item label="Finding">
                <el-input
                  v-model="form.finding"
                  type="textarea"
                  placeholder="Add findings..."
                />
              </el-form-item>
              <el-form-item label="Doctor's Note">
                <el-input
                  v-model="form.doctorNote"
                  type="textarea"
                  placeholder="Add Doctor's note..."
                />
              </el-form-item>
            </div>
          </el-splitter-panel>

          <el-splitter-panel :min="200" :resizable="false">
            <div class="mx-4">
              <div class="flex justify-between items-center my-4">
                <p class="text-sm text-gray-500">Services</p>
                <el-button @click="addService">Add Service</el-button>
              </div>

              <el-form-item
                v-for="(service, index) in form.services"
                :key="service.key"
                :label="'Service ' + (index + 1)"
              >
                <div
                  class="flex flex-row items-center gap-2 justify-center w-full"
                >
                  <el-autocomplete
                    v-model="service.name"
                    :fetch-suggestions="searchService"
                    placeholder="Search service"
                    @select="(item) => handleSelectService(item, index)"
                    class="w-full"
                  />
                  <el-input
                    v-model="service.currency"
                    placeholder="Currency"
                    disabled
                    class="w-80!"
                  />
                  <el-input-number
                    v-model="service.price"
                    placeholder="Price"
                    disabled
                    class="w-120!"
                  />
                  <el-button type="danger" @click="removeService(service)">
                    Delete
                  </el-button>
                </div>
              </el-form-item>
              <div class="my-4 flex justify-between px-5">
                <span>Total</span>
                <span class="text-xl font-bold">
                  GH₵ {{ grandTotal.toFixed(2) }}
                </span>
              </div>
            </div>
          </el-splitter-panel>
        </el-splitter>

        <div class="grid grid-cols-2 gap-2 mt-12">
          <Button label="Cancel" severity="secondary" @click="emit('close')" />
          <Button label="Submit" @click="onSubmit" />
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed, watch } from "vue";
import { defineEmits } from "vue";
import { useStore } from "vuex";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
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
  text: {
    type: String,
    required: true,
  },
});

const generateReportID = () => {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `RPT-${date}-${random}`;
};

const form = reactive({
  companyId: store.state.companyID,
  reportID: generateReportID(),
  type: "",
  patientId: "",
  patientName: "",
  services: [
    {
      key: 1,
      name: "",
      currency: "",
      price: 0,
    },
  ],
  total: 0,
  comment: "",
  reason: "",
  finding: "",
  doctorNote: "",
  status: "",
  date: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
});

watch(
  () => props.data,
  (data) => {
    if (data) {
      form.patientName = data.patientName;
      form.reason = data.reason;
      form.patientId = data.patientID;
    }
  },
  { immediate: true },
);

const rules = {
  patientName: [
    {
      required: true,
      message: "Patient is required",
      trigger: "change",
    },
  ],
};

const grandTotal = computed(() => {
  return form.services.reduce((sum, service) => {
    return sum + Number(service.price || 0);
  }, 0);
});

const handleSelectService = (item, index) => {
  form.services[index].name = item.name;
  form.services[index].currency = item.currency;
  form.services[index].price = item.price;
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
  form.services.push({
    key: Date.now() + Math.random(), // Added randomness to prevent key collisions if double clicked quickly
    name: "",
    currency: "",
    price: null,
  });
};

const removeService = (row) => {
  if (form.services.length === 1) {
    ElMessage.warning("At least one expense is required.");
    return;
  }

  const index = form.services.indexOf(row);

  if (index !== -1) {
    form.services.splice(index, 1);
  }
};

onMounted(() => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading Services Data...",
  });

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
    loadingInstance.close();
  });
});

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    console.log("Data", form);

    const loading = ElLoading.service({
      lock: true,
      text: "Creating Record ...",
      background: "rgba(0,0,0,.5)",
    });

    try {
      const reportRef = await addDoc(collection(db, "reports"), {
        ...form,
        total: grandTotal.value,
        type: props.text,
        createdAt: serverTimestamp(),
        createdBy: store.state.username,
      });

      ElMessage.success("Expense created successfully");

      if (props.text === "Appointment") {
        await updateDoc(doc(db, "appointments", props.data.id), {
          reportId: reportRef.id,
        });
      } else {
        await updateDoc(doc(db, "visits", props.data.id), {
          reportId: reportRef.id,
        });
      }

      emit("close");
    } catch (error) {
      console.error(error);
      ElMessage.error("Failed to create reports");
    } finally {
      loading.close();
    }
  });
};
</script>

<style scoped>
.page {
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

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 30px;
  width: 80rem;
  max-height: 90vh;
  border-radius: 8px;
  overflow: auto;
  font-family:
    Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
