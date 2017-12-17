<template>
    <div id="control" class="control">
        <ul class="control-box">
            <control-item 
                v-for="(val, key) in mergeData" 
                :key="key" 
                :class="[key]"
                :data="val"
                :curItem="key"
                :isRun="Number(mergeData.status.curKey) === 0"
            >
            </control-item>
        </ul>
    </div>
</template>

<script>
import '../css/control.css'

import _ from 'lodash'
import data from '../data.js'
import ControlItem from './control-item.vue'


export default {
    name: 'control',
    data () {
        return {
            data: data
        }
    },
    computed: {
        mergeData: function(){
            return _.merge({},this.data, this.$store.state.controlInfo)
        }
    },
    components: {
        ControlItem
    },
    methods: {
        
    }
}
</script>
