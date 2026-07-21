<template>
  <div
    class="w-full h-screen flex items-center justify-center bg-gray-100 relative"
  >
    <!-- From Uiverse.io by TamaniPhiri -->
    <div class="flex-col gap-4 w-full flex items-center justify-center">
      <div
        class="w-40 h-40 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full"
      >
        <img src="../images/shield_logo.png" alt="logo" class="size-24" />
      </div>
    </div>
    <div
      class="absolute top-5 left-0 right-0 w-full text-gray-400 flex flex-col items-center"
    >
      <span class="text-2xl italic">Welcome: {{ currentUserData.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const name = ref("");
const email = ref("");
const currentUserData = ref({});
const currentUserStatus = ref(null);
const auth = getAuth();

let unsubscribeUser = null;

onMounted(() => {


  onAuthStateChanged(auth, (user) => {
    if (user) {
      name.value = user.email.split("@")[0];
      email.value = user.email;

      loadUser(user.email); // ✅ pass string
    } else {
      currentUserData.value = null;
    }
  });
});

const loadUser = (email) => {
  // cleanup old listener
  if (unsubscribeUser) unsubscribeUser();

  const q = query(
    collection(db, "users"),
    where("email", "==", email),
    limit(1),
  );

  unsubscribeUser = onSnapshot(
    q,
    (querySnapshot) => {
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        currentUserData.value = {
          id: userDoc.id,
          ...userDoc.data(),
        };
        store.commit("SET_USERDATA", currentUserData.value);
        currentUserStatus.value = currentUserData.value.status;
        setTimeout(() => {
          move()
        }, 5000);
      } else {
        ElMessage.error("No user document found for this email.");
        currentUserData.value = null;
        logout();
      }
    },
    (error) => {
      console.error("Error loading user:", error);
      logout();
    },
  );
};

const move = () => {

  if(currentUserStatus.value){
     router.push({ name: "Dashboard"})
  }else{
   logout();
  }
};

const logout = () => {
  signOut(auth)
    .then(() => {
     router.push({ name: 'Home' })
    })
    .catch((error) => {
      alert(error.message);
    });
};


onUnmounted(() => {
  if (unsubscribeUser) unsubscribeUser();
});
</script>
