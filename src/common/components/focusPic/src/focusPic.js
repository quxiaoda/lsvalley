import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
    preLoad: 100,
    loading: require('../../../img/img_placehd3.png'),
    listenEvents: [ 'transitionend' ],
    adapter: {
        loaded (listender, Init) {
            console.log('loaded')
        },
        loading (listender, Init) {
            console.log('loading')
        },
        error (listender, Init) {
            console.log('error')
        }
    }
})

const FocusPicConstructor = Vue.extend(require('./FocusPic.vue'))

const getAnInstance = () => {
    return new FocusPicConstructor({
        el: document.createElement('div')
    })
}

const focusPic = (picData = {}) => {
    let instance = getAnInstance()

    instance.source = picData.source || []
    instance.defaultIndex = picData.defaultIndex || 0

    document.getElementById('app').appendChild(instance.$el)
    Vue.nextTick(function() {
        instance.visible = true
    });
}

export default focusPic