<template>

    <li class="control-item" @click="clickHandle">
        <span :class="['icon', 'on'+ data.curKey, isRun?'':'gray']"></span>
        
        <span v-show="flag" class="text">{{data.keys[data.curKey]}}</span>
        <my-popup 
            v-if="data.keys && flag"
            :visible="canShow"
            @maskClickHandle="closePopUp"
        >
            <ul class="sele-box">
                <li class="sele-item title">{{'设置' + data.des}}</li>
                <li class="sele-item"
                    v-for="(val, key) in (data.keyDes || data.keys)" 
                    :key="key"
                    @click.stop="clickItem(key)">
                    {{val}}
                </li>
            </ul>
        </my-popup>
    </li>

</template>

<script>
import '../css/control.css'
import _ from 'lodash'
import config from '../config'
import EventBus from '../EventBus.js'
import myPopup from '../common/components/popup'
import { mapMutations, mapState } from 'vuex'


export default {
    name: 'control-item',
    data () {
        return {
            canShow: false,
        }
    },
    computed: {
        flag: function(){
            console.log(this.curItem ==='status' || this.isRun)
            return this.curItem ==='status' || this.isRun
        }
    },
    props: {
        data: {
            type: Object,
            required: true
        },
        curItem: {
            type: String,
            required: true
        },
        //机器是否在运行
        isRun: {
            type: Boolean,
            required: true
        }
        
    },
    components: {
        myPopup
    },
    methods: {
        ...mapState([
            "gizwitsws",
            "commType"
        ]),
        ...mapMutations([
            'setStatus',
            'setSpeed',
            'setModel',
            'setTime',            
        ]),
        clickHandle() {
            if(this.flag){
                this.canShow = true;
            }
        },
        closePopUp() {
            this.canShow = false;
        },
        clickItem(val){

            this["set"+ _.capitalize(this.curItem)](val)
            this.setAttr(this.curItem, val)
            this.closePopUp()
            
        },
        writeCommand(command) {
            let type = this.commType === 'attrs_v4' ? 'write' : 'raw'
            let _this = this
            try {
                _this.gizwitsws.write(this.did, command);
                console.log(`已对设备 ${this.did} 发送 ${type} 指令`)
            } catch (e) {
                console.log(e)
                console.log('数据格式错误')
            }
        },
        setAttr(key, status) {
            let command = {}

            if(config[key]){
                command[config[key]] = Number(status)
                EventBus.$emit('sendCommond', command)
                // this.deviceAttr[key] = status
            }
            
        }

    }
}
</script>
