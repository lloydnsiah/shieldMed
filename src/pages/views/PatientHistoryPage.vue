<template>
  <main class="p-6 bg-gray-50 min-h-screen">
    <!-- Patient Header -->
    <section v-if="patientData" class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div class="flex flex-col md:flex-row justify-between gap-6">
        <!-- Patient Identity -->
        <div class="flex items-center gap-4">
           <i class="pi pi-arrow-left text-3xl cursor-pointer" @click="router.push({ name: 'Patients'})"></i>
          <div
            class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center"
          >
            <i class="pi pi-user text-3xl text-blue-600"></i>
          </div>

          <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-bold text-gray-800">
              {{ patientData.firstName }}
              {{ patientData.lastName }}
              {{ patientData.otherName }}
            </h1>

            <p class="text-sm text-gray-500">
              Patient ID: {{ patientData.patientID }}
            </p>

            <div class="flex gap-4 mt-1 text-sm text-gray-600">
              <span>
                <i class="pi pi-user mr-1" style="font-size: 0.8rem"></i>
                {{ patientData.gender }}
              </span>

              <span>
                <i class="pi pi-calendar mr-1" style="font-size: 0.8rem"></i>
                {{ patientData.age }} years
              </span>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="flex flex-col gap-2 text-sm text-gray-600 min-w-50">
          <span class="flex items-center gap-4">
            <i class="pi pi-phone" style="font-size: 0.8rem"></i>
            {{ patientData.phone }}
          </span>

          <span class="flex items-center gap-4">
            <i class="pi pi-envelope" style="font-size: 0.8rem"></i>
            {{ patientData.email || "No email provided" }}
          </span>

          <span class="flex items-center gap-4">
            <i class="pi pi-map-marker" style="font-size: 0.8rem"></i>
            {{ patientData.address || "No address provided" }}
          </span>
        </div>
      </div>
    </section>

    <!-- Summary Cards -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500"> Appointments </span>

          <i class="pi pi-calendar text-blue-500"></i>
        </div>

        <h2 class="text-3xl font-bold mt-3">
          {{ appointmentData.length }}
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500"> Visits </span>

          <i class="pi pi-heart text-purple-500"></i>
        </div>

        <h2 class="text-3xl font-bold mt-3">
          {{ visitData.length }}
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500"> Invoices </span>

          <i class="pi pi-file text-orange-500"></i>
        </div>

        <h2 class="text-3xl font-bold mt-3">
          {{ invoicesData.length }}
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500"> Total Paid </span>

          <i class="pi pi-money-bill text-green-500"></i>
        </div>

        <h2 class="text-3xl font-bold mt-3">GH₵ {{ totalPaid.toFixed(2) }}</h2>
      </div>
    </section>

    <!-- Main Content -->
    <section class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- Left Column -->
      <div class="xl:col-span-3 flex flex-col gap-6">
        <!-- Appointments -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Appointments</h2>
          </div>

          <DataTable
            :value="appointmentData"
            scrollable
            :paginator="appointmentData?.length > 5"
            :rows="5"
            :rowsPerPageOptions="[5, 10]"
            size="small"
          >
            <Column field="date" header="Created At" style="width: 20%" />
            <Column field="appointmentDate" header="Date" style="width: 20%" />
            <Column field="appointmenttime" header="Time" style="width: 20%" />
            <Column field="doctor" header="Doctor" style="width: 20%" />
            <Column field="status" header="Status" style="width: 20%" />
          </DataTable>
        </div>

        <!-- Visits -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Visit History</h2>
          </div>

          <DataTable
            :value="visitData"
            scrollable
           :paginator="visitData?.length > 5"
            :rows="5"
            :rowsPerPageOptions="[5, 10]"
            size="small"
          >
            <Column field="date" header="Date" style="width: 25%" />
            <Column field="patientType" header="Patient Type" style="width: 25%" />
            <Column field="reason" header="Reason" style="width: 25%" />
            <Column field="status" header="Status" style="width: 25%" />
          </DataTable>
        </div>
        <!-- Invoices -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Invoices History</h2>
          </div>
          <DataTable
            :value="invoicesData"
            scrollable
           :paginator="invoicesData?.length > 5"
            :rows="5"
            :rowsPerPageOptions="[5, 10]"
            size="small"
          >
            <Column field="date" header="Date" />

            <Column field="patient.name" header="Patient name" />
            <Column field="report.type" header="Type" />
            <Column field="report.type" header="Services">
             <template #body="{ data }"> {{ data.services.length }} </template>
            </Column>
            <Column field="report.type" header="Additional Ser">
             <template #body="{ data }"> {{ data.additionalCharges.length }} </template>
            </Column>
            <Column field="grandtotal" header="Grand Total" />
          </DataTable>
        </div>
      </div>

      <!-- Right Column -->
      <div class="flex flex-col gap-6">
        <!-- Patient Details -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-5">Patient Information</h2>

          <div class="flex flex-col gap-4 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500"> Date of Birth </span>

              <span class="font-medium">
                {{ patientData?.dob ? new Date(patientData.dob.seconds * 1000).toLocaleDateString() : "Not provided" }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-500"> Occupation </span>

              <span class="font-medium">
                {{ patientData?.occupation || "Not provided" }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-500"> Blood Group </span>

              <span class="font-medium">
                {{ patientData?.bloodGroup || "Not provided" }}
              </span>
            </div>

            <div>
              <span class="text-gray-500"> Allergies </span>

              <p class="mt-1 font-medium">
                {{ patientData?.allergies?.join(", ") || "None recorded" }}
              </p>
            </div>

            <div>
              <span class="text-gray-500"> Medical Notes </span>

              <p class="mt-1 font-medium">
                {{ patientData?.medicalNotes || "No medical notes" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Emergency Contact -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-5">Emergency Contact</h2>

          <div class="flex flex-col gap-2 text-sm">
            <span class="font-medium">
              {{ patientData?.emergencyContactName }}
            </span>

            <span class="text-gray-500">
              {{ patientData?.emergencyContactNumber }}
            </span>
          </div>
        </div>

        <!-- Invoices -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Recent Invoices</h2>

            <Button label="View All" text size="small" />
          </div>

          <div
            v-if="invoicesData.length === 0"
            class="text-center text-gray-400 py-6"
          >
            No invoices found
          </div>

          <div
            v-for="invoice in invoicesData.slice(0, 5)"
            :key="invoice.id"
            class="flex justify-between items-center py-3 border-b last:border-b-0"
          >
            <div>
              <p class="font-medium">
                {{ invoice.invoiceId }}
              </p>

              <p class="text-xs text-gray-500">
                {{ invoice.date }}
              </p>
            </div>

            <span class="font-semibold">
              GH₵ {{ Number(invoice.grandtotal || 0).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElLoading } from "element-plus";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();
const store = useStore();

const patientId = route.params.patientId;

const patientData = ref(null);
const appointmentData = ref([]);
const invoicesData = ref([]);
const visitData = ref([]);

const totalPaid = computed(() => {
  return invoicesData.value.reduce((total, invoice) => {
    return total + Number(invoice.grandtotal || 0);
  }, 0);
});

// Store unsubscribe callbacks to clean up listeners when component unmounts
const unsubscribers = [];

onMounted(() => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading Patient Data...",
  });

  const companyId = store.state.companyID;

  // 1. Patient Query
  const patientQuery = query(
    collection(db, "patients"),
    where("companyId", "==", companyId),
    where("patientID", "==", patientId),
  );

  const unsubPatient = onSnapshot(patientQuery, (snapshot) => {
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      patientData.value = { id: docSnap.id, ...docSnap.data() };
    } else {
      patientData.value = null;
    }
    // Close loading overlay once primary patient data loads
    loadingInstance.close();
  });
  unsubscribers.push(unsubPatient);

  // 2. Invoices Query
  const invoiceQuery = query(
    collection(db, "invoices"),
    where("companyId", "==", companyId),
    where("patient.id", "==", patientId),
  );

  const unsubInvoices = onSnapshot(invoiceQuery, (snapshot) => {
    invoicesData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });
  unsubscribers.push(unsubInvoices);

  // 3. Visits Query
  const visitQuery = query(
    collection(db, "visits"),
    where("companyId", "==", companyId),
    where("patientID", "==", patientId),
  );

  const unsubVisits = onSnapshot(visitQuery, (snapshot) => {
    visitData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });
  unsubscribers.push(unsubVisits);

  // 4. Appointments Query
  const appointmentQuery = query(
    collection(db, "appointments"),
    where("companyId", "==", companyId),
    where("patientID", "==", patientId),
  );

  const unsubAppointments = onSnapshot(appointmentQuery, (snapshot) => {
    appointmentData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });
  unsubscribers.push(unsubAppointments);
});

// Clean up Firestore listeners on unmount
onUnmounted(() => {
  unsubscribers.forEach((unsub) => unsub());
});
</script>
