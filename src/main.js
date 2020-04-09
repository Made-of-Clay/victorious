import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import firebase from './plugins/firebase';
import store from './store'
console.log(firebase);

Vue.config.productionTip = false

new Vue({
    vuetify,

    provide: {
        firebase,
    },

    store,
    render: h => h(App)
}).$mount('#app')
