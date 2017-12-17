<template>
    <div id="app">
        <h3 class="title">测试页</h3>
    
        <div class="list-box">
            <h3>设备列表：</h3>
            <ul class="d-list" v-if="devices.length">
                <li v-for="(item, index) of devices" :key="index" :class="[item.did === did? 'on' : '']" @click="selectDevice(item)">
                    {{index}} : {{item.did}}
                    <span class="unbind-btn" @click.stop="unbind(item.did, item.mac)">解绑</span>
                </li>
            </ul>
            <div v-else-if="devicesNeedBind.length">
                <p class="no-device">选择重新绑定以下设备：</p>
                <ul class="d-list">
                    <li v-for="(item, index) of devicesNeedBind" :key="index" :class="[item.did === did? 'on' : '']" @click="bindDevice(item)">
                        {{index}} : {{item.deviceId}}
                    </li>
                </ul>
            </div>
            
            <p v-else class="no-device">暂无设备，点击添加按钮扫码添加~</p>
            <div class="btn-area">
                <span class="btn-item" @click="scanQRCode">添加设备</span>
            </div>
        </div>

        <div class="info-show" v-if="deviceAttr">
            <span class="show-item">收到设备{{did}}的Attrs:</span>
            <ul class="read-only">
                <li class="li-item">
                    <h3 class="desc">只读属性</h3>    
                </li>
                <li class="li-item">
                    <h3 class="item-tit">pm2.5:</h3>
                    <span>{{deviceAttr.pm2_5}}</span>
                </li>
                <li class="li-item">
                    <h3 class="item-tit">pm10:</h3>
                    <span>{{deviceAttr.pm_10_0}}</span>
                </li>
                <li class="li-item">
                    <h3 class="item-tit">运行状态:</h3>
                    <span>{{deviceAttr.op_status?'故障':'正常'}}</span>
                </li>
                
                <li class="li-item">
                    <h3 class="item-tit">总运行时:</h3>
                    <span>{{deviceAttr.total_time}}小时</span>
                </li>
                <li class="li-item">
                    <h3 class="item-tit">滤芯剩余寿命:</h3>
                    <span>{{deviceAttr.filter_rt}}%</span>
                </li>
                <li class="li-item">
                    <h3 class="item-tit">温度:</h3>
                    <span>{{deviceAttr.temperature}}</span>
                </li>
                <li class="li-item">
                    <h3 class="item-tit">湿度:</h3>
                    <span>{{deviceAttr.humidity}}</span>
                </li>
                <li class="li-item">
                    <h3 class="item-tit">空气质量目标:</h3>
                    <span>{{deviceAttr.air_quality_target}}</span>
                </li>
                <li class="li-item">
                    <h3 class="item-tit">空气质量等级:</h3>
                    <span>{{deviceAttr.air_quality_lev}}</span>
                </li>
            </ul>
            <ul class="read-write">
                <li class="li-item">
                    <h3 class="desc">读写属性(点击可修改属性)</h3>    
                </li>
                <li class="li-item" @click="toggleAttr(0)">
                    <h3 class="item-tit">电源状态:</h3>
                    <span>{{deviceAttr.power_status?'待机':'开机'}}</span>
                    <Popup :visible="isUnfold[0]">
                        <ul class="bott-list">
                            <li class="bott-li" @click="setAttr('power_status', 1)">待机</li>
                            <li class="bott-li" @click="setAttr('power_status', 0)">开机</li>                            
                        </ul>
                    </Popup>
                </li>
                <li class="li-item" @click="toggleAttr(1)">
                    <h3 class="item-tit">风量:</h3>
                    <span>{{deviceAttr.wind_vol}}</span>
                    <Popup :visible="isUnfold[1]">
                        <ul class="bott-list">
                            <li class="bott-li" @click="setAttr('wind_vol', 1)">1级</li>
                            <li class="bott-li" @click="setAttr('wind_vol', 2)">2级</li>   
                            <li class="bott-li" @click="setAttr('wind_vol', 3)">3级</li>
                            <li class="bott-li" @click="setAttr('wind_vol', 4)">4级</li>
                            <li class="bott-li" @click="setAttr('wind_vol', 5)">5级</li>   
                            <li class="bott-li" @click="setAttr('wind_vol', 6)">6级</li>
                            <li class="bott-li" @click="setAttr('wind_vol', 7)">7级</li>
                            <li class="bott-li" @click="setAttr('wind_vol', 8)">8级</li>   
                            <li class="bott-li" @click="setAttr('wind_vol', 9)">9级</li>                                                                                 
                        </ul>
                    </Popup>
                </li>
                <li class="li-item" @click="toggleAttr(2)">
                    <h3 class="item-tit">空气质量目标:</h3>
                    <span>{{air_quality_target}}</span>
                    <Popup :visible="isUnfold[2]">
                        <ul class="bott-list">
                            <li class="bott-li" @click="setAttr('air_quality_target', 0)">普通</li>
                            <li class="bott-li" @click="setAttr('air_quality_target', 1)">敏感</li>   
                            <li class="bott-li" @click="setAttr('air_quality_target', 2)">高敏感</li>                                                                                 
                        </ul>
                    </Popup>
                </li>
                <li class="li-item" @click="toggleAttr(3)">
                    <h3 class="item-tit">运行模式:</h3>
                    <span>{{op_mode}}</span>
                    <Popup :visible="isUnfold[3]">
                        <ul class="bott-list">
                            <li class="bott-li" @click="setAttr('op_mode', 0)">智能模式</li>
                            <li class="bott-li" @click="setAttr('op_mode', 1)">手动模式</li>   
                            <li class="bott-li" @click="setAttr('op_mode', 2)">节能模式</li>                                                                                 
                        </ul>
                    </Popup>
                </li>
            </ul>
        </span>
    </span>
