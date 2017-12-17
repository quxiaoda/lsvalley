<template>
    <div id="manage" class="manage">
        <div class="device-select" @click="openDeviceListFn">
            <span class="name">切换设备：</span>
            <span class="info">{{deviceName}}</span>
            <i v-show="this.deviceList.length > 1"></i>
        </div>
        <ul class="device-info">
            <li class="item">
                <span class="name">设备名称：</span>
                <input type="text" name="deviceName" id="deviceName" :value="deviceName" class="info" @change="changeName()" maxlength="8"/>
                <!-- <span class="info">{{deviceName}}</span> -->
                <!-- <input type="text" class="info" name="deviceName" id="deviceName" value={{deviceName}}/> -->
                <!-- <i class="edit"></i> -->
            </li>
            <!-- <li class="item">
                <span class="name">设备位置：</span>
                <span class="info">北京朝阳</span>
            </li> -->
            <!-- <li class="item">
                    <span class="name">自动运行：</span>
                    <span class="info">每天</span>
                    <i></i>
                </li> -->
            <!-- TODO: 空气质量存疑 待修改 -->
             <li class="item">
                <span class="name">空气质量：</span>
                <ul class="air-quality">
                    <li class="level">
                        <div class="sele-box">
                            <span :class="['box-item', air_target == 0 ? 'on':'']" @click="setAirTarget(0)">
                                <i></i>
                                普通
                            </span>
                            <span :class="['box-item', air_target == 1 ? 'on':'']" @click="setAirTarget(1)">
                                <i></i>
                                较高
                            </span>
                            <span :class="['box-item', air_target == 2 ? 'on':'']" @click="setAirTarget(2)">
                                <i></i>
                                极高
                            </span>
                            
                        </div>
                    </li>
                    <li class="desc">
                        <p>普通，保持良好的空气质量 </p>
                        <p>较高，对颗粒物和污染物比较敏感</p>
                        <p> 极高，对颗粒物和污染物非常敏感 </p>
                        <p>空气质量目标越高，机器运行时间越长</p>
                    </li>
                </ul>
            </li> 
            <li class="item">
                <span class="name">运行时长：</span>
                <span class="info">{{totalTime}}</span>
            </li>

            <li class="item">
                <span class="name">滤网寿命：</span>
                <span class="progress-o">
                    <span class="progress-i" :style="{width: rtTime}"></span>
                    <em>剩余{{rtTime}}</em>
                </span>
                <!-- <span class="clear-btn">重置</span> -->
            </li>
        </ul>
        <div class="unbind-btn" @click="unbind(curDid, curDeviceInfo.mac)">
            解绑该设备
        </div>
        <div class="add-btn" @click="scanQRCode">
            <i></i>
            <span>添加设备</span>
        </div>
        <my-popup v-if="deviceList.length > 1" :visible="canShow" @maskClickHandle="closePopUp">
            <ul class="sele-box">
                <li class="sele-item" v-for="(val, index) in deviceList" :key="index" @click.stop="clickItem(val.did)">
                    {{val.deviceName}}
                </li>
            </ul>
        </my-popup>
    </div>
</template>


<script>
import '../css/manage.css'
import { mapState, mapGetters } from 'vuex'
import EventBus from '../EventBus.js'
import Toast from '../common/components/toast'
import myPopup from '../common/components/popup'
import Dialog from '../common/components/dialog'

export default {
    name: 'manage',
    data() {
        return {
            canShow: false,
            target: null 
        }
    },
    computed: {
        ...mapState([
            "curDid",
            "deviceList",
            "rtTime",
            "totalTime",
            "air_quality_target",
            "wechatOpenId"
        ]),
        ...mapGetters([
            "curDeviceInfo"
        ]),
        deviceName: function(){
            return this.curDeviceInfo? this.curDeviceInfo.deviceName : ''
        },
        air_target: function(){
            //最终用到的值
            if(this.target){
                return this.target
            }
            return this.air_quality_target 
        }
    },
    components: {
        myPopup,
        // myDialog
    },
    methods: {
        unbind(did, mac) {
            let _this = this
            console.log(wx)
            Dialog({
                title: '确定要解除与设定的绑定？',
                content: '解绑后将无法通过该账号对设备进行控制。',
                okText: '确定',
                cancelText: '再想想',
                showCancel: true,
                cbOk: () => {
                    console.log('is OK callback')
                    wx.invoke('getWXDeviceTicket', {
                        'deviceId': did,
                        'type': '2',
                        'connType': 'lan'
                    }, function(res) {
                        console.log('getWXDeviceTicket', res);
                        $.ajax({
                            type: 'POST',
                            url: '/LSVServer/unbindDevice',
                            data: {
                                user: _this.wechatOpenId,
                                device: mac,
                                gizDid: did,
                                ticket: res.ticket
                            }
                        }).done(data => {
                            data = JSON.parse(data)
                            console.log(data)
                            if (data.code == 0) {
                                Toast('解绑成功！')
                                wx.closeWindow();//关闭当前页                    
                                // _this.gizwitsws.init() //重新拉取机智云设备列表，局部刷新

                            } else {
                                Toast(data.message || '接口出错了~~')
                            }
                        })
                        .fail(err => {
                            console.log(err)
                        })
                    });
                    Dialog.close()
                },
                cbCancel: () => {
                    Dialog.close()
                }
            })

        },
        openDeviceListFn() {
            var len = this.deviceList || []
            if (len < 2) {
                // Toast('暂无其他设备可选，请添加后再试')
                return false
            } else {
                this.canShow = true
            }
        },
        closePopUp() {
            this.canShow = false;
        },
        scanQRCode() {
            // if (this.isWxReady) {
            wx.scanQRCode({
                needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function(res) {
                    console.log(res)
                    // var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                }
            })
            // } else {
            //     Toast('等待微信初始化')
            // }
        },
        setAirTarget(val) {
            // _this.$store.commit('setAirTarget', attr)
            this.target = Number(val)
            EventBus.$emit('sendCommond', {
                "air_quality_target": Number(val)
            })

        },
        clickItem(did){
            let _this = this
            if(!did) return 
            this.closePopUp()
            $.ajax({
                url: '/LSVServer/setDefaltDevice',
                data: {
                    user: _this.wechatOpenId,
                    device: String(did)
                }
            })
            .done(data => {
                data = JSON.parse(data)
                // console.log(JSON.stringify(data))
                if (data.code == 0) {
                    console.log("选择设备成功！新设备为" + did)
                    _this.$store.commit('setCurDid', did)
                } else {
                    Toast(data.message || '接口出错了~~')
                }
            })
            .fail(err => {
                console.log(err)
            })
        },
        changeName(id) {
            let value = $('#deviceName')[0].value,
                _this = this;
                debugger;
            if (value) {
                $.ajax({
                    url: '/LSVServer/setDeviceName',
                    type: 'POST',
                    data: {
                        user: _this.wechatOpenId,
                        device: String(_this.curDeviceInfo.mac),
                        name: String(value)
                    }
                }).done(data => {
                    data = JSON.parse(data)
                    if (data.code == 0) {
                        console.log("修改设备名称,新名称是 =>" + value)
                        // _this.$store.commit('setCurDid', did)
                    } else {
                        Toast(data.message || '接口出错了~~')
                    }
                }).fail(err => {
                    console.log(err)
                })
            } else {
                Toast('请输入有效名称')
            }
        }
        
    }
}
</script>