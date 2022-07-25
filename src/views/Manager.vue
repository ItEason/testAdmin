<template>
    <div class="manager-container">
        <!-- 个人信息展示布局，这里使用的是原生的DIV+CSS布局 -->
        <div class="manager-context">
            <div class="content">
                <h4>个人主页</h4>
                <el-button type="primary" style="height:35px; margin-top:1%; line-height:9px"
                    @click="dialogFormVisible = true">
                    修改信息
                </el-button>
            </div>
            <div class="content1">
                <span>头像:</span>
                <img src="../assets/image6.webp" alt="blank">
            </div>
            <div class="content2" style="min-height: 60px; line-height: 60px">
                <div>工号： <span>{{ blogerList.id }} </span></div>
            </div>
            <div class="content2" style="min-height: 60px; line-height: 60px; clear:both">
                <div>姓名：<span>{{ blogerList.name }}</span></div>
            </div>
            <div class="content2" style="min-height: 60px; line-height: 60px">
                <div>年龄：<span>{{ blogerList.age }}</span></div>
            </div>
            <div class="content2" style="min-height: 60px; line-height: 60px">
                <div>电话：<span>{{ blogerList.tel }}</span></div>
            </div>
            <div class="content2" style="min-height: 60px; line-height: 60px">
                <div>学校：<span>{{ blogerList.school }}</span></div>
            </div>
            <div class="content2" style="min-height: 60px; line-height: 60px">
                <div>地址：<span>{{ blogerList.address }}</span></div>
            </div>
            <div class="content2" style="min-height: 60px; line-height: 60px">
                <div>上次修改时间：<span>{{ blogerList.edit }}</span></div>
            </div>
            <!-- 修改信息模态框，使用Element-Ui实现 -->
            <el-dialog title="个人信息修改" :visible.sync="dialogFormVisible" width="65%">
                <el-form :model="form">
                    <el-form-item label="年龄：" :label-width="formLabelWidth">
                        <el-input v-model="form.age" autocomplete="on"></el-input>
                    </el-form-item>
                    <el-form-item label="电话：" :label-width="formLabelWidth">
                        <el-input v-model="form.tel" autocomplete="on"></el-input>
                    </el-form-item>
                    <el-form-item label="学校：" :label-width="formLabelWidth">
                        <el-input v-model="form.school" autocomplete="on"></el-input>
                    </el-form-item>
                    <el-form-item label="地址：" :label-width="formLabelWidth">
                        <el-input v-model="form.address" autocomplete="on"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 页脚处的按钮，进行信息的取消或者确定 -->
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="confirm">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Manager',
    data() {
        return {
            blogerList: [],
            dialogFormVisible: false,
            form: {
                tel: '',
                age: '',
                school: '',
                address: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '120px'
        }
    },
    methods: {
        // 初始化页面数据，将bloger表中的数据读取
        async initList() {
            const { data: res } = await this.$http.get('/blogInfo')
            this.blogerList = res[0]
        },
        // 模态框取消方法
        cancel() {
            this.dialogFormVisible = false
        },
        // 模态框确定方法，使用axios发送post请求进行数据的更新
        async confirm() {
            // 发送post请求
            const { data: res } = await this.$http.post('/bloger/update', {
                'age': this.form.age,
                'tel': this.form.tel,
                'school': this.form.school,
                'address': this.form.address
            })
            // 执行成功对应的方法
            if (res === 'success') {
                this.$message({
                    message: '修改成功！！',
                    type: 'success'
                })
            }
            this.dialogFormVisible = false
        }
    },
    created() {
        this.initList()
    }
}
</script>

<style lang="less" scoped>
.manager-container {
    width: 100%;
    min-height: 200px;
    background: white;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .content {
        display: flex;
        justify-content: space-between;
    }

    .manager-context {
        width: 90%;
        height: 80%;
        font-size: 14px;

        img {
            width: 80px;
            height: 80px;
            vertical-align: top;
            margin-left: 2%;
        }

        .content1,
        .content2 {
            float: left;
            width: 50%;
            min-height: 80px;
        }
    }
}
</style>