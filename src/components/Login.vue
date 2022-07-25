<template>
    <div id="login-container">
        <!-- 使用原生的Div+Css进行登录页面的样式设计 -->
        <div class="login">
            <form action="" style="height: 100%" method="post">
                <!-- 整个的登录框内容 -->
                <div class="login-box">
                    <!-- 登录框标题内容 -->
                    <div class="login-text">
                        <h3>个人博客后台管理</h3>
                    </div>
                    <!-- 登录框用户名内容 -->
                    <div class="login-username">
                        <input type="text" v-model="username" name="username" @blur="login" placeholder="请输入用户名">
                        <span class="info1" v-if="context === 'usn'"><strong>{{ info1 }}</strong></span>
                        <span class="info1" v-if="context === 'isnull'"><strong>{{ info3 }}</strong></span>
                    </div>
                    <!-- 登录框密码内容 -->
                    <div class="login-password">
                        <input type="password" v-model="password" name="passowrd" placeholder="请输入用户密码">
                        <span class="info2" v-if="context === 'psw'"><strong>{{ info2 }}</strong></span>
                    </div>
                    <!-- 登录框提交内容 -->
                    <div class="login-submit">
                        <router-link :to="url">
                            <button type="submit" id="submit" @click="login">登录</button>
                        </router-link>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'login',
    // 管理员登录页面中使用到的数据
    data() {
        return {
            username: '',
            password: '',
            info1: '用户不存在！！',
            info2: '密码错误！！',
            info3: '用户名不能为空！！',
            context: '',
            url: '/layout/article1/' + this.username
        }
    },
    // 管理员登录页面中需要用到的事件方法
    methods: {
        // 登录函数login，用来发送ajax异步判断数据库表administrator表中是否存在该用户
        async login() {
            // 倘若管理员没有输入任何内容不进行ajax异步发送请求，从而减轻后端数据库的压力
            if (this.username === '') {
                this.context = 'isnull'
                return
                // 当且仅当用户输入了用户名，才进行对应数据的验证
            } else {
                this.context = ''
                const { data: res } = await this.$http.post('/exist', { 'username': this.username, 'password': this.password })
                this.context = res
                // 若存在，则做出判断并进行编程式的路由方式
                if (res === 'OK') {
                    // 手动添加一个token，模拟token的使用
                    window.localStorage.setItem('token', "Eason XXX")
                    window.localStorage.setItem('username', this.username)
                    // 手动添加一个setInterval计时器模拟30秒后token失效
                    // 手动添加一个username计时器模拟30秒后token失效
                    setInterval(function () {
                        window.localStorage.removeItem('token')
                    }, 30000)
                    // 提示登录成功信息
                    this.$message({
                        message: this.username + ', 欢迎您！',
                        type: 'success'
                    })
                    // 使用编程式的路由方式进行网页的切换
                    this.$router.replace('/layout/article1/' + this.username)
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

// 这是给login页面单独进行背景图的设置
#login-container {
    background: url('../assets/bg3.jpg');
    background-position: center;
    height: 100%;
    width: 100%;
    margin: 0;
    background-size: cover;
    position: fixed;
    top: 0;
    left: 0;

    .login {
        position: relative;
        top: 50%;
        left: 50%;
        width: 400px;
        height: 300px;
        text-align: center;
        background: rgba(250, 250, 250, 1);
        transform: translate(-50%, -50%);

        .login-box {
            width: 80%;
            height: 100%;
            margin: 0 auto;

            .login-text {
                height: 25%;
                width: 100%;
                color: rgb(64, 158, 255);
                line-height: 75px;
            }

            .login-username,
            .login-password,
            .login-submit {
                height: 25%;
                width: 100%;
                // line-height: 75px;
            }
        }

        .login-username input,
        .login-password input,
        .login-submit button {
            width: 100%;
            height: 35px;
            outline: none;
            border-radius: 3px;
            border: 1px solid #c9c9c9;
        }

        .login-submit button {
            background: rgb(64, 158, 255);
            color: white
        }

        span {
            float: left;
            margin-top: 4px;
            color: red;
            font-size: 12px;
        }
    }
}
</style>