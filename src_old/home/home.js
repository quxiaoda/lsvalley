import Vue from 'vue';
// import store from './store';
import comment from './components';
import vConsole from 'vconsole/dist/vconsole.min'

let vm = new Vue({
    el: '#app',
    // store,
    render: h => h(comment)
});
