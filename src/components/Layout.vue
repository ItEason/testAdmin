<template>
    <!-- 此页面均是由Element-UI 进行Pc端的布局第一次使用有点生疏 -->
    <el-container>
        <!-- header头标题 -->
        <el-header style="padding:0">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                background-color="rgb(37, 48, 65)" text-color="#fff" active-text-color="#ffd04b"
                style="border-bottom: none;">
                <el-menu-item index="#">
                    <i class="el-icon-menu"></i>
                    <span slot="title">博客后台管理</span>
                </el-menu-item>
                <el-submenu index="2" style="float:right">
                    <template slot="title">{{ username }}</template>
                    <el-menu-item index="#" @click="logout">退出登录</el-menu-item>
                    <el-menu-item index="#" @click="info">查看个人信息</el-menu-item>
                </el-submenu>
                <el-menu-item index="3" style="float:right">
                    <i class="el-icon-s-operation"></i>
                    <img src="../assets/image6.webp" alt="blank" class="image" />
                </el-menu-item>
            </el-menu>
        </el-header>
        <!-- container 用法不知，但估计跟bootstrap的差不多 -->
        <el-container>
            <!-- aside左侧固定栏 -->
            <el-aside width="160px">
                <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                    background-color="rgb(51, 66, 86)" text-color="#fff" active-text-color="#ffd04b" router
                    style="height:100%">
                    <el-menu-item :index="url">
                        <i class="el-icon-reading"></i>
                        <span slot="title">文章管理</span>
                    </el-menu-item>
                    <el-menu-item index="/layout/article2">
                        <i class="el-icon-edit"></i>
                        <span slot="title">撰写文章</span>
                    </el-menu-item>
                    <el-menu-item index="/layout/classify">
                        <i class="el-icon-document"></i>
                        <span slot="title">文章分类</span>
                    </el-menu-item>
                    <el-menu-item index="/layout/userInfo">
                        <i class="el-icon-setting"></i>
                        <span slot="title">用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="/layout/addAdmin">
                        <i class="el-icon-circle-plus-outline"></i>
                        <span slot="title">账号添加</span>
                    </el-menu-item>
                    <el-menu-item index="/layout/manager">
                        <i class="el-icon-user"></i>
                        <span slot="title">个人信息</span>
                    </el-menu-item>
                    <el-menu-item index="#" @click="logout">
                        <i class="el-icon-house"></i>
                        <span slot="title">返回登录</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <!-- main中间内容 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: 'Layout',
    data() {
        return {
            activeIndex: '1',
            activeIndex2: '1',
            url: '/layout/article1/' + window.localStorage.getItem('username'),
            username: ''
        }
    },
    created() {
        this.username = window.localStorage.getItem('username')
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        // 为退出登录注册对应的事件
        logout() {
            // 先将用户serve服务器中的token进行remove
            window.localStorage.removeItem('token')
            window.localStorage.removeItem('username')
            // 进行注销消息的信息弹框
            this.$message({
                message: '账号退出成功!',
                type: 'success'
            })
            // 使用编程式路由将该页面返回登录页面
            this.$router.push('/administrator/login')
        },
        info() {
            this.$router.replace('/layout/manager')
        }
    }
}
</script>

<style lang="less" scoped>
.el-header {
    background: #000;
    color: #333;
    text-align: center;
    line-height: 60px;
    padding: 0;
}

.el-aside {
    background-color: rgb(51, 66, 86);
    color: #333;
    text-align: center;
    line-height: 300px;
}

.el-main {
    background-color: rgba(203, 229, 255, 0.5);
    color: #333;
    // text-align: center;
    // line-height: 160px;
    margin-top: 10px;
}

body>.el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}

.el-container {
    position: absolute;
    width: 100%;
    top: 0px;
    left: 0;
    bottom: 0;
}

.el-header {
    padding: 0;
    z-index: 1000;
}

.el-header .fr {
    float: right;
}

.el-header .el-menu {
    border-bottom: none;
}

.el-aside,
.el-main {
    padding-top: 60px;
}

.el-aside {
    background: #545c64;
}

.el-aside .el-menu {
    background-color: rgb(51, 66, 86);
    border-right: none;
}

.image {
    height: 56px;
    width: 56px;
    border-radius: 50%;
    border: 1px solid white;
}
</style>