<template>
  <body>
    <div class="form">
      <h2 class="text-2xl font-light text-center mb-6 italic">
       Update Company
      </h2>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="auto"
        style="max-width: 600px"
      >
        <el-form-item label="Company ID" prop="companyId">
          <el-input v-model="form.companyId" placeholder="Enter Company ID" />
        </el-form-item>
        <el-form-item label="Company Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter Company Name" />
        </el-form-item>
        <el-form-item label="Contact Person" prop="contactPerson">
          <el-input
            v-model="form.contactPerson"
            placeholder="Enter Name of Company Representative"
          />
        </el-form-item>
        <el-form-item label="Phone Number" prop="number">
          <el-input
            v-model="form.number"
            placeholder="Enter Refresentative's Number"
          />
        </el-form-item>

        <div class="grid grid-cols-2 gap-2 mt-8">
          <Button label="Cancel" severity="secondary" @click="emit('close')" />
          <Button label="Update" @click.prevent="onSubmit" severity="info" />
        </div>
        
      </el-form>
    </div>
  </body>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { serverTimestamp, updateDoc, doc } from "firebase/firestore"
import { db } from "../firebase";
import { defineEmits } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { ElLoading } from 'element-plus'

const store = useStore();
const emit = defineEmits(["close"]);
const formRef = ref();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const form = reactive({
  companyId: "",
  name: "",
  contactPerson: "",
  number: "",
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
  companyId: [
    { required: true, message: "Company ID is required", trigger: "blur" },
  ],
  name: [
    { required: true, message: "Company name is required", trigger: "blur" },
  ],
  contactPerson: [
    { required: true, message: "Contact person is required", trigger: "blur" },
  ],
  number: [
    { required: true, message: "Phone number is required", trigger: "blur" },
  ],
};

const onSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    const loadingInstance = ElLoading.service({
      lock: true,
      text: 'Saving company...',
    })

    try {
      // ✅ Update COMPANY
      await updateDoc(doc(db, "companies", props.data.id), {
        ...form,
        updatedAt: serverTimestamp(),
        updatedBy: store.state.username,
      })

      ElMessage.success("Company updated successfully")
      emit("close")

    } catch (error) {
      console.error(error)
      ElMessage.error("Failed to update")

    } finally {
      loadingInstance.close()
    }
  })
}
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
