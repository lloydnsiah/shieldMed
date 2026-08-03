<template>
  <main class="flex flex-col min-h-full px-8 py-4">
    <div class="card">
      <DataTable
        :value="filteredData"
        scrollable
        scrollHeight="650px"
        :paginator="filteredData?.length > 5"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 15]"
        tableStyle="min-width: 50rem"
        v-model:filters="filters"
        :globalFilterFields="[
          'patientName',
          'patientID',
          'patientType',
          'phone',
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
                <button
                  @click="modal_add = true"
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  Add New Record
                </button>
              </div>
            </div>
          </div>
        </template>
        <template #empty> No Record found. </template>
        <Column field="date" header="Created At" style="width: 10%"></Column>
        <Column
          field="patientName"
          header="Patient Name"
          style="width: 18%"
        ></Column>
        <Column header="Patient ID" style="width: 14%">
          <template #body="slotProps">
            <el-link
              @click="viewPatient(slotProps.data.patientID)"
              type="primary"
              >{{ slotProps.data.patientID }}</el-link
            >
          </template>
        </Column>
        <Column
          field="patientType"
          header="Patient Type"
          style="width: 10%"
        ></Column>
        <Column field="phone" header="Number" style="width: 10%"></Column>
        <Column
          field="doctor"
          header="Doctor Needed"
          style="width: 10%"
        ></Column>
        <Column field="reason" header="Reason" style="width: 20%"></Column>
        <Column field="status" header="Status" style="width: 10%"></Column>
        <Column header="Actions">
          <template #body="slotProps">
            <div class="flex flex-row gap-4">
              <Button
                v-if="!slotProps.data.reportId"
                @click="createReport(slotProps.data)"
                icon="pi pi-qrcode"
                severity="success"
                variant="text"
                raised
                rounded
                aria-label="Search"
                size="small"
              />
              <Button
                v-if="
                  !slotProps.data.reportId &&
                  !['Completed', 'Cancelled'].includes(slotProps.data.status)
                "
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
                v-if="!slotProps.data.reportId"
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
  <AddNewVisit v-if="modal_add" @close="modal_add = false" />
  <UpdateVisit
    v-if="modal_update"
    @close="modal_update = false"
    :data="selectedData"
  />
  <AddNewReport
    v-if="modal_create"
    @close="modal_create = false"
    :data="selectedData"
    text="Walk-In"
  />
  <DeleteDialog
    v-if="modal_delete"
    @close="modal_delete = false"
    @delete="deleleData"
  />
  <ViewPatientDetails
    v-if="modal_view"
    @close="modal_view = false"
    :id="selectedId"
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
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useStore } from "vuex";
import AddNewVisit from "../../components/AddNewVisit.vue";
import AddNewReport from "../../components/AddNewReport.vue";
import UpdateVisit from "../../components/UpdateVisit.vue";
import DeleteDialog from "../../components/DeleteDialog.vue";
import ViewPatientDetails from "../../components/ViewPatientDetails.vue";

const selectedFilter = ref("All");
const filterOptions = ["Today", "All"];
const modal_add = ref(false);
const modal_delete = ref(false);
const modal_update = ref(false);
const modal_create = ref(false);
const modal_view = ref(false);
const tableData = ref([]);
const route = useRoute();
const selectedData = ref(null);
const selectedId = ref(null);
const store = useStore();

const filters = ref({
  global: { value: null },
  patientName: { value: null },
  patientID: { value: null },
  patientType: { value: null },
  status: { value: null },
  phone: { value: null },
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
    collection(db, "visits"),
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

const createReport = (data) => {
  selectedData.value = data;
  modal_create.value = true;
};
const viewPatient = (id) => {
  selectedId.value = id;
  modal_view.value = true;
};

const confirmDelete = (data) => {
  selectedData.value = data;
  modal_delete.value = true;
};

const deleleData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Deleting Data...",
  });
  if (!selectedData.value) return;
  const docRef = doc(db, "visits", selectedData.value.id);
  await deleteDoc(docRef);
  modal_delete.value = false;

  loadingInstance.close();
};
</script>
