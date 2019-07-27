import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Vue.prototype.serverURL = 'https://www.imovietrailer.com/superhero';
Vue.prototype.qq = '953920085';

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
