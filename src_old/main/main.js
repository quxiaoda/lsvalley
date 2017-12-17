import Vue from 'vue';
import store from './store';
import comment from './components' 
import VueRouter from 'vue-router'
import routes from './router.js'
import vConsole from 'vconsole/dist/vconsole.min'

Vue.use(VueRouter)
Vue.use(require('vue-wechat-title'))


let router = new VueRouter({
  routes,
  mode: 'hash'
})

let vm = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(comment)
})
