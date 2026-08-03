<template>
  <main class="flex flex-col min-h-full px-8 py-4">
    <div class="card">
      <DataTable
        :value="tableData"
        scrollable
        scrollHeight="650px"
        :paginator="filteredData?.length > 5"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 15]"
        tableStyle="min-width: 50rem"
        v-model:filters="filters"
        :globalFilterFields="[
          'name',
          'email',
          'number',
          'role',
          'companyName',
        ]"
      >
        <template #header>
          <div class="flex justify-content-end">
            <div class="flex items-center w-full justify-between">
              <div class="flex flex-col gap-1">
                <h1 class="text-2xl font-bold text-gray-800">
                  {{ route.name }}
                </h1>
                <p class="text-gray-600 italic">{{ route.meta.description }}</p>
              </div>
              <div class="flex gap-2">
                <IconField iconPosition="left">
                  <InputIcon>
                    <i class="pi pi-search"></i>
                  </InputIcon>
                  <InputText
                    v-model="filters['global'].value"
                    placeholder="Keyword Search"
                  />
                </IconField>
                <button
                @click="modal_add=true"
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  Add Staff
                </button>
              </div>
            </div>
          </div>
        </template>
        <template #empty> No Data found. </template>
        <Column field="date" header="Created At" style="width: 15%"></Column>
        <Column field="name" header="Full Name" style="width: 20%"></Column>
        <Column field="email" header="Email" style="width: 15%"></Column>
        <Column field="number" header="Phone Number" style="width: 15%"></Column>
        <Column field="role" header="Role" style="width: 10%"></Column>
        <Column field="status" header="Status" style="width: 10%"></Column>
        <Column field="companyName" header="Company" style="width: 15%"></Column>
        
        <Column header="Actions"  v-if="store.state.userrole === 'Admin'">
          <template #body="slotProps">
            <div class="flex flex-row gap-4">
              <Button
              @click="updateData(slotProps.data)"
                icon="pi pi-pencil"
                severity="info"
                variant="text"
                raised
                rounded
                aria-label="Search"
                size="small"
              />
              <Button
               @click="confirmDelete(slotProps.data)"
                icon="pi pi-times"
                severity="danger"
                variant="text"
                raised
                rounded
                aria-label="Cancel"
                size="small"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </main>
  <AddNewStaff v-if="modal_add" @close="modal_add= false" />
  <UpdateStaff v-if="modal_update" @close="modal_update = false" :data="selectedData" />
  <DeleteDialog v-if="modal_delete" @close="modal_delete = false" @delete="deleleData" />
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { ElLoading } from "element-plus";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useStore } from "vuex";
import AddNewStaff from "../../components/AddNewStaff.vue";
import UpdateStaff from "../../components/UpdateStaff.vue";
import DeleteDialog from "../../components/DeleteDialog.vue";

const modal_add = ref(false);
const modal_delete = ref(false);
const modal_update = ref(false);
const tableData = ref([]);
// const data = ref([]);
const route = useRoute();
const selectedData = ref(null);
const store = useStore();

const filters = ref({
  global: { value: null },
  name: { value: null },
  email: { value: null },
  number: { value: null },
  role: { value: null },
  companyName: { value: null },
});

onMounted(() => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading Staff Data...",
  });

  const usersCollection = query(
    collection(db, "users"),
    where("companyId", "==", store.state.companyID),
    orderBy("createdAt", "desc"),
  );
  onSnapshot(usersCollection, (snapshot) => {
    tableData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    loadingInstance.close();
  });
});

const updateData = (data) => {
  selectedData.value = data;
  modal_update.value = true;
};

const confirmDelete = (data) => {
  selectedData.value = data;
  modal_delete.value = true;
};

const deleleData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Deleting Staff Data...",
  });
  if (!selectedData.value) return;
  const docRef = doc(db, "users", selectedData.value.id);
  await deleteDoc(docRef);
  modal_delete.value = false;

  loadingInstance.close();
};
</script>
