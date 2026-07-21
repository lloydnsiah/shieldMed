<template>
  <section class="flex flex-col gap-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 px-1">
      <div
        class="bg-white h-36 rounded shadow shadow-green px-8 flex flex-col gap-2 justify-center relative overflow-hidden"
      >
        <span class="text-lg italic">Today's Appointments</span>
        <h2 class="text-5xl font-bold text-green">{{ todayAppointments }}</h2>
        <span
          class="absolute top-0 right-0 w-12 h-12 bg-green text-white rounded-bl flex items-center justify-center"
          ><i class="pi pi-calendar"></i
        ></span>
      </div>
      <div
        class="bg-white h-36 rounded shadow-sm shadow-purple px-8 flex flex-col gap-2 justify-center relative overflow-hidden"
      >
        <span class="text-lg text-gray-700 italic">Today's Visits</span>
        <h2 class="text-5xl font-bold text-purple">{{ todayVisits }}</h2>
        <span
          class="absolute top-0 right-0 w-12 h-12 bg-purple text-white rounded-bl flex items-center justify-center"
          ><i class="pi pi-clock"></i
        ></span>
      </div>
      <div
        class="bg-white h-36 rounded shadow-sm shadow-orange px-8 flex flex-col gap-2 justify-center relative overflow-hidden"
      >
        <span class="text-lg text-gray-700 italic"
          >Completed Services Today</span
        >
        <h2 class="text-5xl font-bold text-orange">{{ todayServices }}</h2>
        <span
          class="absolute top-0 right-0 w-12 h-12 bg-orange text-white rounded-bl flex items-center justify-center"
        >
          <i class="pi pi-file"></i
        ></span>
      </div>
      <div
        class="bg-white h-36 rounded shadow-sm shadow-blue px-8 flex flex-col gap-2 justify-center relative overflow-hidden"
      >
        <span class="text-lg text-gray-700 italic">Today's Revenue</span>
        <h2 class="text-5xl font-bold text-blue">
          GH₵ {{ todayRevenue.toFixed(2) }}
        </h2>
        <span
          class="absolute top-0 right-0 w-12 h-12 bg-blue text-white rounded-bl flex items-center justify-center"
          ><i class="pi pi-money-bill"></i
        ></span>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 px-1">
      <div class="flex flex-col gap-2">
        <div
          class="bg-purple text-white h-26 rounded shadow shadow-purple px-8 flex gap-2 justify-between items-center relative overflow-hidden"
        >
          <span class="text-lg italic">Patients Waiting</span>
          <h2 class="text-4xl italic">{{ totalWaiting }}</h2>
          <!-- <span
            class="absolute top-0 right-0 w-12 h-12 bg-purple text-white rounded-bl flex items-center justify-center"
            ><i class="pi pi-clock"></i
          ></span> -->
        </div>
        <div
          class="h-26 rounded shadow bg-purple text-white px-8 flex gap-2 justify-between items-center relative overflow-hidden"
        >
          <span class="text-lg italic"
            >Pateints Waiting For Consultation</span
          >
          <h2 class="text-4xl italic">
            {{ totalWaitingConsultation }}
          </h2>
          <!-- <span
            class="absolute top-0 right-0 w-12 h-12 bg-purple text-white rounded-bl flex items-center justify-center"
            ><i class="pi pi-clock"></i
          ></span> -->
        </div>
        <div
          class="h-26 rounded px-8 flex gap-2 items-center shadow bg-green text-white"
        >
          <span class="text-lg w-1/2 italic"
            >Total Appointments for the Month of
            {{ months[currentMonthIndex] }}:
          </span>
          <h2 class="text-4xl w-1/2 text-end italic">
            {{ monthlyAppointments }}
          </h2>
        </div>
        <div
          class="h-26 rounded px-8 flex gap-2 items-center shadow bg-purple text-white"
        >
          <span class="text-lg w-1/2 italic"
            >Total Visits for the Month of {{ months[currentMonthIndex] }}:
          </span>
          <h2 class="text-4xl w-1/2 text-end italic">{{ monthlyVisits }}</h2>
        </div>
        <div
          class="h-26 rounded px-8 flex gap-2 items-center shadow bg-orange text-white"
        >
          <span class="text-lg w-1/2 italic"
            >Total Services for the Month of {{ months[currentMonthIndex] }}:
          </span>
          <h2 class="text-4xl w-1/2 text-end italic">{{ monthlyServices }}</h2>
        </div>
        <div
          class="h-26 rounded px-8 flex gap-2 items-center shadow bg-blue text-white"
        >
          <span class="text-lg w-1/2 italic"
            >Total Revenue for the Month of {{ months[currentMonthIndex] }}:
          </span>
          <h2 class="text-4xl w-1/2 text-end italic">
            Ghc{{ monthlyRevenue.toFixed(2) }}
          </h2>
        </div>
      </div>
      <div class="bg-white rounded shadow-lg p-6 w-full">
        <FullCalendar :options="calendarOptions" class="w-full"/>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-6">
      <div class="w-full grid sm:grid-cols-1 xl:grid-cols-2 gap-6">
        <div class="card p-3">
          <h3 class="text-lg font-semibold mb-4">Revenue Chart</h3>
          <Chart
            type="bar"
            :data="chartData"
            :options="chartOptions"
            class="h-120"
          />
        </div>

        <div class="card p-3">
          <h3 class="text-lg font-semibold mb-4">Revenue Monthly Table</h3>
          <el-table :data="tableRows" style="width: 100%; margin-top: 20px">
            <el-table-column prop="month" label="Month" />
            <el-table-column prop="revenue" label="Revenue" />
          </el-table>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-5">
      <div class="w-full grid sm:grid-cols-1 xl:grid-cols-2 gap-6">
        <div class="card p-3">
          <h3 class="text-lg font-semibold mb-4">
            Visit and Appointment Table
          </h3>
          <el-table
            :data="visitTableRows"
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="month" label="Months" />
            <el-table-column prop="appointment" label="Appointments" />
            <el-table-column prop="visit" label="Walk-ins" />
          </el-table>
        </div>
        <div class="card p-3">
          <h3 class="text-lg font-semibold mb-4">
            Visit and Appointment Chart
          </h3>
          <Chart
            type="bar"
            :data="visitChart"
            :options="chartOptions"
            class="h-120"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import Chart from "primevue/chart";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const today = new Date();
