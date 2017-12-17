import MainInfo from './components/main_info.vue'
import Manage from './components/manage.vue'
import Control from './components/control.vue'

export default [
    {
        path: '/',
        name: 'MainInfo',
        component: MainInfo,
        meta: {
            title: '长石河谷'
        }
    },
    {
        path: '/manage',
        name: 'Manage',
        component: Manage,
        meta: {
            title: '设备管理'
        }
    },
    {
        path: '/control',
        name: 'Control',
        component: Control,
        meta: {
            title: '设备控制'
        }
    }
]