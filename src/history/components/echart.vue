<template>
    <div class="echarts">
        <IEcharts :option="line" :loading="loading" @ready="onReady"></IEcharts>
        <!-- <button @click="doRandom">Random</button>
        <IEcharts :option="bar" :loading="loading" @ready="onReady" @click="onClick"></IEcharts> -->
    </div>
</template>
<script>
    import $ from 'jQuery'
    import IEcharts from 'vue-echarts-v3'
    import { mapState } from 'vuex'

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
                    text: 'ECharts 入门示例'
                },
                // dataZoom: [
                //     {   
                //         // 这个dataZoom组件，默认控制x轴。
                //         type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                //         start: 10,      // 左边在 10% 的位置。
                //         end: 60         // 右边在 60% 的位置。
                //     }
                // ],
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
                    data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
                    // type: 'time',
                    name: '机器正在运行',
                    nameLocation: 'start',
                    nameTextStyle: {
                        fontSize: 8,
                        color: 'blue'
                    },
                    nameGap: -100,
                    // boundaryGap: false,   //两端留白策略
                    axisTick: {
                        //坐标轴刻度相关设置
                        alignWithLabel: true
                    },
                    axisLabel: {
                        //坐标轴刻度标签的相关设置。
                        show: true,
                        interval: 0,
                        color: '#fff'
                    },
                    lineStyle: {
                        color: '#fff'
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
                    // axisTick: {
                    //     lineStyle: {
                    //         color: 'red'
                    //     }
                    // },
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
                    }
                },
                visualMap: {
                    type: 'piecewise',
                    // show: false,
                    top: 10,
                    right: 10,
                    // dimension: 0,
                    pieces: [{
                        gt: 0,
                        lte: 50,
                        color: '#096'
                    }, {
                        gt: 100,
                        lte: 150,
                        color: '#ff9933'
                    }, {
                        gt: 150,
                        lte: 200,
                        color: '#cc0033'
                    }],
                    outOfRange: {
                        symbol: 'circle',
                        color: '#999'
                    }
                },
                series: [
                    {
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
                        data: []
                    }
                ]
            }
        }),
        computed: {
            // ...mapState([
            //     "wechatOpenId",
            //     "curDid"
            // ])
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
                    d = now.getDate(),
                    h = now.getHours();

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
                        console.log(data)
                    },
                    error: function() {

                    }
                })
            }
        },
        mounted () {
            let self = this;
            setTimeout(function(){
                self.line.series[0].data = [4, 8, 16, 32, 64, 128,256]     
            }, 1000)

            self.getData();
        }
    };
</script>

<style scoped>
  .echarts {
    width: 100%;
    height: 400px;
    background: #080d14;
  }
</style>