const store = useStore();
const currentMonthIndex = today.getMonth();

// Live Firestore data buckets
const invoiceData = ref([]);
const visitData = ref([]);
const appointmentData = ref([]);
const reportData = ref([]);

const chartOptions = ref();

// --- Helper Functions ---
const isToday = (timestamp) => {
  if (!timestamp) return false;
  const d = timestamp.toDate();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

const isCurrentMonth = (timestamp) => {
  if (!timestamp) return false;
  const d = timestamp.toDate();
  return (
    d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  );
};

// --- Today's KPI Metrics (Header Cards) ---
const todayAppointments = computed(() => {
  return appointmentData.value.filter((a) => isToday(a.createdAt)).length;
});

const todayVisits = computed(() => {
  return visitData.value.filter((v) => isToday(v.createdAt)).length;
});

const todayRevenue = computed(() => {
  return invoiceData.value
    .filter((i) => isToday(i.createdAt))
    .reduce((sum, item) => sum + Number(item.grandtotal || 0), 0);
});

const totalWaiting = computed(() => {
  return visitData.value.filter((visit) => visit.status === "Waiting").length;
});

const totalWaitingConsultation = computed(() => {
  return visitData.value.filter(
    (visit) => visit.status === "Waiting Consultation",
  ).length;
});

const todayServices = computed(() => {
  return reportData.value
    .filter((r) => isToday(r.createdAt))
    .reduce((total, report) => total + (report.services?.length || 0), 0);
});

// --- Active/Current Month Metrics ---
const monthlyAppointments = computed(() => {
  return appointmentData.value.filter((a) => isCurrentMonth(a.createdAt))
    .length;
});

const monthlyVisits = computed(() => {
  return visitData.value.filter((v) => isCurrentMonth(v.createdAt)).length;
});

const monthlyRevenue = computed(() => {
  return invoiceData.value
    .filter((i) => isCurrentMonth(i.createdAt))
    .reduce((sum, item) => sum + Number(item.grandtotal || 0), 0);
});

const monthlyServices = computed(() => {
  return reportData.value
    .filter((r) => isCurrentMonth(r.createdAt))
    .reduce((sum, r) => sum + (r.services?.length || 0), 0);
});

// --- 12-Month Distributed Data (For Charts and Tables) ---
const yearlyRevenueArray = computed(() => {
  const dataset = Array(12).fill(0);
  invoiceData.value.forEach((invoice) => {
    if (!invoice.createdAt) return;
    const month = invoice.createdAt.toDate().getMonth();
    dataset[month] += Number(invoice.grandtotal || 0);
  });
  return dataset;
});

const yearlyAppointmentsArray = computed(() => {
  const dataset = Array(12).fill(0);
  appointmentData.value.forEach((item) => {
    if (!item.createdAt) return;
    const month = item.createdAt.toDate().getMonth();
    dataset[month]++;
  });
  return dataset;
});

const yearlyVisitsArray = computed(() => {
  const dataset = Array(12).fill(0);
  visitData.value.forEach((item) => {
    if (!item.createdAt) return;
    const month = item.createdAt.toDate().getMonth();
    dataset[month]++;
  });
  return dataset;
});

// --- Reactive Chart Configurations ---
const chartData = computed(() => ({
  labels: months,
  datasets: [
    {
      label: "Revenue",
      backgroundColor: "#3b82f6", // tailwind blue-500
      data: yearlyRevenueArray.value,
    },
  ],
}));

const visitChart = computed(() => ({
  labels: months,
  datasets: [
    {
      label: "Appointments",
      backgroundColor: "#10b981", // tailwind green-500
      data: yearlyAppointmentsArray.value,
    },
    {
      label: "Visits",
      backgroundColor: "#8b5cf6", // tailwind purple-500
      data: yearlyVisitsArray.value,
    },
  ],
}));

// --- Reactive Table Data ---
const tableRows = computed(() => {
  return months.map((month, index) => ({
    month,
    revenue: yearlyRevenueArray.value[index].toLocaleString("en-GH", {
      style: "currency",
      currency: "GHS",
    }),
  }));
});

const visitTableRows = computed(() => {
  return months.map((month, index) => ({
    month,
    appointment: yearlyAppointmentsArray.value[index],
    visit: yearlyVisitsArray.value[index],
  }));
});

// --- Chart Styling Options ---
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color") || "#495057";
  const textColorSecondary =
    documentStyle.getPropertyValue("--text-color-secondary") || "#6c757d";
  const surfaceBorder =
    documentStyle.getPropertyValue("--surface-border") || "#dee2e6";

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  };
};

