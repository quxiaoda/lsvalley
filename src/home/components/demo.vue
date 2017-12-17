<template>
    <div id="app">
        <p class="title">Gizwits-Javascript-SDK Example</p>
        <div class="btn-area">
            <span class="btn-item" @click="scanQRCode">扫码</span>
        </div>
        <ul class="list-box">
            <li class="list-item">
                <h3 class="item-dec">1. 首先，请初始化GizwitsWS对象</h3>
                <ul class="input-box">
                    <li class="input-item">
                        apiHost: <input type="text" placeholder="api.gizwits.com" v-model="apiHost" />
                    </li>
                    <li class="input-item">
                        commType: <input type="text" placeholder="attrs_v4 or custom" v-model="commType" />
                    </li>
                    <li class="input-item">
                        wechatOpenId: <input type="text" v-model="wechatOpenId" size="30" placeholder="自动获取" />
                    </li>
                    <li class="input-item">
                        gizwitsAppId: <input type="text" v-model="gizwitsAppId" size="30" placeholder="自动获取" />
                    </li>
                </ul>
                <button class="btn" @click="newObj">Do it!</button>
            </li>
            <li class="list-item">
                <h3 class="item-dec">2. 然后，使用GizwitsWS.init()获取绑定列表</h3>
                <button class="btn" @click="init">Do it!</button>
            </li>
            <li class="list-item">
                <h3 class="item-dec">3. 接着，选择一个设备，创建websocket连接</h3>
                <!--<ul class="input-box">
                                <li class="input-item">
                                    did: <input type="text" placeholder="please input your device did" v-model="did"/>
                                </li>
                            </ul>-->
                <ul v-if="devices.length" class="devices">
                    <li v-for="(item, index) in devices" 
                        :key="index"
                        class="devices-item" 
                        :class="[item.did === did? 'on' : '']" 
                        @click="selectDevice(item)">
                        {{index}} : {{item.did}}
                    </li>
                </ul>
                <button class="btn" @click="connect">Do it!</button>
            </li>
            <li class="list-item">
                <h3 class="item-dec">4. 试一下读取设备状态</h3>
                <div class="info-show" v-if="deviceAttr">
                    <span class="show-item">收到设备{{did}}的Attrs:</span>
                    <span class="show-item" v-for="(value, key) in deviceAttr" :key="key">
                                    {{key}} : {{value}}
                                </span>
                </div>
                <button class="btn" @click="read">Do it!</button>
            </li>
            <li class="list-item">
                <h3 class="item-dec">5. 试一下控制设备</h3>
                <ul class="input-box">
                    <li class="input-item">
                        command: <input type="text" placeholder="" v-model="command" />
                    </li>
                </ul>
                <button class="btn" @click="writeCommand">Do it!</button>
            </li>
            <li class="list-item">
                <h3 class="item-dec">6. 试一下解绑设备</h3>
    
                <button class="btn" @click="unbind">Do it!</button>
            </li>
        </ul>
    </div>
</template>

<script>
    import '../../common/css/base.css'
    import '../css/demo.css'
    import $ from 'jQuery'
    import Toast from '../../common/components/toast'
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
                apiHost: 'api.gizwits.com',
                commType: 'attrs_v4',
                wechatOpenId: getUrlKeyVal('oid'),
                gizwitsAppId: '21fa5d3d24a941e7969ab4fed4b43fc5',
                devices: [],
                deviceAttr: null,
                onlineStatus: {},
                did: '',
                command: '',
                isWxReady: false
            }
        },
        components: {
            // Toast
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
                Toast("初始化对象成功!")
            },
            initWx() {
                console.log(wx)
                let _this = this
                // let params = _this.getWXConfig()
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
                            console.log(wx)
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
                                console.log(wx.invoke)
                                console.log('wx ready')
                                wx.invoke('openWXDeviceLib', {}, function(res){
                                        console.error(res.err_msg);
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
                this.gizwitsws.init()
                Toast("已发送init指令!")
            },
            onInit(devices) {
                console.log('======onInit=====')
                console.log(devices)
                this.devices = devices
            },
            connect() {
                this.gizwitsws.connect(this.did);
                Toast("已发送connect指令!");
            },
            onConnected(did) {
                console.log(did)
                Toast(`与设备${did}连接成功`);
            },
            read() {
                console.log(this.did)
                this.gizwitsws.read(this.did);
                Toast("已发送read指令!");
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
                console.log(item)
                this.did = item.did
                console.log(this.did)
            },
            writeCommand() {
                let type = this.commType === 'attrs_v4' ? 'write' : 'raw'
                try {
                    this.gizwitsws.write(this.did, JSON.parse(this.command));
                    Toast(`已对设备 ${this.did} 发送 ${type} 指令`)
                } catch (e) {
                    console.log(e)
                    Toast('数据格式错误')
                }
            },
            activeHackFn() {
                document.body.addEventListener('touchstart', () => {})
            },
            getWXConfig(l = 10) {
                let x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
                let nonce = "";
                let timestamp = new Date().getTime();
                let url = window.location.href.split('#')[0]
    
                for (let i = 0; i < l; i++) {
                    nonce += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
                }
                return {
                    nonce,
                    timestamp,
                    url
                }
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
            unbind() {
                let _this = this
                console.log(wx)
                wx.invoke('getWXDeviceTicket', {
                    'deviceId': _this.did,
                    'type': '2',
                    'connType': 'lan'
                }, function(res) {
                    console.log('getWXDeviceTicket', res);
                    alert(JSON.stringify(res) )
                });
            }
        },
        mounted() {
            this.activeHackFn()
            this.initWx() 
        }
    }
</script>
