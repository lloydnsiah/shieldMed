import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index.js";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/HomePage.vue"),
  },
  {
    path: "/loading",
    name: "LoadingPage",
    component: () => import("../pages/LoadingPage.vue"),
  },
  {
    path: "/main",
    name: "MainPage",
    component: () => import("../pages/MainPage.vue"),
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import("../pages/views/Dashboard.vue"),
        meta: {
          description: "Dashboard.",
        },
      },
      {
        path: "/patients",
        name: "Patients",
        component: () => import("../pages/views/PatientsPage.vue"),
        meta: {
          description: "View patient information and records.",
        },
      },
      {
        path: "/visits",
        name: "Visits",
        component: () => import("../pages/views/VisitPage.vue"),
        meta: {
          description: "View visit information and records.",
          roles: ["Admin", "Doctor", "Sonographer", "Staff", "SuperAdmin"],
        },
      },
      {
        path: "/appointments",
        name: "Appointments",
        component: () => import("../pages/views/AppointmentPage.vue"),
        meta: {
          description: "View appointment information and records.",
          roles: ["Admin", "Doctor", "Sonographer", "Staff", "SuperAdmin"],
        },
      },
      {
        path: "/reports",
        name: "Reports",
        component: () => import("../pages/views/ReportPage.vue"),
        meta: {
          description: "View report information and records.",
          roles: ["Admin", "Doctor", "Sonographer", "Staff", "SuperAdmin"],
        },
      },
      {
        path: "/invoices",
        name: "Invoices",
        component: () => import("../pages/views/InvoicesPage.vue"),
        meta: {
          description: "View invoice information and records.",
          roles: ["Admin", "Staff", "SuperAdmin"],
        },
      },
      {
        path: "/staff",
        name: "Staff",
        component: () => import("../pages/views/StaffPage.vue"),
        meta: {
          description: "View staff information and records.",
          roles: ["Admin", "SuperAdmin"],
        },
      },
      {
        path: "/services",
        name: "Services",
        component: () => import("../pages/views/ServicesPage.vue"),
        meta: {
          description: "View services information and their prices.",
          roles: ["Admin", "Staff", "SuperAdmin"],
        },
      },
      {
        path: "/company",
        name: "Company Page",
        component: () => import("../pages/views/CompanyPage.vue"),
        meta: {
          description: "View company information.",
          roles: ["SuperAdmin"],
        },
      },
      {
        path: "/patients/:patientId",
        name: "PatientHistory",
        component: () => import("../pages/views/PatientHistoryPage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const role = store.state.userrole;

  if (to.meta.roles && !to.meta.roles.includes(role)) {
    return next({ name: "Dashboard" });
  }

  next();
});

export default router;
