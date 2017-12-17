<template>
    <div class="echarts">
        <IEcharts :option="line" :loading="loading" @ready="onReady" @click="onClick"></IEcharts>
        <button @click="doRandom">Random</button>
        <IEcharts :option="bar" :loading="loading" @ready="onReady" @click="onClick"></IEcharts>
    </div>
</template>
<script>
    import IEcharts from 'vue-echarts-v3';
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
                tooltip: {},
                xAxis: {
                    data: ['01-01', '01-01', '01-01', '01-01', '01-01'],
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
                        interval: 0
                    }
                },
                yAxis: {
                    axisLine: {
                        // show: false
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: 'red'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['red', 'gray', 'blue', 'green']
                        }
                    },
                    splitArea: {

                    }
                },
                series: [
                    {
                        name: '销量',
                        // type: 'bar',
                        symbol:'none',  //这句就是去掉点的  
                        type:'line',  
                        smooth:true,  //这句就是让曲线变平滑的  
                        stack: '总量',  
                        lineStyle: {
                            normal: {
                                color: 'green',
                                width: 4,
                                type: 'solid'
                            }
                        },
                        data: [5, 7, 9, 10, 14]
                    },
                    {
                        name: '利润',
                        // type: 'bar',
                        symbol:'none',  //这句就是去掉点的  
                        type:'line',  
                        smooth:true,  //这句就是让曲线变平滑的  
                        stack: '总量',  
                        lineStyle: {
                            normal: {
                                color: 'red',
                                width: 4,
                                type: 'solid'
                            }
                        },
                        data: [50, 70, 90, 100, 140, 160]
                    }
                ]
            },
            bar: {
                title: {
                    text: '每周数据'
                },
                xAxis: {
                    data: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
                    // type: 'time',
                    // name: '机器正在运行',
                    // nameLocation: 'start',
                    // nameTextStyle: {
                    //     fontSize: 8,
                    //     color: 'blue'
                    // },
                    // nameGap: -100,
                    // boundaryGap: false,   //两端留白策略
                    axisTick: {
                        //坐标轴刻度相关设置
                        alignWithLabel: true
                    },
                    axisLabel: {
                        //坐标轴刻度标签的相关设置。
                        show: true,
                        interval: 0
                    }
                },
                yAxis: {
                    axisLine: {
                        // show: false
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: 'red'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['red', 'gray', 'blue', 'green']
                        }
                    },
                    splitArea: {
                    },
                    // splitNumber: 1,
                    minInterval: 10,
                    // min: 0
                },
                 series: [
                    {
                        name: '空气质量',
                        type: 'bar',
                        // symbol:'none',  //这句就是去掉点的  
                        // type:'line',  
                        // smooth:true,  //这句就是让曲线变平滑的  
                        // stack: '总量',  
                        // lineStyle: {
                        //     normal: {
                        //         color: 'green',
                        //         width: 4,
                        //         type: 'solid'
                        //     }
                        // },
                        data: [5, 7, 9, 10, 14, 13, 10 ]
                    }
                ]
            }
        }),
        methods: {
            doRandom() {
                const that = this;
                let data = [];
                for (let i = 0, min = 5, max = 99; i < 6; i++) {
                    data.push(Math.floor(Math.random() * (max + 1 - min) + min));
                }
                // that.loading = !that.loading;
                that.line.series[0].data = data;
            },
            onReady(instance) {
                console.log(instance);
            },
            onClick(event, instance, echarts) {
                console.log(arguments);
            }
        }
    };
</script>

<style scoped>
  .echarts {
    width: 100%;
    height: 400px;
  }
</style>