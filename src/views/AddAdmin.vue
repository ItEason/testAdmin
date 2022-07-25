<template>
    <div id="register-container">
        <div id="app">
            <!-- Element-UI表单标签 -->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                class="demo-ruleForm">
                <!-- 用户名输入框 -->
                <el-form-item label="用户名:" prop="username">
                    <el-input type="text" v-model="ruleForm.username" autocomplete="off" id="username" @blur="Check">
                    </el-input>
                    <span class="information">用户已经存在！！</span>
                </el-form-item>
                <!-- 密码输入框 -->
                <el-form-item label="密码:" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 确认密码输入框 -->
                <el-form-item label="确认密码:" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 年龄输入框 -->
                <el-form-item label="身份:" prop="position">
                    <el-input v-model="ruleForm.position"></el-input>
                </el-form-item>
                <!-- 地址输入框 -->
                <el-form-item label="住址:" prop="address">
                    <el-input v-model="ruleForm.address"></el-input>
                </el-form-item>
                <!-- 操作按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'addAdmin',
    // 以下是从Element-UI官网中赋值下来的，不懂对应的data写法(后续还需要进行学习)
    data() {
        // 职位输入框内容验证
        var validatePos = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入注册者的身份'));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        // 密码输入框内容验证
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        // 用户名输入框内容验证
        var validateUser = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        // 地址输入框内容验证
        var validateAddress = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入地址'));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        // 确认密码输入框内容验证
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            // 需要用到的数据变量
            ruleForm: {
                pass: '',
                checkPass: '',
                position: '',
                username: '',
                address: ''
            },
            // 表单验证规则
            rules: {
                username: [
                    { validator: validateUser, trigger: 'blur' }
                ],
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                position: [
                    { validator: validatePos, trigger: 'blur' }
                ],
                address: [
                    { validator: validateAddress, trigger: 'blur' }
                ],
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // TODO：输入要进行的操作
                    const bodys = this.ruleForm
                    this.$http.post('/administrator', { 'username': bodys.username, 'password': bodys.pass, 'position': bodys.position, 'address': bodys.address }).
                        then((res, err) => {
                            if (res.data === 'success') {
                                this.$message({
                                    message: '添加成功！！',
                                    type: 'success'
                                })
                            } else {
                                dthis.$message.error("添加失败！！")
                            }
                            this.$router.replace('/layout/userInfo')
                        })

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // 用户名验证，使用axios控制的get请求
        async Check() {
            if (this.ruleForm.username !== '') {
                const { data: res } = await this.$http.get('/ckeck?', {
                    params: { 'username': this.ruleForm.username }
                })
                if (res === 'exits') {
                    const info = document.querySelector('.information')
                    info.style.display = 'inline-block'
                } else {
                    const info = document.querySelector('.information')
                    info.style.display = 'none'
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
* {
    margin: 0;
    padding: 0;
}

#register-container {
    width: 100%;
    height: 100%;
    background: rgba(250, 250, 250, 0.8);
}

#app {
    position: relative;
    width: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.information {
    display: none;
    position: absolute;

    color: red;
    font-size: 13px;
    width: 120px;
}
</style>
