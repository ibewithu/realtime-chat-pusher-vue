import { createWebHistory, createRouter } from "vue-router";
import HelloWorld from "../components/HelloWorld";
import ChatBox from "../components/ChatBox";
import CreateRoom from "../components/CreateRoom";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HelloWorld,
  },
  {
    path: "/chat-box/:room",
    name: "ChatBox",
    component: ChatBox,
    props: true
  },
  {
    path: "/create-room/:type",
    name: "create-room",
    component: CreateRoom,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;