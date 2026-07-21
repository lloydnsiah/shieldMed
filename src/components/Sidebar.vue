<template>
  <main>
    <div class="w-72 h-screen shrink-0 bg-[#191F2F] px-4 py-8 flex flex-col gap-8">
        <div class="flex items-center gap-4">
            <img src="../images/shield_logo.png" alt="Logo" class="w-8 h-8" />
            <div>
                <h1 class="text-white text-lg font-bold italic">Shield Medical Center</h1>
                <span class="text-gray-400 text-sm italic">Role: {{ store.state.userrole }}</span>
            </div>
        </div>
        <span class="text-gray-400 text-sm">MAIN MENU</span>

        <div class="flex flex-col gap-8">
            <router-link 
            :to="{ name: 'Dashboard' }" 
            class="item flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-300 relative">
              <i class="pi pi-home"></i>
                Dashboard
                 <span class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 hidden rounded  bg-gray-400"></span>
            </router-link>
            <router-link 
            :to="{ name: 'Patients' }" 
            class="item flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-300 relative">
              <i class="pi pi-users"></i>
           <span class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 hidden rounded  bg-gray-400"></span>
              Patients
            </router-link>
            <router-link 
            :to="{ name: 'Visits' }" 
            class="item flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-300 relative">
              <i class="pi pi-address-book"></i>
           <span class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 hidden rounded  bg-gray-400"></span>
              Visit
            </router-link>
            <router-link 
            :to="{ name: 'Appointments' }" 
            class="item flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-300 relative">
              <i class="pi pi-calendar"></i>
           <span class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 hidden rounded  bg-gray-400"></span>
              Appointments
            </router-link>
            <router-link 
            :to="{ name: 'Reports' }" 
            class="item flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-300 relative">
              <i class="pi pi-file"></i>
           <span class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 hidden rounded  bg-gray-400"></span>
              Reports
            </router-link>
            <router-link 
            v-if="store.state.userrole === 'SuperAdmin' || store.state.userrole === 'Admin' ||store.state.userrole === 'Staff'"
            :to="{ name: 'Invoices' }" 
            class="item flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-300 relative">
              <i class="pi pi-receipt"></i>
           <span class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 hidden rounded  bg-gray-400"></span>
              Invoices
            </router-link>
            <router-link 
            v-if="store.state.userrole === 'SuperAdmin' || store.state.userrole === 'Admin'"
            :to="{ name: 'Staff' }" 
            class="item flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-300 relative">
              <i class="pi pi-user-plus"></i>
           <span class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 hidden rounded  bg-gray-400"></span>
              Staff
            </router-link>
            <router-link 
            v-if="store.state.userrole === 'SuperAdmin' || store.state.userrole === 'Admin' ||store.state.userrole === 'Staff'"
            :to="{ name: 'Services' }" 
            class="item flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-300 relative">
              <i class="pi pi-copy"></i>
           <span class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 hidden rounded  bg-gray-400"></span>
              Services
            </router-link>
            <router-link 
            v-if="store.state.userrole === 'SuperAdmin'"
            :to="{ name: 'Company Page' }" 
            class="item flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-300 relative">
              <i class="pi pi-objects-column"></i>
           <span class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 hidden rounded  bg-gray-400"></span>
              Company
            </router-link>
            <!-- <router-link 
            :to="{ name: 'Settings' }" 
            class="item flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-300 relative">
              <i class="pi pi-cog"></i>
           <span class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 hidden rounded  bg-gray-400"></span>
              Settings
            </router-link> -->
        </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from "vuex";

const store = useStore();

</script>

<style scoped>
.router-link-exact-active {
  color: #fff;
}

.router-link-exact-active span {
  background-color: red;
  display: block;
}

.item:hover span{
  display: block;
}
</style>

