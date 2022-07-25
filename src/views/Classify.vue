<template>
    <div id="classify-container" style="height: 100%; background: white">
        <!-- 左侧内容（添加分类功能） -->
        <div class="add-classify">
            <h3>添加</h3>
            <div>
                <div style="font-size: 16px; font-weight:600">类别:</div>
                <input type="text" v-model="classification1" placeholder="二级类别" />
            </div>
            <div>
                <div style="font-size: 16px; font-weight:600">所属类别:</div>
                <input type="text" v-model="classification2" placeholder="一级类别" />
            </div>
            <div style="float: right">
                <el-button type="primary" size="mini" v-on:click="add">点击添加</el-button>
            </div>
            <div id="datas" ref="datas">

            </div>
        </div>
        <!-- 右侧内容（显示系统已有分类功能） -->
        <div style="float: right; width: 70%">
            <h3>管理</h3>
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column label="分类名称" width="230">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.tname }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="文章数" width="180">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>分类名称: {{ scope.row.tname }}</p>
                            <p>数量: {{ scope.row.number }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.number }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 页面上下页操作按钮列 -->
            <div class="operations">
                <el-button type="primary" size="mini" @click="pre">
                    <i class="el-icon-arrow-left"></i>
                </el-button>
                <el-button type="primary" size="mini" plain>
                    {{ current }} / {{ pages }}
                </el-button>
                <el-button type="primary" size="mini" plain>
                    总{{ allPage }}条
                </el-button>
                <el-button type="primary" size="mini" @click="next">
                    <i class="el-icon-arrow-right"></i>
                </el-button>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            classification1: '',
            classification2: '',
            current: 1,
            allPage: 0,
            pages: 0,
        }
    },
    created() {
        this.initList()
        this.initCount()
    },
    mounted() {
        this.getEchartData()
    },
    methods: {
        // 分类增加方法事件，用于事件绑定
        async add() {
            // 当且仅当管理员将两个输入框的内容输入后才可进行下一步的操作，否则无法进行
            if (this.classification1 !== '' && this.classification2 !== '') {
                const { data: res } = await this.$http.post('/classify/add', { "tname": this.classification1 })
                if (res.status === 'success') {
                    this.$message({
                        message: '添加成功！！',
                        type: 'success'
                    })
                }
            } else {
                // 当内容为空时，网页进行信息弹框提示
                this.$message({
                    message: '内容不能为空！！',
                    type: 'error'
                })
            }
        },
        // 读取数据库中的数据方法，进行页面的初始化
        async initList() {
            const { data: res } = await this.$http.get('/classifitionInfo?current=' + this.current)
            this.tableData = res
        },
        // 初始化数据库manager总数据量
        async initCount() {
            const { data: res } = await this.$http.get('/clsCount')
            this.allPage = res[0].count
            // 计算得到总共的页数，提高页面使用友好性
            this.pages = this.allPage % 5 === 0 ? parseInt(this.allPage / 5) : parseInt(this.allPage / 5) + 1
        },
        // 下一页功能方法
        async next() {
            if (this.current < this.pages) {
                // 符合条件自增并进行数据的更新
                this.current++
                this.initList()
            } else {
                // 不符合一直处于最后一页
                this.current === this.pages
            }
        },
        // 上一页功能方法
        async pre() {
            if (this.current > 1) {
                // 符合条件自增并进行数据的更新
                this.current--
                this.initList()
            } else {
                // 不符合一直处于最后一页
                this.current = 1
            }
        },
        // 编辑按钮功能方法
        handleEdit(index, row) {
            this.$message({
                message: '此功能暂时不向外开放！！',
                type: 'warning'
            })
        },
        // 以下是使用ECharts进行数据可视化的操作
        getEchartData() {
            const chart = this.$refs.datas
            if (chart) {
                const myChart = this.$echarts.init(chart)
                const option = {
                    title: {
                        text: '统计',
                        subtext: '文章数',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [
                        {
                            name: 'Access From',
                            type: 'pie',
                            radius: '50%',
                            data: [
                                { value: 10, name: 'JavaWeb笔记' },
                                { value: 2, name: 'Java笔记' },
                                { value: 1, name: 'Vue笔记' },
                                { value: 1, name: '人生哲学' },
                                { value: 1, name: '体育' },
                                { value: 1, name: '散文欣赏' },
                                { value: 1, name: '数据结构' },
                                { value: 13, name: '生活点滴' },
                                { value: 1, name: '竞赛' },
                                { value: 2, name: '算法笔记' }
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                myChart.setOption(option)
                window.addEventListener("resize", function () {
                    myChart.resize()
                })
            }
            this.$on('hook:destroyed', () => {
                window.removeEventListener("resize", function () {
                    myChart.resize();
                });
            })
        }
    }
}
</script>

<style lang="less" scoped>
#class-container {
    width: 100%;
    min-height: 10px;
}

.add-classify {
    float: left;
    min-height: 200px;
    width: 28%;
    padding: 0 1% 0 1%;

    >div {
        margin-bottom: 5%
    }

    input {
        width: 80%;
        height: 20px;
        margin-right: 5%;
        outline: none;
    }

    #datas {
        clear: both;
        width: 100%;
        min-height: 270px;
    }
}

.operations {
    text-align: right;
    margin-top: 10px;
}
</style>