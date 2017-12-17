import Vue from 'vue';
// import store from './store';
import faq from './components';

let vm = new Vue({
    el: '#app',
    // store,
    render: h => h(faq)
});
