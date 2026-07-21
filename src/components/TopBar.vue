<template>
  <!-- navbar -->
  <div
    class="flex items-center justify-between px-12 py-4 shadow-md shadow-gray-300 bg-white"
  >
    <div class="flex items-center gap-4">
      <Icon
      @click="store.commit('SET_SIDEBAR')"
        class="cursor-pointer"
        icon="material-symbols:menu-rounded"
        width="24"
        height="24"
        style="color: #717171"
      />

      <span class="text-gray-700 italic text-lg"
        >Welcome: {{ store.state.username }} 👋</span
      >
    </div>
    <div class="flex space-x-5 items-center">
      <Icon
        icon="material-symbols:supervised-user-circle"
        width="32"
        height="32"
        style="color: #8a8a8a"
        class="cursor-pointer transition-all hover:translate-y-1 duration-300"
      />

      <Icon
        @click="modal_show = true"
        icon="material-symbols:logout"
        width="24"
        height="24"
        style="color: #fb2c36"
        class="cursor-pointer transition-all hover:translate-y-1 duration-300"
      />
    </div>
  </div>
  <Logout v-if="modal_show" @close="modal_show = false" @delete="logout()" />
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { defineEmits, ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signOut } from "firebase/auth";
import { useStore } from "vuex";
import Logout from "./Logout.vue";

const store = useStore();
const emit = defineEmits(["open"]);
const auth = getAuth();
const router = useRouter();
const modal_show = ref(false);

const logout = () => {
  signOut(auth)
    .then(() => {
      router.push({ name: "Home" });
    })
    .catch((error) => {
      alert(error.message);
    });
};
</script>
