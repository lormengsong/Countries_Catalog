import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import 'vue-ssr-carousel/index.css';
import 'pretty-checkbox';
// Vue.use(VueFbCustomerChat, {

new Vue({
  vuetify,
 
  render: h => h(App)
}).$mount('#app')