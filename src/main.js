import { createApp } from "vue";
import "./style.css";
// 导入路由组件
import router from "./router";
import App from "./views/home.vue";
const app = createApp(App);
app.use(router);
app.mount("#app");
