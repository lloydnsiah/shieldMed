import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  plugins: [createPersistedState()],
  
  state: {
    companyID: '',
    username: "",
    userrole: "",
    companyName: "",
    sidebar: false,
  },
  mutations: {  
    SET_USERDATA(state, user) {
      state.username = user.name
      state.userrole = user.role
      state.companyID = user.companyId
      state.companyName = user.companyName
    },
    SET_SIDEBAR(state){
      state.sidebar = !state.sidebar
    }
  },
  actions: {},
  modules: {},
});

export default store;
