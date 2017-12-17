<template>
    <div>
        <Loading v-show="isFetching || isError" :visible="isFetching">
            <p v-if="isError" class="tips" @click="reload">加载失败，点击重新加载</p>
        </Loading>
        <div class="machine" id="machine" v-show="!isFetching && !isError">
            <div :class="['inner-info', air_level]">
                <h3 v-if="curDeviceInfo">{{curDeviceInfo.deviceName}}</h3>
                <span>PM2.5</span>
                <em>{{pm25}}</em>
            </div>
            <div class="options">
                <span>
                    <i :class="['model_icon', 'on'+ controlInfo.model.curKey]"></i>{{modelDes}}</span>
                <span>
                    <i class="speed_icon"></i>{{"0" + controlInfo.speed.curKey}}</span>
            </div>
            <div class="local-info">
                <div class="local">
                    <span>
                        <i></i>{{city}}</span>
                    <span>PM2.5</span>
                </div>
                <div class="pm">{{city_pm2_5}}</div>
            </div>
            <div class="tab-btn">
                <span class="history">
                    <i @click="jumpFn('History')"></i>
                </span>
                <span class="ctrl">
                    <i @click="jumpFn('Control')"></i>
                </span>
            </div>
            <i class="manage-btn" @click="jumpFn('Manage')"></i>
        </div>
    </div>
    
</template>


<script>
import '../css/main-info.css'
import $ from 'jQuery'
import EventBus from '../EventBus.js'
import { mapState, mapGetters } from 'vuex'
import Loading from '../../common/components/loading'
import Toast from '../../common/components/toast'


