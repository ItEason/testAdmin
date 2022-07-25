import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import * as echarts from 'echarts'


Vue.config.productionTip = false

axios.defaults.baseURL = "http://localhost:8000"
Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
 
Vue.use(ElementUI);

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
