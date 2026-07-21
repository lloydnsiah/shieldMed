<template>
  <body>
    <div class="form">
      <h2 class="text-2xl font-light text-center mb-6 italic">
        Create Appointment
      </h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="Patient Name" prop="patientName">
          <el-autocomplete
            v-model="state2"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            clearable
            placeholder="Search patient"
            @select="handleSelect"
          />
        </el-form-item>
        <el-form-item label="Appointment time" prop="appointmenttime">
          <el-col :span="11">
            <el-date-picker
              v-model="form.appointmentDate"
              type="date"
              placeholder="Pick a date"
              value-format="YYYY-MM-DD"
              style="width: 100%"
              :disabled-date="disabledDate"
            />
          </el-col>
          <el-col :span="2" class="text-center">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-time-picker
              v-model="form.appointmenttime"
              placeholder="Pick a time"
              style="width: 100%"
              value-format="HH:mm"
              format="HH:mm"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="Doctor" prop="doctor">
          <el-select placeholder="Select Doctor" v-model="form.doctor">
            <el-option label="Yes" value="Yes" />
            <el-option label="No" value="No" />
          </el-select>
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-select placeholder="Select Visit Status" v-model="form.status">
            <el-option label="Confirmed" value="Confirmed" />
            <el-option label="Completed" value="Completed" />
            <el-option label="Missed" value="Missed" />
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

const generateappointmentID = () => {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `APP-${date}-${random}`;
};

const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7;
};


const form = reactive({
  companyId: store.state.companyID,
  appointmentId: generateappointmentID(),
  patientName: "",
  patientID: "",
  appointmenttime: "",
  appointmentDate: "",
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
  appointmenttime: [
    {
      required: true,
      message: "Select an Appointment Time",
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
  
    try {
      // Check duplicate phone number
      const q = query(
        collection(db, "appointments"),
        where("appointmentId", "==", form.appointmentId),
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        loading.close();
        ElMessage.error("Duplicate ID.");
        return;
      }

      await addDoc(collection(db, "appointments"), {
        ...form,
        createdAt: serverTimestamp(),
        createdBy: store.state.username,
      });

      ElMessage.success("Appointment created successfully");

      emit("close");
    } catch (error) {
      console.error(error);
      ElMessage.error("Failed to create appointments");
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
