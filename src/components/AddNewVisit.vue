<template>
  <body>
    <div class="form">
      <h2 class="text-2xl font-light text-center mb-6 italic">Add Record</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="Patient Type" prop="patientType">
          <el-select
            placeholder="Select the Kind of Patient"
            v-model="form.patientType"
          >
            <el-option label="Registered" value="Registered" />
            <el-option label="Walk-In" value="Walk-In" />
          </el-select>
        </el-form-item>
        <el-form-item label="Patient" v-if="form.patientType == 'Walk-In'">
          <el-input
            v-model="form.patientName"
            placeholder="Enter Patient's name"
          />
        </el-form-item>
        <el-form-item label="Patient Name" v-else>
          <el-autocomplete
            v-model="state2"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            clearable
            placeholder="Search patient"
            @select="handleSelect"
          />
        </el-form-item>
        <el-form-item label="Doctor" prop="doctor">
          <el-select placeholder="Select Doctor" v-model="form.doctor">
            <el-option label="Yes" value="Yes" />
            <el-option label="No" value="No" />
          </el-select>
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-select placeholder="Select Visit Status" v-model="form.status">
            <el-option label="Waiting" value="Waiting" />
            <el-option label="Scanning" value="Scanning" />
            <el-option
              label="Waiting Consultation"
              value="Waiting Consultation"
            />
            <el-option label="Completed" value="Completed" />
            <el-option label="Cancelled" value="Cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item label="Reason">
          <el-input v-model="form.reason" type="textarea" />
        </el-form-item>

        <div class="grid grid-cols-2 gap-2 mt-8">
          <Button label="Cancel" severity="secondary" @click="emit('close')" />
          <Button label="Submit" @click.prevent="onSubmit" />
        </div>
      </el-form>
    </div>
  </body>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
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
} from "firebase/firestore";
import { ElLoading, ElMessage } from "element-plus";
import { db } from "../firebase";

const store = useStore();
const emit = defineEmits(["close"]);
const data = ref([]);
const state2 = ref("");
const formRef = ref();

const generateVisitID = () => {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `VST-${date}-${random}`;
};

const form = reactive({
  companyId: store.state.companyID,
  visitId: generateVisitID(),
  patientName: "",
  patientID: "",
  patientType: "",
  doctor: "",
  status: "",
  gender: "",
  age: "",
  phone: "",
  reason: "",
  date: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
});

const rules = {
  patientType: [
    {
      required: true,
      message: "Select patient type",
      trigger: "change",
    },
  ],

  patientName: [
    {
      required: true,
      message: "Select a patient",
      trigger: "blur",
    },
  ],

  doctor: [
    {
      required: true,
      message: "Select a doctor",
      trigger: "change",
    },
  ],

  status: [
    {
      required: true,
      message: "Select visit status",
      trigger: "change",
    },
  ],

  reason: [
    {
      required: true,
      message: "Reason is required",
      trigger: "blur",
    },
  ],
};

const querySearch = (queryString, cb) => {
  const results = queryString
    ? data.value.filter((patient) =>
        patient.fullName.toLowerCase().includes(queryString.toLowerCase()),
      )
    : data.value;

  cb(results);
};

const handleSelect = (item) => {
  form.patientID = item.patientID;
  form.patientName = item.fullName;
  form.gender = item.gender;
  form.age = item.age;
  form.phone = item.phone;
  state2.value = item.fullName;
};

onMounted(() => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading Patients...",
  });

  const usersCollection = query(
    collection(db, "patients"),
    where("companyId", "==", store.state.companyID),
  );

  onSnapshot(usersCollection, (snapshot) => {
    data.value = snapshot.docs.map((doc) => {
      const patient = doc.data();
      return {
        id: doc.id,
        ...patient,

        value:
          `${patient.firstName} ${patient.lastName} ${patient.otherName ?? ""}`.trim(),
        fullName:
          `${patient.firstName} ${patient.lastName} ${patient.otherName ?? ""}`.trim(),
      };
    });

    loadingInstance.close();
  });
});

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    const loading = ElLoading.service({
      lock: true,
      text: "Creating user...",
      background: "rgba(0,0,0,.5)",
    });

    console.log("Data",form);

    try {
      await addDoc(collection(db, "visits"), {
        ...form,
        createdAt: serverTimestamp(),
        createdBy: store.state.username,
      });

      ElMessage.success("Record created successfully");

      emit("close");
    } catch (error) {
      console.error(error);
      ElMessage.error("Failed to create record");
    } finally {
      loading.close();
    }
  });
};
</script>

<style scoped>
body {
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
  width: 40rem;
  border-radius: 8px;
  font-family:
    Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