//Calender
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],

  initialView: "dayGridMonth",
  events: calendarEvents.value,
  editable: false,
  selectable: true,

  height: "auto",
  contentHeight: "auto",
  expandRows: true,
}));

const calendarEvents = computed(() => {
  return appointmentData.value.map((item) => ({
    id: item.id,
    title: `${item.patientName}`,
    start: `${item.appointmentDate}T${item.appointmenttime}`,
    color:
      item.status === "Confirmed"
        ? "#3b82f6"
        : item.status === "Completed"
          ? "#22c55e"
          : item.status === "Missed"
            ? "#FF0000"
            : item.status === "Cancelled"
              ? "#ef4444"
              : "#f59e0b",
    extendedProps: item,
  }));
});

// --- Firebase Queries & Live Subscriptions ---
const loadData = () => {
  // Invoices
  const invoiceQuery = query(
    collection(db, "invoices"),
    where("companyId", "==", store.state.companyID),
  );
  onSnapshot(invoiceQuery, (snapshot) => {
    invoiceData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });

  // Visits
  const visitQuery = query(
    collection(db, "visits"),
    where("companyId", "==", store.state.companyID),
  );
  onSnapshot(visitQuery, (snapshot) => {
    visitData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });

  // Appointments
  const appointmentQuery = query(
    collection(db, "appointments"),
    where("companyId", "==", store.state.companyID),
  );
  onSnapshot(appointmentQuery, (snapshot) => {
    appointmentData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });

  // Reports
  const reportQuery = query(
    collection(db, "reports"),
    where("companyId", "==", store.state.companyID),
  );
  onSnapshot(reportQuery, (snapshot) => {
    reportData.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });
};

onMounted(() => {
  chartOptions.value = setChartOptions();
  loadData();
});
</script>
