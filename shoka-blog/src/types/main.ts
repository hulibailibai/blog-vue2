import { createApp } from "vue";
import "../components/Ai/style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "../App.vue";
import router from "../router/routerss/index";

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.mount("#app");
