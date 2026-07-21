<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar v-if="store.state.sidebar"/>

    <div class="flex flex-col flex-1 overflow-hidden relative">
      <TopBar />
      <div class="flex-1 overflow-y-auto">
        <router-view />

      </div>
    </div>
     <SpeedDial
     v-if="!store.state.sidebar"
      :model="items"
      direction="up"
      style="position: fixed; left: 2rem; bottom: 2rem"
      :tooltipOptions="{ position: 'right' }"
    />
  </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
import TopBar from "../components/TopBar.vue";
import { useStore } from "vuex";
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();

const items = ref([
    {
        label: 'Dashboard',
        icon: 'pi pi-home',
        command: () => {
            router.push({ name: "Dashboard" });
        }
    },
    {
        label: 'Patients',
        icon: 'pi pi-users',
        command: () => {
            router.push({ name: "Patients" });
        }
    },
    {
        label: 'Visits',
        icon: 'pi pi-address-book',
        command: () => {
            router.push({ name: "Visits" });
        }
    },
    {
        label: 'Appointments',
        icon: 'pi pi-calendar',
        command: () => {
            router.push({ name: "Appointments" });
        }
    },
    {
        label: 'Reports',
        icon: 'pi pi-file',
        command: () => {
            router.push({ name: "Reports" });
        }
    },
    {
        label: 'Invoices',
        icon: 'pi pi-receipt',
        command: () => {
            router.push({ name: "Invoices" });
        }
    },
    {
        label: 'Staff',
        icon: 'pi pi-user-plus',
        command: () => {
            router.push({ name: "Staff" });
        }
    },
    {
        label: 'Services',
        icon: 'pi pi-copy',
        command: () => {
            router.push({ name: "Services" });
        }
    },
   
])
</script>
