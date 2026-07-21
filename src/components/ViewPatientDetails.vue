<template>
  <main>
    <div class="card">
      <h1 class="italic">Patient Details</h1>
      <div class="flex gap-16">
        <i class="pi pi-user text-gray-300" style="font-size: 8rem"></i>
        <div class="flex flex-col w-full">
          <div class="flex gap-2 items-center">
            <span class="w-1/4 text-gray-500 py-2 px-3 bg-gray-50 italic"
              >Full Name:
            </span>
            <span
              >{{ viewData?.firstName }} {{ viewData?.lastName }}
              {{ viewData?.otherName }}</span
            >
          </div>
          <div class="flex gap-2 items-center">
            <span class="w-1/4 text-gray-500 py-2 px-3 bg-gray-50 italic"
              >Age:
            </span>
            <span class="">{{ viewData?.age }} yrs</span>
          </div>
          <div class="flex gap-2 items-center">
            <span class="w-1/4 text-gray-500 py-2 px-3 bg-gray-50 italic"
              >Gender:
            </span>
            <span>{{ viewData?.gender }}</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-0.5">
        <div class="flex gap-2 items-center">
          <span class="w-1/4 text-sm text-gray-500 py-2 px-3 italic"
            >Address:
          </span>
          <span class="bg-gray-50 flex-1 py-2 px-4 italic">{{ viewData?.address }}</span>
        </div>
        <div class="flex gap-2 items-center">
          <span class="w-1/4 text-sm text-gray-500 py-2 px-3 italic"
            >Phone Number:
          </span>
          <span class="bg-gray-50 flex-1 py-2 px-4 italic">{{ viewData?.phone }}</span>
        </div>
        <div class="flex gap-2 items-center">
          <span class="w-1/4 text-sm text-gray-500 py-2 px-3 italic"
            >Email:
          </span>
          <span class="bg-gray-50 flex-1 py-2 px-4 italic">{{ viewData?.email }}</span>
        </div>
        <div class="flex gap-2 items-center">
          <span class="w-1/4 text-sm text-gray-500 py-2 px-3 italic"
            >Occupation:
          </span>
          <span class="bg-gray-50 flex-1 py-2 px-4 italic">{{ viewData?.occupation }}</span>
        </div>
        <div class="flex gap-2 items-center">
          <span class="w-1/4 text-sm text-gray-500 py-2 px-3 italic"
            >Emergency Contact:
          </span>
          <span class="bg-gray-50 flex-1 py-2 px-4 italic">{{ viewData?.emergencyContactName }}</span>
        </div>
        <div class="flex gap-2 items-center">
          <span class="w-1/4 text-sm text-gray-500 py-2 px-3 italic"
            >Emergency Number:
          </span>
          <span class="bg-gray-50 flex-1 py-2 px-4 italic">{{ viewData?.emergencyContactNumber }}</span>
        </div>
        <div class="flex gap-2 items-center">
          <span class="w-1/4 text-sm text-gray-500 py-2 px-3 italic"
            >Allergies:
          </span>
          <span class="bg-gray-50 flex-1 px-3 py-2">
            <el-tag
              v-for="(allergy, index) in viewData?.allergies"
              :key="index"
              class="tag-item"
              type="primary"
              style="margin-right: 8px"
            >
              {{ allergy }}
            </el-tag>
          </span>
        </div>
        <div class="flex gap-2 items-center">
          <span class="w-1/4 text-sm text-gray-500 py-2 px-3 italic"
            >Medical Notes:
          </span>
          <span class="bg-gray-50 flex-1 py-2 px-4 italic">{{ viewData?.medicalNotes }}</span>
        </div>
        <div class="flex gap-2 items-center">
          <span class="w-1/4 text-sm text-gray-500 py-2 px-3 italic"
            >Created By:
          </span>
          <span class="bg-gray-50 flex-1 py-2 px-4 italic">{{ viewData?.createdBy }}</span>
        </div>
        <div class="flex gap-2 items-center">
          <span class="w-1/4 text-sm text-gray-500 py-2 px-3 italic"
            >Created At:
          </span>
          <span class="bg-gray-50 flex-1 py-2 px-4 italic">{{ viewData?.date }}</span>
        </div>
      </div>
      <el-button @click="emit('close')">Close</el-button>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from "vue";
import { db } from "../firebase";
import { defineEmits } from "vue";
import { useStore } from "vuex";
import { ElLoading } from "element-plus";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const store = useStore();
const emit = defineEmits(["close"]);
const viewData = ref(null);
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading Patients...",
  });

  const usersCollection = query(
    collection(db, "patients"),
    where("companyId", "==", store.state.companyID),
    where("patientID", "==", props.id),
  );

  onSnapshot(usersCollection, (snapshot) => {
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];

      viewData.value = {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      viewData.value = null;
    }

    loadingInstance.close();
  });
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

.card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #fff;
  padding: 40px 60px;
  width: 40vw;
  max-height: 90vh;
  border-radius: 8px;
  overflow: auto;
}
</style>
