<template>
    <div id="app">
        <keep-alive>
            <router-view v-wechat-title="$route.meta.title"></router-view>        
        </keep-alive>
    </div>
</template>

<script>
import '../../common/css/base.css'
import '../css/main.css'

export default {
    name: 'main',
    data(){
        return {

        }
    }
}
</script>
