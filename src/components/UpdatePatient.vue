<template>
  <main>
    <div class="card flex flex-col gap-4">
      <h1 class="text-2xl">Update Patient</h1>
      <span class="text-gray-400 text-sm italic -mt-1 mb-6"
        >Enter patients details</span
      >
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="auto"
        
        class="space-y-2"
      >
        <div class="grid grid-cols-3 gap-2">
          <el-form-item prop="name" label="Name">
            <el-input v-model="form.firstName" placeholder="First Name" />
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="form.lastName" placeholder="Last Name" />
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="form.otherName" placeholder="Other Names" />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2">
          <el-form-item label="Age" prop="age">
            <el-input-number
              v-model="form.age"
              :min="10"
              placeholder="00"
              class="w-full!"
            />
          </el-form-item>
          <el-form-item label="DOB" prop="dob">
            <el-date-picker
              v-model="form.dob"
              type="date"
              placeholder="Pick a date"
              class="w-full!"
            />
          </el-form-item>
        </div>

        <el-form-item label="Gender" prop="gender">
          <el-select v-model="form.gender" placeholder="Please select gender">
            <el-option label="Male" value="Male" />
            <el-option label="Female" value="Female" />
          </el-select>
        </el-form-item>

        <el-form-item label="Contact Details">
          <div class="grid grid-cols-2 gap-2 w-full">
            <el-input
              v-model="form.phone"
              placeholder="Phone Number"
              prop="phone"
            />
            <el-input v-model="form.email" placeholder="Email" prop="email" />
          </div>
        </el-form-item>
        <el-form-item label="Occupation">
          <el-input v-model="form.occupation" />
        </el-form-item>
        <el-form-item label="Address">
          <el-input v-model="form.address" />
        </el-form-item>
        <div class="flex gap-1 items-center-safe">
          <div class="grid grid-cols-2 gap-2 w-full">
            <el-form-item label="Name & Contact">
              <el-input
                v-model="form.emergencyContactName"
                placeholder="Emergency Contact Name"
              />
            </el-form-item>

            <el-form-item>
              <el-input
                v-model="form.emergencyContactNumber"
                placeholder="Emengency Phone Number"
              />
            </el-form-item>
          </div>
        </div>
        <el-form-item label="Allergies" prop="allergies">
          <el-input-tag
            v-model="form.allergies"
            placeholder="Enter the vaious allergies"
            aria-label="Please click the Enter key after input"
          />
        </el-form-item>
        <el-form-item label="Medical Note">
          <el-input v-model="form.medicalNotes" type="textarea" />
        </el-form-item>
        <div class="grid grid-cols-2 gap-2 mt-12">
          <Button label="Cancel" severity="secondary" @click="emit('close')" />
          <Button label="Update" @click="onSubmit" severity="info" />
        </div>
      </el-form>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { serverTimestamp, updateDoc, doc } from "firebase/firestore"
import { db } from "../firebase";
import { defineEmits } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { ElLoading } from 'element-plus'
import { date } from "zod";

const store = useStore();
const emit = defineEmits(["close"]);
const formRef = ref();

const generatePatientID = () => {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `PAT-${date}-${random}`;
};

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const form = reactive({
  companyId: store.state.companyID,
  patientID: generatePatientID(),
  firstName: "",
  lastName: "",
  otherName: "",
  gender: "",
  dob: "",
  age: null,
  phone: "",
  email: "",
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  allergies: [],
  medicalNotes: "",
  date: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
});

watch(() => props.data, (data) => {
    if(data){
        Object.assign(form,data)
    }
},{ immediate: true },)

const rules = {
  firstName: [{ required: true, message: "Name's is required", trigger: "blur" }],
  lastName: [{ required: true, message: "Name's is required", trigger: "blur" }],
  gender: [{ required: true, message: "Gender is required", trigger: "blur" }],
  dob: [{ required: true, message: "DOB is required", trigger: "blur" }],
  age: [{ required: true, message: "Age's is required", trigger: "blur" }],
  phone: [
    { required: true, message: "Phone number is required", trigger: "blur" },
    {
      pattern: /^[0-9+\-\s]+$/,
      message: "Invalid phone number",
      trigger: "blur",
    },
  ],
};

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    const loading = ElLoading.service({
      lock: true,
      text: "Creating record...",
      background: "rgba(0,0,0,.5)",
    });

    try {
       await updateDoc(doc(db, "patients", props.data.id), {
        ...form,
        updatedAt: serverTimestamp(),
        updatedBy: store.state.username,
      });

      ElMessage.success("Patient Details created successfully");

      emit("close");
    } catch (error) {
      console.error(error);
      ElMessage.error("Failed to create patient");
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

.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 30px;
  max-height: 90vh;
  width: 45vw;
  border-radius: 8px;
  overflow: auto;
  font-family:
    Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
