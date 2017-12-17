<template>
    <div>
        <Swipe id="bigimg_main" :defaultIndex="defaultIndex" v-show="visible">
            <SwipeItem
                id="dt_big_image"
                v-for="(item, index) of newImageData"
                :handleClick="close"
            >
                <img class="img-item" v-lazy="item" width="100%"/>
            </SwipeItem>
        </Swipe>
        <div id="bg_layer" v-show="visible"></div>
    </div>
</template>

<script>
    import "./focusPic.css"
    import Swipe from "../../swipe"
    import SwipeItem from "../../swipe-item"
    import { changeImgSize } from '../../../utils/base.js'
 
    export default {
        name: 'focus-pic',
        data(){
            return {
                visible: false
            }
        },
        components: {

            Swipe,
            SwipeItem

        },
        props: {
            defaultIndex: {
                type: Number,
                // required: true
                default: 0
            },
            source: {
                type: Array,
                // require: true
                default: function(){// 数组／对象的默认值应当由一个工厂函数返回
                    return []
                }
            }
        },
        computed: {
            newImageData: function(){
                let baseUrl = "http:" + "//z11.tuanimg.com/imagev2/trade/"
                return this.source.map(function(value){
                    return baseUrl + changeImgSize(value, '500x')
                })
            }
        },
        methods: {
            close: function(event){
                this.visible = false;                
                document.getElementById('app').removeChild(this.$el)
            }
        }
    }
</script>