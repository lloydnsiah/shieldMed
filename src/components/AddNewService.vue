<template>
  <body>
    <div class="form">
      <h2 class="text-2xl font-light text-center mb-6 italic">
        Create New Service
      </h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter Service name" />
        </el-form-item>
        
        <el-form-item label="Category" prop="category">
          <el-select placeholder="Select Category" v-model="form.category">
            <el-option label="General" value="General" />
            <el-option label="Specialized" value="Specialized" />
          </el-select>
        </el-form-item>
        <el-form-item label="Currency" prop="currency">
          <el-select placeholder="Select Currency" v-model="form.currency">
            <el-option label="Ghana Cedi" value="Ghs" />
            <el-option label="USD" value="USD" />
          </el-select>
        </el-form-item>
        <el-form-item label="Cost/Price">
          <el-input-number v-model="form.price" :min="1" class="w-full!"/>
        </el-form-item>

        <div class="grid grid-cols-2 gap-2 mt-8">
            <Button
              label="Cancel"
              severity="secondary"
              @click="emit('close')"
            />
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
const companyData = ref([]);
const state2 = ref("");
const formRef = ref();

const form = reactive({
  companyId: store.state.companyID,
  name: "",
  price: null,
  category: "",
  currency: "",
  date: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
});

const rules = {
  name: [{ required: true, message: "Full name is required", trigger: "blur" }],
  currency: [{ required: true, message: "Full name is required", trigger: "blur" }],
  price: [{ required: true, message: "Full name is required", trigger: "blur" }],
  category: [{ required: true, message: "Full name is required", trigger: "blur" }],
};

const onSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    const loading = ElLoading.service({
      lock: true,
      text: "Creating Service...",
      background: "rgba(0,0,0,.5)",
    });

    try {
      // Check duplicate phone number
      const q = query(
        collection(db, "services"),
        where("name", "==", form.name),
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        loading.close();
        ElMessage.error("Service with this name already exists.");
        return;
      }

      await addDoc(collection(db, "services"), {
        ...form,
        createdAt: serverTimestamp(),
        createdBy: store.state.username,
      });

      ElMessage.success("Service created successfully");

      emit("close");
    } catch (error) {
      console.error(error);
      ElMessage.error("Failed to create service");
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
