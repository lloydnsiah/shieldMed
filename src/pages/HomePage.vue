<template>
  <div>
    <div class="flex px-4 md:px-32 lg:px-52 justify-between py-4 items-center bg-transparent absolute top-0 left-0 right-0 z-80">
      <!-- left  -->
      <div class="flex items-center space-x-8">
        <img src="../images/shield_logo.png" alt="logo" class="size-12" />
        <div class="flex space-x-4 text-sm">
          <div class="flex items-center space-x-2">
            <Icon
              icon="material-symbols:location-on-rounded"
              width="22"
              height="22"
              style="color: #09b2e0"
            />
            <span class="text-secondary">Koforidua, Above TC Pharmacy</span>
          </div>
          <div class="flex items-center space-x-2">
            <Icon
              icon="material-symbols:perm-phone-msg"
              width="24"
              height="24"
              style="color: #09b2e0"
            />
            <span class="text-secondary"
              >Call Us:
              <span class="text-secondary">+233 (0) 243 957 770</span></span
            >
          </div>
        </div>
      </div>
      <!-- right -->
      <div class="flex space-x-5 items-center">
        <div class="flex gap-2 flex-wrap">
          <div class="flex">
            <a
              href="/"
              class="p-0.5 rounded-full bg-secondary/50 hover:bg-secondary shadow-md hover:shadow-lg transition-all hover:translate-y-1 duration-300 flex items-center"
            >
              <img src="../images/facebook.png" alt="" class="size-7" />
            </a>
          </div>
          <div class="flex">
            <a
              href="/"
              class="p-0.5 rounded-full bg-secondary/50 hover:bg-secondary shadow-md hover:shadow-lg transition-all hover:translate-y-1 duration-300 flex items-center"
            >
              <img src="../images/instagram.png" alt="" class="size-7" />
            </a>
          </div>
          <div class="flex">
            <a
              href="/"
              class="p-0.5 rounded-full bg-secondary/50 hover:bg-secondary shadow-md hover:shadow-lg transition-all hover:translate-y-1 duration-300 flex items-center"
            >
              <img src="../images/twitter.png" alt="" class="size-7" />
            </a>
          </div>
        </div>
        <button
          @click="model_login = true"
          class="px-12 py-1.5 rounded-full ml-4 text-lg bg-none border bg-white font-bold border-secondary text-secondary hover:bg-secondary hover:text-white transition-all hover:translate-y-1 duration-300"
        >
          Login
        </button>
      </div>
    </div>
    <HeroSwiper />
  </div>
  <LoginComponent v-if="model_login" @close="model_login = false" />
</template>

<script setup>
import { Icon } from "@iconify/vue";
import HeroSwiper from "../components/HeroSwiper.vue";
import LoginComponent from "../components/LoginComponent.vue";

import { ref } from "vue";


const model_login = ref(false);


</script>
