<template>
    <div class="container">
        <el-form ref="form" :model="sizeForm" label-width="80px" size="mini" style="padding: 5%">
            <el-form-item label="主标题">
                <el-input v-model="sizeForm.title"></el-input>
            </el-form-item>
            <el-form-item label="副标题">
                <el-select v-model="sizeForm.subtitle" placeholder="请选择副标题类型">
                    <el-option label="JavaWeb笔记" value="JavaWeb笔记">JavaWeb笔记</el-option>
                    <el-option label="Java笔记" value="Java笔记"></el-option>
                    <el-option label="Vue笔记" value="Vue笔记"></el-option>
                    <el-option label="人生哲学" value="人生哲学"></el-option>
                    <el-option label="体育" value="体育"></el-option>
                    <el-option label="散文欣赏" value="散文欣赏"></el-option>
                    <el-option label="数据结构" value="数据结构"></el-option>
                    <el-option label="生活点滴" value="生活点滴"></el-option>
                    <el-option label="竞赛" value="竞赛"></el-option>
                    <el-option label="算法笔记" value="算法笔记"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题内容">
                <el-input v-model="sizeForm.md_content" size="small"></el-input>
            </el-form-item>
            <el-form-item label="是否置顶">
                <el-radio-group v-model="sizeForm.resource" size="medium">
                    <el-radio border label="是"></el-radio>
                    <el-radio border label="否"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="文章内容">
                <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="sizeForm.content">
                </el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="sizeForm.date1" style="width: 100%;">
                    </el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-time-picker placeholder="选择时间" v-model="sizeForm.date2" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>
            <el-form-item size="large">
                <el-button type="primary" @click="onSubmit">立即撰写</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'Article2',
    data() {
        return {
            sizeForm: {
                title: '',
                subtitle: '',
                md_content: '',
                date1: '',
                date2: '',
                resource: '',
                content: ''
            }
        };
    },
    methods: {
        // 管理者点击撰写文章后，使用axios进行get请求，进行数据的存储
        async onSubmit() {
            // 使用js中的方法将对应的日期数据进行抽取
            const time = new Date()
            const year = time.getFullYear()
            const month = time.getMonth() + 1 > 10 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
            const day = time.getDate() + 1 > 10 ? time.getDate() + 1 : '0' + time.getDate()
            const hour = time.getHours() > 10 ? time.getHours() : '0' + time.getHours()
            const minute = time.getMinutes() > 10 ? time.getMinutes() : '0' + time.getMinutes()
            const date = year + "-" + month + "-" + day + " " + hour + ":" + minute
            // 使用axois发送ajax请求，并将行es6进行解构接收数据
            const { data: res } = await this.$http.get("/article/add", {
                params: {
                    'title': this.sizeForm.title,
                    'subtitle': this.sizeForm.subtitle,
                    'md_content': this.sizeForm.md_content,
                    'creatdate': date
                }
            })
            // 后端返回的结果字符串判断
            if (res === 'success') {
                this.$message({
                    message: '添加成功！！',
                    type: 'success'
                })
                // 路由进行编程式跳转
                this.$router.replace('/layout/article1/' + window.localStorage.getItem('username'))
            } else {
                this.$message.error('添加失败！！')
            }
        }
    }
}
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    height: 100%;
    background: white;
}
</style>