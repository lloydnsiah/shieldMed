<template>
  <main class="flex flex-col min-h-full px-8 py-4">
    <div class="card">
      <DataTable
        :value="filteredData"
        scrollable
        scrollHeight="650px"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 15]"
        tableStyle="min-width: 50rem"
        v-model:filters="filters"
        :globalFilterFields="[
          'patient.name',
          'patient.id',
          'date',
          'total',
          'grandtotal',
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
                <Dropdown
                  v-model="selectedFilter"
                  :options="filterOptions"
                  placeholder="Select Filter"
                  class="w-full md:w-28"
                />
                <!-- <button
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  Add Patient
                </button> -->
              </div>
            </div>
          </div>
        </template>
        <template #empty> No Data found. </template>
        <Column field="date" header="created At" style="width: 12%"></Column>
        <Column
          field="patient.name"
          header="Patient Name"
          style="width: 22%"
        ></Column>
        <Column field="patient.id" header="Patient ID" style="width: 14%"></Column>
        <Column
          header="Services"
          style="width: 11%"
        >
        <template #body="slotProps">
         {{ slotProps.data.services.length }}
        </template>
      </Column>
        <Column
          header="Extra Service"
          style="width: 11%"
        >
        <template #body="slotProps">
         {{ slotProps.data.additionalCharges.length }}
        </template>
      </Column>
        <Column field="total" header="Total" style="width: 10%"></Column>
        <Column field="discount" header="Discount" style="width: 10%"></Column>
        <Column field="grandtotal" header="Gross Total" style="width: 10%"></Column>
        <Column header="Actions">
          <template #body="slotProps">
            <div class="flex flex-row gap-4">
              <Button
               @click="viewInvoice(slotProps.data)"
                icon="pi pi-eye"
                severity="info"
                variant="text"
                raised
                rounded
                aria-label="Search"
                size="small"
              />
              <!-- <Button
               @click="confirmDelete(slotProps.data)"
                icon="pi pi-times"
                severity="danger"
                variant="text"
                raised
                rounded
                aria-label="Cancel"
                size="small"
              /> -->
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </main>
 <ViewInvoice v-if="modal_view" @close="modal_view = false" :data="selectedData" />
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
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
import ViewInvoice from "../../components/ViewInvoice.vue";

const selectedFilter = ref("All");
const filterOptions = ["Today", "All"];
const modal_add = ref(false);
const modal_delete = ref(false);
const modal_view = ref(false);
const modal_create = ref(false);
const tableData = ref([]);
// const data = ref([]);
const route = useRoute();
const selectedData = ref(null);
const store = useStore();

const filters = ref({
  global: { value: null },
  name: { value: null },
  "patient.name": { value: null },
  "patient.id": { value: null },
  date: { value: null },
  total: { value: null },
  grandtotal: { value: null },
});

const filteredData = computed(() => {
  if (!selectedFilter.value || selectedFilter.value === "All") {
    return tableData.value;
  }

  if (selectedFilter.value === "Today") {
    const today = new Date();

    return tableData.value.filter((item) => {
      if (!item.createdAt) return false;

      const d = item.createdAt.toDate();

      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    });
  }

  return tableData.value;
});

onMounted(() => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading Data...",
  });

  const usersCollection = query(
    collection(db, "invoices"),
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

const confirmDelete = (data) => {
  selectedData.value = data;
  modal_delete.value = true;
};
const viewInvoice = (data) => {
  selectedData.value = data;
  modal_view.value = true;
};

const deleleData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Deleting Invoice Data...",
  });
  if (!selectedData.value) return;
  const docRef = doc(db, "invoices", selectedData.value.id);
  await deleteDoc(docRef);
  modal_delete.value = false;

  loadingInstance.close();
};
</script>
