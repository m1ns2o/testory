import { createMemoryHistory, createRouter } from "vue-router";
import Login from "@renderer/views/Login.vue";
import Splash from "@renderer/views/Splash.vue";
import Home from "@renderer/views/Home.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Splash",
    component: Splash,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