</template>

<script>
    import '../../common/css/base.css'
    import '../css/index.css'
    import $ from 'jQuery'
    import Toast from '../../common/components/toast'
    import Popup from '../../common/components/popup'
    import {
        getUrlKeyVal
    } from '../../common/utils/base.js'
    // import GizwitsWS from '../../libs/gizwits_ws_0.2.0.js'
    
    export default {
        name: 'main',
        data() {
            return {
                gizwitsws: null,
                GizwitsWS: window.GizwitsWS,
                apiHost: getUrlKeyVal('apiHost'),
                commType: getUrlKeyVal('commType'),
                wechatOpenId: getUrlKeyVal('oid'),
                gizwitsAppId: getUrlKeyVal('gizwitsAppId'),
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
            }
        },
        computed: {
            devices() {
                let _this = this
                return _this.zjy_devices.filter((item, index) => {
                    return _this.wx_devices.some((value, index) => {
                        return String(value.deviceId).toLowerCase() == String(item.mac).toLowerCase()
                    })
                })    
            },
            devicesNeedBind() {
                let _this = this,
                    macArr = _this.zjy_devices.map((item, index) => {
                        return String(item.mac).toLowerCase()
                    })
                return _this.wx_devices.filter((item, index) => {
                    let _did = String(item.deviceId).toLowerCase()
                    return macArr.indexOf(_did) === -1
                })
            },
            op_mode() {
                let _op_mode = '',
                    deviceAttr = this.deviceAttr
                if(deviceAttr && typeof deviceAttr === "object"){
                    switch(deviceAttr.op_mode){
                        case 0:
                            _op_mode = '智能模式'
                        break;
                        case 1:
                            _op_mode = '手动模式'
                        break;
                        case 2:
                            _op_mode = '节能模式'
                        break;
                    }
                }
                return _op_mode
            },
            air_quality_target() {
                let _air_quality_target = '',
                    deviceAttr = this.deviceAttr
                if(deviceAttr && typeof deviceAttr === "object"){
                    switch(deviceAttr.air_quality_target){
                        case 0:
                            _air_quality_target = '普通'
                        break;
                        case 1:
                            _air_quality_target = '敏感'
                        break;
                        case 2:
                            _air_quality_target = '高敏感'
                        break;
                    }
                }
                return _air_quality_target
            }
        },
        components: {
            Toast,
            Popup
        },
    
        methods: {
            newObj() {
                this.gizwitsws = new this.GizwitsWS(this.apiHost, this.wechatOpenId, this.gizwitsAppId, this.commType)
                this.gizwitsws.onInit = this.onInit
                this.gizwitsws.onConnected = this.onConnected;
                this.gizwitsws.onOnlineStatusChanged = this.onOnlineStatusChanged;
                this.gizwitsws.onReceivedRaw = this.onReceivedRaw;
                this.gizwitsws.onReceivedAttrs = this.onReceivedAttrs;
                // this.gizwitsws.onError = this.onError;

                console.info("初始化对象成功!")
            },
            initWx() {
                let _this = this
                $.ajax({
                    url: '/LSVServer/getWXConfig',
                    type: 'POST',
                    data: {
                        url: window.location.href
                    },
                    success: function(data) {
                        // console.log(data)
                        data = JSON.parse(data)
                        if (data.code == '0') {
                            // console.log(wx)
                            wx.config({
                                beta: true, // 开启wx api能力
                                debug: true,
                                appId: data.data.appId,
                                signature: data.data.signature,
                                nonceStr: data.data.nonce,
                                timestamp: data.data.timestamp,
                                jsApiList: ['scanQRCode','getWXDeviceTicket','openWXDeviceLib']
                            })
                            wx.ready(function() {
                                _this.isWxReady = true
                                // console.log(wx.invoke)
                                console.log('wx ready')
                                wx.invoke('openWXDeviceLib', {}, function(res){
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
                this.getWxDeviceList()
                this.zjy_devices = devices
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
                    console.log(data)
                    if(data.code == 0){
                        console.log("微信列表 => ", data.data)
                        _this.wx_devices = data.data || []
                    }else{
                        Toast(data.message || '接口出错了~~')
                    }
                })
                .fail(err => {
                    console.log(err)
                })
            },
            connect() {
                this.gizwitsws.connect(this.did)
                console.info("已发送connect指令!")
            },
            onConnected(did) {
                console.info(`与设备${did}连接成功`)
                this.read()
            },
            read() {
                this.gizwitsws.read(this.did)
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
                this.deviceAttr = value.attrs
                console.log(value)
                var str = "收到设备" + value.did + "的Attrs: ";
                for (var key in value.attrs) {
                    str = str + key + ":" + value.attrs[key] + "; ";
                }
                console.log(str)
            },
            selectDevice(item) {
                this.did = item.did
                this.connect()
                Toast(`已选择${this.did},正在读取设备信息...`)
            },
            bindDevice(item) {
                let _this = this
                console.log(item.deviceId)
                $.ajax({
                    method: "POST",
                    url: '/LSVServer/gizBind',
                    data: {
                        user: _this.wechatOpenId,
                        device: item.deviceId
                    }
                })
                .done(data => {
                    data = JSON.parse(data)
                    console.log(data)
                    if(data.code == 0){
                        Toast('绑定成功！')
                        _this.gizwitsws.init() //重新拉取机智云设备列表，局部刷新

                    }else{
                        Toast(data.message || '接口出错了~~')
                    }
                })
                .fail(err => {
                    console.log(err)
                })
            },
            writeCommand(command) {
                let type = this.commType === 'attrs_v4' ? 'write' : 'raw'
                try {
                    this.gizwitsws.write(this.did, command);
                    Toast(`已对设备 ${this.did} 发送 ${type} 指令`)
                } catch (e) {
                    console.log(e)
                    Toast('数据格式错误')
                }
            },
            activeHackFn() {
                document.body.addEventListener('touchstart', () => {})
            },
            scanQRCode() {
                if (this.isWxReady) {
                    wx.scanQRCode({
                        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function(res) {
                            console.log(res)
                            // var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                        }
                    })
                } else {
                    Toast('等待微信初始化')
                }
            },
            unbind(did, mac) {
                let _this = this
                console.log(wx)
                wx.invoke('getWXDeviceTicket', {
                    'deviceId': did,
                    'type': '2',
                    'connType': 'lan'
                }, function(res) {
                    console.log('getWXDeviceTicket', res);
                    $.ajax({
                        method: "POST",
                        url: '/LSVServer/unbindDevice',
                        data: {
                            user: _this.wechatOpenId,
                            device: mac,
                            gizDid: did,
                            ticket: res.ticket
                        }
                    })
                    .done(data => {
                        data = JSON.parse(data)
                        console.log(data)
                        if(data.code == 0){
                            Toast('解绑成功！')
                            _this.gizwitsws.init() //重新拉取机智云设备列表，局部刷新

                        }else{
                            Toast(data.message || '接口出错了~~')
                        }
                    })
                    .fail(err => {
                        console.log(err)
                    })
                });
            },
            toggleAttr(index) {
                this.isUnfold[index] = !this.isUnfold[index]
            },
            setAttr(key, status) {
                let command = {}
                command[key] = status
                this.writeCommand(command)
                this.deviceAttr[key] = status
            }
        },
        mounted() {
            this.activeHackFn()
            this.init()
            this.initWx() 
        }
    }
</script>
