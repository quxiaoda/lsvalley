import Vue from 'vue';
import Vuex from 'vuex';
import {
    getUrlKeyVal
} from '../common/utils/base'

Vue.use(Vuex);

const state = {
    isError: false,
    isFetching: true,
    gizwitsws: null,
    GizwitsWS: window.GizwitsWS,
    apiHost: getUrlKeyVal('apiHost'),
    commType: getUrlKeyVal('commType'),
    wechatOpenId: getUrlKeyVal('oid'),
    gizwitsAppId: getUrlKeyVal('gizwitsAppId'),
    deviceList: [],
    rtTime: null, //剩余滤芯
    totalTime: null, //运行时长
    curDid: null,
    pm25: 0,
    air_quality_target: 0, //空气质量目标, 0普通/1敏感/2高敏感
    controlInfo: {
        status: {
            curKey: 1,
        },
        model: {
            curKey: 0,
        },
        speed: {
            curKey: 1,
        },
        time: {
            curKey: 30,
        }
    }
}

const actions = {

}

const mutations = {
    startFetching: function(state){
        state.isFetching = true
    },
    endFetching: function(state, payload){
        state.isFetching = false
        if(payload){
            state.isError = true
        }
    },
    setGizwitsws: function(state, data){
        state.gizwitsws = data
    },
    setStatus: function(state, newVal){
        let {controlInfo} = state
        controlInfo.status.curKey = newVal
    },
    setModel: function(state, newVal){
        let {controlInfo} = state
        controlInfo.model.curKey = newVal
    },
    setSpeed: function(state, newVal){
        let {controlInfo} = state
        controlInfo.speed.curKey = newVal
    },
    setTime: function(state, newVal){
        let {controlInfo} = state
        controlInfo.time.curKey = newVal
    },
    setDeviceList: function(state, data){
        // let {deviceList} = state
        state.deviceList = data || []
    },
    setCurDid: function(state, did){
        // let {curDid} = state
        state.curDid = did
    },
    setPm25: function(state, val){
        // let {pm25} = state
        state.pm25 = val
    },
    setRtTime: function(state, val){
        let percent = val + '%'
        state.rtTime = percent
    },
    setTotalTime: function(state, val){
        let time = parseInt(val/60) + '小时' + val%60 + '分钟'
        state.totalTime = time
    },
    setAirTarget: function(state, val){
        state.air_quality_target = val
    },
}

const getters = {
    curDeviceInfo: state => {
        let {deviceList, curDid} = state
        let result = null
        let filterData = deviceList.filter(function(val){
            return val.did == curDid
        })
        try{
            result = filterData[0]
        }catch(e){
            console.log('数据筛选失败')
        }
        return result
    }
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});
