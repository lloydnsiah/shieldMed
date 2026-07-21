<template>
  <main class="flex flex-col min-h-full px-8 py-4">
    <div class="flex justify-content-end">
        <div class="flex items-center w-full justify-between">
          <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-bold text-gray-800">
              {{ route.name }}
            </h1>
            <p class="text-gray-600 italic">
              {{ route.meta.description }}
            </p>
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
              @click="modal_add = true"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              Add New Company
            </button>
          </div>
        </div>
      </div>
    <div class="card mx-1 mt-4">
      <div v-if="!tableData.length" class="card">
        <el-empty description="No data available" />
      </div>
      <div v-else class="card">
        <DataTable
          :value="tableData"
          scrollable
          scrollHeight="650px"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 15]"
          tableStyle="min-width: 50rem"
          v-model:filters="filters"
          :globalFilterFields="[
            'name',
            'contactPerson',
            'number',
            'companyId',
          ]"
        >
          <template #empty> No Data found. </template>
          <Column field="date" header="Created At" style="width: 20%"></Column>
          <Column
            field="companyId"
            header="Company ID"
            style="width: 20%"
          ></Column>
          <Column
            field="name"
            header="Company Name"
            style="width: 20%"
          ></Column>
          <Column
            field="contactPerson"
            header="Contact Person"
            style="width: 20%"
          ></Column>
          <Column
            field="number"
            header="Phone Number"
            style="width: 20%"
          ></Column>
          <Column header="Actions">
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
    </div>
  </main>
  <AddNewCompany v-if="modal_add" @close="modal_add = false" />
  <UpdateCompany v-if="modal_update" @close="modal_update = false" :data="selectedData" />
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
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import AddNewCompany from "../../components/AddNewCompany.vue";
import DeleteDialog from "../../components/DeleteDialog.vue";
import UpdateCompany from "../../components/UpdateCompany.vue";

const modal_add = ref(false);
const modal_delete = ref(false);
const modal_update = ref(false);
const tableData = ref([]);
const data = ref([]);
const route = useRoute();
const selectedData = ref(null);

const filters = ref({
  global: { value: null },
  name: { value: null },
  contactPerson: { value: null },
  number: { value: null },
  companyId: { value: null },
});

onMounted(() => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading company Data...",
  });

  const usersCollection = collection(db, "companies");

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
    text: "Deleting company Data...",
  });
  if (!selectedData.value) return;
  const docRef = doc(db, "companies", selectedData.value.id);
  await deleteDoc(docRef);
  modal_delete.value = false;

  loadingInstance.close();
};
</script>
