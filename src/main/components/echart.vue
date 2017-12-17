<template>
    <div class="echarts">
        <IEcharts 
            :option="line" 
            :loading="loading" 
            @ready="onReady" >
        </IEcharts>
    </div>
</template>

<script>
    import $ from 'jQuery'
    // import IEcharts from 'vue-echarts-v3'
    import IEcharts from 'vue-echarts-v3/src/full.js';
    // import IEcharts from 'vue-echarts-v3/src/lite.js';
    // import 'echarts/lib/chart/line';
    // import 'echarts/lib/component/parallel';
    import { mapState, mapGetters } from 'vuex'

    // import IEcharts from 'vue-echarts-v3/src/lite.js';
    // import 'echarts/lib/chart/line';
    export default {
        name: 'view',
        components: {
            IEcharts
        },
        props: {},
        data: () => ({
            loading: false,
            line: {
                title: {
                    text: '过去24小时室内空气质量',
                    x: 'center',
                    y: 'top',
                    textStyle: {
                        color: 'rgba(255,255,255,.6)',
                        fontSize: 16,
                        align: 'center',
                        fontWeight: 'lighter'
                    }
                },
                // 图例
                // legend: {
                //     show: false
                // },
                dataZoom: [
                    {   
                        // 这个dataZoom组件，默认控制x轴。
                        type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                        start: 10,      // 左边在 10% 的位置。
                        end: 60         // 右边在 60% 的位置。
                    }
                ],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                // toolbox: {
                //     show: true,
                //     feature: {
                //         saveAsImage: {} //下载
                //     }
                // },
                // tooltip: {},
                xAxis: {
                    data: [],
                    // type: 'time',
                    // name: '机器正在运行',
                    nameLocation: 'start',
                    nameTextStyle: {
                        fontSize: 8,
                        color: 'blue'
                    },
                    nameGap: -100,
                    // boundaryGap: false,   //两端留白策略
                    axisTick: {
                        //坐标轴刻度相关设置
                        alignWithLabel: true,
                        // show: false
                    },
                    axisLabel: {
                        //坐标轴刻度标签的相关设置。
                        show: false,
                        interval: 6,
                        color: '#fff'
                    },
                    axisLine:{
                        lineStyle: {
                            // color: '#fff'
                            width: 4,
                            opacity: 0.6
                        }
                    }
                },
                yAxis: {
                    axisLine: {
                        // show: false
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        //坐标轴刻度标签的相关设置。
                        show: false,
                        // interval: 6,
                        // color: '#fff'
                    },
                    axisTick: {
                        show: false
                    },
                    // splitLine: {
                    //     lineStyle: {
                    //         color: ['red', 'gray', 'blue', 'green']
                    //     }
                    // },
                    // splitArea: {
                    //     show: true,
                    //     areaStyle: {
                    //         color: ['red', 'gray', 'blue', 'green']
                    //     }
                    // },
                    axisPointer: {
                        snap: true
                    },
                    axisLine:{
                        lineStyle: {
                            // color: '#fff'
                            opacity: 0.6
                        }
                    }
                },
                visualMap: {
                    type: 'piecewise',
                    show: false, // 不显示 visualMap-piecewise 组件
                    top: 10,
                    right: 10,
                    // dimension: 0,
                    pieces: [{
                        gt: 0,
                        lte: 50,
                        color: '#13cc6b'
                    }, {
                        gt: 50,
                        lte: 100,
                        color: '#8cba2a'
                    }, {
                        gt: 100,
                        lte: 200,
                        color: '#9a4e2c'
                    }],
                    outOfRange: {
                        symbol: 'circle',
                        color: '#d43637'
                    }
                },
                series: {
                    name: '指数',
                    type: 'line',
                    symbol:'none',
                    smooth:true,
                    lineStyle: {
                        normal: {
                            // color: 'green',
                            // width: 4,
                            type: 'solid'
                        }
                    },
                    // data: [4, 8, 16, 32, 64, 128,256]
                    data: [],
                    markLine: {
                        silent: true,
                        data: [{
                            yAxis: 50
                        }, {
                            yAxis: 100
                        }, {
                            yAxis: 200
                        }, {
                            yAxis: 300
                        }]
                    }
                }
                
            }
        }),
        computed: {
            ...mapState([
                "wechatOpenId",
                "curDid"
            ]),
            ...mapGetters([
                "curDeviceInfo"
            ]),
        },
        methods: {
            onReady(instance) {                
                console.log(instance);
            },
            getData() {
                let _this = this,
                    now = new Date(),
                    y = now.getFullYear(),
                    m = now.getMonth() + 1,
                    d = 5 || now.getDate(),
                    h = 1 || now.getHours();
                console.log(this.wechatOpenId, this.curDid, this.curDeviceInfo)

                $.ajax({
                    url: '/LSVServer/pm25of24Hours',
                    type: 'GET',
                    data: {
                        user: 'oZle8vpKKB_PBNF7nQbp2lak1c3Q',
                        device: 'virtual:site',
                        y: y,
                        m: m,
                        d: d,
                        h: h
                    },
                    success: function(data) {
                        // console.log(data)
                        data = JSON.parse(data)
                        if (data.code === 0 
                            && data.data 
                            && data.data.list 
                            && data.data.list.length) {
                            let datas = data.data.list,
                                data_x = [],
                                data_y = [];

                            datas.forEach(function(item, index){
                                data_x.push(item.minutes);
                                data_y.push(item.pm25 || '-');
                            })
                            console.log(data_x, data_y)
                            _this.line.xAxis.data = data_x;
                            _this.line.series.data = data_y;
                        }
                    },
                    error: function() {

                    }
                })
            }
        },
        activated () {
            let self = this;
            // setTimeout(function(){
            //     self.line.series[0].data = [4, 8, 16, 32, 64, 128,256]     
            // }, 1000)

            self.getData();
        }
    };
</script>

<style scoped>
  .echarts {
    position: absolute;
    left: 0;
    bottom: 30px;
    width: 100%;
    height: 56%;
  }
</style>