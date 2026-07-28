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
          'patientName',
          'patientID',
          'appointmentDate',
          'appointmenttime',
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
                  Add Appointment
                </button>
              </div>
            </div>
          </div>
        </template>
        <template #empty> No Data found. </template>
        <Column field="date" header="Created At" style="width: 12%"></Column>
        <Column
          field="patientName"
          header="Patient Name"
          style="width: 20%"
        ></Column>
        <Column header="Patieny ID" style="width: 15%"
          ><template #body="slotProps">
            <el-link
              @click="viewPatient(slotProps.data.patientID)"
              type="primary"
              >{{ slotProps.data.patientID }}</el-link
            >
          </template></Column
        >
        <Column
          field="appointmentDate"
          header="Apointment Date"
          style="width: 13%"
        ></Column>
        <Column
          field="appointmenttime"
          header="Apointment Time"
          style="width: 12%"
        ></Column>
        <Column field="phone" header="Number" style="width: 12%"></Column>
        <Column field="status" header="Status" style="width: 16%"></Column>
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
                v-if="slotProps.data.status !== 'Completed'"
                @click="updateData(slotProps.data)"
                icon="pi pi-pencil"
                severity="info"
                variant="text"
                raised
                rounded
                aria-label="Search"
                size="small"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </main>
  <AddNewAppointment v-if="modal_add" @close="modal_add = false" />
  <UpdateAppointment
    v-if="modal_update"
    @close="modal_update = false"
    :data="selectedData"
  />
  <AddNewReport
    v-if="modal_create"
    @close="modal_create = false"
    :data="selectedData"
    text="Appointment"
  />
   <ViewPatientDetails v-if="modal_view" @close="modal_view = false" :id="selectedId" />
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
import AddNewAppointment from "../../components/AddNewAppointment.vue";
import UpdateAppointment from "../../components/UpdateAppointment.vue";
import AddNewReport from "../../components/AddNewReport.vue";
import ViewPatientDetails from "../../components/ViewPatientDetails.vue";

const selectedFilter = ref("All");
const filterOptions = ["Today", "All"];
const modal_add = ref(false);
const modal_delete = ref(false);
const modal_update = ref(false);
const modal_create = ref(false);
const modal_view = ref(false);
const tableData = ref([]);
// const data = ref([]);
const route = useRoute();
const selectedData = ref(null);
const selectedId = ref(null);
const store = useStore();

const filters = ref({
  global: { value: null },
  patientName: { value: null },
  patientID: { value: null },
  appointmentDate: { value: null },
  appointmenttime: { value: null },
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
    collection(db, "appointments"),
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

// const confirmDelete = (data) => {
//   selectedData.value = data;
//   modal_delete.value = true;
// };

// const deleleData = async () => {
//   const loadingInstance = ElLoading.service({
//     lock: true,
//     text: "Deleting Staff Data...",
//   });
//   if (!selectedData.value) return;
//   const docRef = doc(db, "appointments", selectedData.value.id);
//   await deleteDoc(docRef);
//   modal_delete.value = false;

//   loadingInstance.close();
// };
</script>