export default {
    name: 'main-info',
    data() {
        return {
            zjy_devices: [],
            wx_devices: [],
            deviceAttr: null,
            onlineStatus: {},
            did: '',
            command: '',
            isWxReady: false,
            isUnfold: {
                0: false,
                1: false,
                2: false,
                3: false
            },//可写属性是否展开
            city_pm2_5: 0,
            city: ""
        }
    },
    watch: {
        curDid: function(newVal, oldVal){
            if(newVal){
                this.getLocalInfo(newVal)
                
            }
            if(oldVal && newVal && newVal != oldVal){
                this.read(newVal)
            }
        }
    },
    computed: {
        ...mapState([
            "isError",
            "isFetching",
            "gizwitsws",
            "GizwitsWS",
            "apiHost",
            "commType",
            "wechatOpenId",
            "gizwitsAppId",
            "curDid",
            "controlInfo",
            "pm25"
        ]),
        modelDes: function(){
            let key = this.controlInfo.model.curKey
            switch (key){
                case 0:
                    return '智能'
                break;
                case 1:
                    return '手动'                
                break;
                case 2:
                    return '夜间'                
                break;
            }
        },
        ...mapGetters([
            "curDeviceInfo"
        ]),
        air_level: function(){
            let pm25 = this.pm25
            if(pm25 < 50){
                return 'good'
            }else if( pm25 >= 50 && pm25 < 100){
                return 'well'
            } else if( pm25 >= 100 && pm25 < 200){
                return 'middle'
            } else {
                return 'bad'
            }
        },
        showLoading: function(){
            console.log(typeof this.city_pm2_5 , this.city_pm2_5)
            return this.city_pm2_5 ? false : true
        }
        
    },
    components: {
        Loading
    },
    methods: {
        jumpFn: function(name) {
            if (!name) {
                Toast('暂未开放此模块，敬请期待！')
            }
            this.$router.push({ name: name })
        },
        newObj() {
            let gizwitsws = new this.GizwitsWS(this.apiHost, this.wechatOpenId, this.gizwitsAppId, this.commType)
            gizwitsws.onInit = this.onInit
            gizwitsws.onConnected = this.onConnected;
            gizwitsws.onOnlineStatusChanged = this.onOnlineStatusChanged;
            gizwitsws.onReceivedRaw = this.onReceivedRaw;
            gizwitsws.onReceivedAttrs = this.onReceivedAttrs;
            // this.gizwitsws.onError = this.onError;
            this.$store.commit('setGizwitsws', gizwitsws)
            console.info("初始化对象成功!")
        },
        initWx() {
            let _this = this
            console.log(111)
            $.ajax({
                url: '/LSVServer/getWXConfig',
                type: 'POST',
                data: {
                    url: window.location.href
                },
                success: function(data) {
                    console.log(data)
                    data = JSON.parse(data)
                    if (data.code == '0') {
                        // console.log(wx)
                        wx.config({
                            beta: true, // 开启wx api能力
                            // debug: true,
                            appId: data.data.appId,
                            signature: data.data.signature,
                            nonceStr: data.data.nonce,
                            timestamp: data.data.timestamp,
                            jsApiList: ['scanQRCode', 'getWXDeviceTicket', 'openWXDeviceLib']
                        })
                        wx.ready(function() {
                            _this.isWxReady = true
                            // console.log(wx.invoke)
                            console.log('wx ready')
                            wx.invoke('openWXDeviceLib', {}, function(res) {
                                // alert(res.err_msg);
                            });
                        })
                        wx.error(function(res) {
                            console.log(res)
                        })
                    }

                }
            })
        },
        init() {
            this.newObj()
            this.gizwitsws.init()
            console.info("已发送init指令!")
        },
        onInit(devices) {
            console.log('======onInit=====')
            console.log("机智云列表 => ", JSON.stringify(devices))
            this.zjy_devices = devices || []           
            this.getWxDeviceList()
        },
        getWxDeviceList() {
            let _this = this
            console.log('=====获取微信列表=====')
            $.ajax({
                url: '/LSVServer/deviceList',
                data: {
                    user: _this.wechatOpenId
                }
            })
            .done(data => {
                data = JSON.parse(data)
                console.log(JSON.stringify(data))
                if (data.code == 0) {
                    console.log("微信列表 => ", JSON.stringify(data.data))
                    _this.wx_devices = data.data || []
                    //与机智云列表作比对得出最终的设备列表
                    _this.getFinalList(data.defaultDid)
                } else {
                    Toast(data.message || '接口出错了~~')
                }
            })
            .fail(data => {
                console.log(data)
                Toast(data.message || '接口出错了~~')
                _this.$store.commit('endFetching', true)
            })
        },
        getFinalList(defaltDid) {
            let _this = this,
                devices = _this.zjy_devices.filter((item, index) => {
                    return _this.wx_devices.some((value, index) => {
                        let flag = String(value.deviceId).toLowerCase() == String(item.mac).toLowerCase()
                        if(flag) {
                            _.merge(item, value)
                        }
                        return flag
                    })
                })  
            _this.$store.commit('setDeviceList', devices)
            //TODO:开发使用 手动获取did
            _this.$store.commit('setCurDid', defaltDid || (devices[0]?devices[0].did : ''))
            // _this.getLocalInfo(_this.curDid)
            
            _this.connect(_this.curDid)
        },
        connect(did) {
            this.gizwitsws.connect(did)
            console.info("已发送connect指令!")
        },
        onConnected(did) {
            console.info(`与设备${did}连接成功`)
            this.read(did)
        },
        read(did) {
            this.gizwitsws.read(did)
            console.info("已发送read指令!");
        },
        onOnlineStatusChanged(value) {
            this.onlineStatus = value
            console.log('onlineStatus==', this.onlineStatus)
        },
        onReceivedRaw(value) {
            console.log('onReceivedRaw=======' + value)
        },
        onReceivedAttrs(value) {
            var _this = this;
            this.deviceAttr = value.attrs
            console.log(value)
            var str = "收到设备" + value.did + "的Attrs: ";
            for (var key in value.attrs) {
                str = str + key + ":" + value.attrs[key] + "; ";
                var attr = value.attrs[key]
                switch (key) {
                    case 'power_status':
                        _this.$store.commit('setStatus', attr)
                    break;
                    case 'op_mode':
                        _this.$store.commit('setModel', attr)                        
                    break;
                    case 'air_quality_target':
                        _this.$store.commit('setAirTarget', attr)
                    break;
                    case 'wind_vol':
                        _this.$store.commit('setSpeed', attr)                                                
                    break;
                    case 'left_time':
                        _this.$store.commit('setTime', attr)
                    break;
                    case 'total_time':
                        _this.$store.commit('setTotalTime', attr)                        
                    break;
                    case 'filter_rt':
                        _this.$store.commit('setRtTime', attr)                        
                    break;
                    case 'pm2_5':
                        _this.$store.commit('setPm25', attr)                        
                    break;
                }
            }
            console.log(str)
        },
        writeCommand(command) {
            let type = this.commType === 'attrs_v4' ? 'write' : 'raw'
            console.log(command)
            try {
                this.gizwitsws.write(this.curDid, command);
                // Toast(`已对设备 ${this.curDid} 发送 ${type} 指令`)
            } catch (e) {
                console.log(e)
                Toast('数据格式错误')
            }
        },
        getLocalInfo(device){
            console.log(device)
            if(!device) return
            let _this = this
            _this.$store.commit('startFetching')
            console.log('=========获取城市信息=========')
            $.ajax({
                url: '/LSVServer/getAirInfo',
                data: {
                    device: _this.curDid
                },
                timeout: 2000
            })
            .done(data => {
                data = JSON.parse(data)
                // console.log(JSON.stringify(data))
                if (data.code == 0) {
                    _this.$store.commit('endFetching')
                    console.log("城市信息 => ", JSON.stringify(data.data))
                    let _data = data.data
                    _this.city_pm2_5 = _data.pm2_5
                    _this.city = _data.city
                } else {
                    _this.$store.commit('endFetching', false)                    
                    // Toast(data.message || '接口出错了~~')
                }
            })
            .fail(err => {
                _this.$store.commit('endFetching', true)                    
                
                console.log(err)
            })
        },
        reload(){
            window.location.reload(true)
        }
    },
    mounted() {
        this.init()
        this.initWx()
        EventBus.$on('sendCommond', this.writeCommand) 
    }
}
</script>