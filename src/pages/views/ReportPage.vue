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
          'type',
          'reportID',
          'patientName',
          'patientId',
          'total',
          'status',
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
                  Add Records
                </button> -->
              </div>
            </div>
          </div>
        </template>
        <template #empty> No Data found. </template>
        <Column field="date" header="Created At" style="width: 10%"></Column>
        <Column field="type" header="Type" style="width: 10%"></Column>
        <Column field="reportID" header="ID" style="width: 14%"></Column>
        <Column
          field="patientName"
          header="Patient Name"
          style="width: 20%"
        ></Column>
        <Column
          field="patientId"
          header="Patient Id"
          style="width: 12%"
        ></Column>
        <Column header="Services" style="width: 8%">
          <template #body="slotProps">
            <div>
              {{ slotProps.data.services.length }}
            </div>
          </template>
        </Column>
        <Column header="Total Cost" style="width: 10%">
          <template #body="slotProps">
            <span
              ><b>{{ slotProps.data.total }}</b> <small>Ghs</small></span
            >
          </template>
        </Column>
        <Column field="status" header="Status" style="width: 12%"></Column>
        <Column header="Actions">
          <template #body="slotProps">
            <div class="flex flex-row gap-4">
              <Button
                v-if="!slotProps.data.invoiceId"
                @click="createInvoice(slotProps.data)"
                icon="pi pi-receipt"
                severity="success"
                variant="text"
                raised
                rounded
                aria-label="Search"
                size="small"
              />
              <Button
                v-if="slotProps.data.status !== 'Draft'"
                @click="createInvoice(slotProps.data)"
                icon="pi pi-pencil"
                severity="help"
                variant="text"
                raised
                rounded
                aria-label="Search"
                size="small"
              />
              <!-- <Button
              v-if="slotProps.data.status !=='Draft'"
              @click="createInvoice(slotProps.data)"
                icon="pi pi-check-circle"
                severity="success"
                variant="text"
                raised
                rounded
                aria-label="Search"
                size="small"
              /> -->
              <!-- <Button
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
  <AddInvoice
    v-if="modal_create"
    @close="modal_create = false"
    :data="selectedData"
  />
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
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useStore } from "vuex";
import AddInvoice from "../../components/AddInvoice.vue";

const selectedFilter = ref("All");
const filterOptions = ["Today", "All"];
const modal_add = ref(false);
const modal_delete = ref(false);
const modal_update = ref(false);
const modal_create = ref(false);
const tableData = ref([]);
// const data = ref([]);
const route = useRoute();
const selectedData = ref(null);
const store = useStore();

const filters = ref({
  global: { value: null },
  type: { value: null },
  reportID: { value: null },
  patientName: { value: null },
  patientId: { value: null },
  status: { value: null },
  total: { value: null },
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
    collection(db, "reports"),
    where("companyId", "==", store.state.companyID),
    // orderBy("createdAt", "desc"),
  );
  onSnapshot(usersCollection, (snapshot) => {
    tableData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    loadingInstance.close();
  });
});

const createInvoice = (data) => {
  selectedData.value = data;
  modal_create.value = true;
};
</script>
