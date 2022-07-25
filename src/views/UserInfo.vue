<template>
    <!-- 设置对应的唯一的最外层标签，进行包裹 -->
    <div>
        <el-table :data="userList" style="width: 100%">
            <!-- ID数据列 -->
            <el-table-column label="ID" width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <!-- 管理员数据列 -->
            <el-table-column label="用户名" width="180">
                <template slot-scope="scope">
                    <i class="el-icon-user"></i>
                    <span style="margin-left: 10px">{{ scope.row.username }}</span>
                </template>
            </el-table-column>
            <!-- 管理员登录密码数据列 -->
            <el-table-column label="密码" width="180">
                <template slot-scope="scope">
                    <i class="el-icon-lock"></i>
                    <span style="margin-left: 10px">{{ scope.row.password }}</span>
                </template>
            </el-table-column>
            <!-- 管理员职业数据列 -->
            <el-table-column label="职位" width="180">
                <template slot-scope="scope">
                    <i class="el-icon-school"></i>
                    <span style="margin-left: 10px">{{ scope.row.position }}</span>
                </template>
            </el-table-column>
            <!-- 管理员部分信息数据列 -->
            <el-table-column label="用户名" width="180">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>职位: {{ scope.row.position }}</p>
                        <p>住址: {{ scope.row.address }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.username }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <!-- 管理员操作列 -->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 模态框 -->
        <el-dialog title="管理信息修改" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="用户名：" :label-width="formLabelWidth">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户密码：" :label-width="formLabelWidth">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="职位：" :label-width="formLabelWidth">
                    <el-input v-model="form.position" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址：" :label-width="formLabelWidth">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="close">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    inject: ['reload'],
    name: 'UserInfo',
    // userInfo.vue组件用到的数据data
    data() {
        return {
            userList: [],
            dialogFormVisible: false,
            form: {
                username: '',
                password: '',
                position: '',
                address: ''

            },
            formLabelWidth: '120px'
        }
    },
    // 组件初始化阶段中的created生命阶段，进行administrator表的初始化
    created() {
        // 调用初始化方法
        this.initUserList()
    },
    // userInfo.vue组件用到的方法methods
    methods: {
        // 管理员点击编辑按钮进行以下的操作
        handleEdit(index, row) {
            this.dialogFormVisible = !this.dialogFormVisible
            // 将模态框数据进行赋值
            this.form.username = row.username
            this.form.password = row.password
            this.form.position = row.position
            this.form.address = row.address
            this.form.id = row.id
        },
        // 管理员点击模态框中的确定进行以下的操作
        async close() {
            this.dialogFormVisible = !this.dialogFormVisible
            const { data: res } = await this.$http.post('/administrator/update', {
                'username': this.form.username,
                'password': this.form.password,
                'position': this.form.position,
                'address': this.form.address,
                'id': this.form.id
            })
            // 执行成功对应的方法
            if (res === 'success') {
                this.$message({
                    message: '修改成功！！',
                    type: 'success'
                })
            }
            this.dialogFormVisible = false
            this.$router.push('/layout/userInfoBack')
        },
        // 管理员点击删除按钮进行以下的操作
        async handleDelete(index, row) {
            const { data: res } = await this.$http.get('/adminstrator/delete?id=' + row.id)
            if (res === 'success') {
                this.$message({
                    message: '删除成功！！',
                    type: 'success'
                })
            } else {
                this.$message.error("删除失败！！")
            }
            this.$router.push('/layout/userInfoBack')
        },
        // administrator表信息初始化的initUserList方法
        async initUserList() {
            const { data: res } = await this.$http.get('http://127.0.0.1:8000/userInfo')
            this.userList = res
        }
    }
}
</script>

<style lang="less" scoped>
</style>