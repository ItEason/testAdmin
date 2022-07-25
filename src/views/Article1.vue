<template>
    <div id="classify-container">
        <div id="search">
            <input type="text" placeholder="输入副分类进行搜索" v-model="searchMsg" @keyup.enter="search" />
            <el-button type="primary" size="mini" @click="search">搜索文章</el-button>
        </div>
        <el-table :data="currentList" style="width: 100%">
            <!-- 文章ID数据列 -->
            <el-table-column label="ID" width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <!-- 文章所属分类数据列 -->
            <el-table-column label="分类" width="180">
                <template slot-scope="scope">
                    <i class="el-icon-collection-tag"></i>
                    <span style="margin-left: 10px">{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <!-- 文章所属副分类数据列 -->
            <el-table-column label="副分类" width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.subtitle }}</span>
                </template>
            </el-table-column>
            <!-- 文章标题内容数据列 -->
            <el-table-column label="标题内容" width="180">
                <template slot-scope="scope">
                    <i class="el-icon-document-copy"></i>
                    <span style="margin-left: 10px">{{ scope.row.md_content }}</span>
                </template>
            </el-table-column>
            <!-- 文章创建日期数据列 -->
            <el-table-column label="日期" width="180">
                <template slot-scope="scope">
                    <i class="el-icon-date"></i>
                    <span style="margin-left: 10px">{{ scope.row.creatdate }}</span>
                </template>
            </el-table-column>
            <!-- 文章操作列 -->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 文章信息编辑模态框 -->
        <el-dialog title="文章信息修改" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <!-- 文章的所属分类 -->
                <el-form-item label="分类" :label-width="formLabelWidth">
                    <el-input v-model="form.title" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 文章的所属副分类 -->
                <el-form-item label="副分类" :label-width="formLabelWidth">
                    <el-input v-model="form.subtitle" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 文章的标题内容 -->
                <el-form-item label="标题内容" :label-width="formLabelWidth">
                    <el-input v-model="form.md_content" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <!-- 模态框的取消和确定按钮 -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="close">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 页面上下页操作按钮列 -->
        <div class="operations">
            <!-- 上一页操作按钮 -->
            <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="pre"></el-button>
            <el-button type="primary" size="mini" plain>
                {{ page }} / {{ pages }}
            </el-button>
            <el-button type="primary" size="mini" plain>
                总{{ allPage}}条
            </el-button>
            <!-- 下一页操作按钮 -->
            <el-button type="primary" size="mini" @click="next" icon="el-icon-arrow-right"></el-button>
        </div>
    </div>
</template>

<script>
export default {
    // Article1.vue组件中使用到的数据
    data() {
        return {
            // 接收后端传送到前端的数据库信息
            artList: [],
            // 当前页面需要展示的数据列表
            currentList: [],
            // 当前页数信息变量
            page: 1,
            // 接收数据库所有数据数
            allPage: 0,
            // 分页查询后总共的页数
            pages: 0,
            // 
            flag: '',
            // 文章删除成功与否变量
            msg2: '',
            // 搜索框内容
            searchMsg: '',
            // 用户展示或隐藏模态框的变量
            dialogFormVisible: false,
            // 用与存储模态框信息的form表单变量
            form: {
                id: 0,
                title: '',
                subtitle: '',
                md_content: ''
            },
            formLabelWidth: '120px'

        }
    },
    // 组件创造阶段直接初始化对应的获取信息的方法
    created() {
        this.initArticleCount()
        this.initArticleList()
    },
    // Article1.vue组件中使用到的方法
    methods: {
        // 用户编辑按钮事件
        handleEdit(index, row) {
            this.dialogFormVisible = !this.dialogFormVisible
            this.form.id = row.id
            this.form.title = row.title
            this.form.subtitle = row.subtitle
            this.form.md_content = row.md_content
            // 这是进行网页的信息弹框
        },
        // 用户点击模态框对应的方法
        async close() {
            this.dialogFormVisible = !this.dialogFormVisible
            // TODO: 在app.js创建对应的路由，进行数据的更新
            const { data: res } = await this.$http.get('/article/update', {
                params: {
                    'title': this.form.title,
                    'subtitle': this.form.subtitle,
                    'md_content': this.form.md_content,
                    'id': this.form.id
                }
            })
            // 页面根据对应的状态展示对应的提示
            if (res === 'success') {
                this.$message({
                    message: '修改成功！',
                    type: 'success'
                })
            } else {
                this.$message.error("修改失败！")
            }
        },
        // 用户删除按钮事件
        async handleDelete(index, row) {
            const id = row.id
            // 使用axois发送post请求
            const { data: res } = await this.$http.post('/article/delete', { 'id': id })
            this.msg1 = res
            // 这是进行网页的信息弹框
            if (this.msg1 === 'success') {
                this.$message({
                    message: '删除成功！',
                    type: 'success'
                })
            } else {
                this.$message.error("删除失败！")
            }
        },
        // 初始化数据库article信息方法
        async initArticleList() {
            const { data: res } = await this.$http.get('/articleInfo')
            this.artList = res
            // 
            for (var i = 0; i < 6; i++) {
                if (i < this.allPage) {
                    this.currentList.push(this.artList[i])
                }
            }
        },
        // 初始化数据库article总数据量
        async initArticleCount() {
            const { data: res } = await this.$http.get('/articleCount')
            this.allPage = res[0].count
            // 计算得到总共的页数，提高页面使用友好性
            this.pages = this.allPage % 6 === 0 ? parseInt(this.allPage / 6) : parseInt(this.allPage / 6) + 1
        },
        // 上一页分页查询功能方法
        pre() {
            // 当前页面为1时的情况
            if (this.page <= 1) {
                // 每次需将上一次的数据进行清空
                this.currentList = []
                // 对应的赋值算法
                for (var i = 0; i < 6; i++) {
                    this.currentList.push(this.artList[i])
                }
            } else {
                // 当前页面不为1的情况
                this.page--
                // 每次需将上一次的数据进行清空
                this.currentList = []
                // 对应的赋值算法
                for (var i = (this.page - 1) * 6; i < this.page * 6; i++) {
                    this.currentList.push(this.artList[i])
                }
            }
        },
        // 下一页分页查询功能方法
        next() {
            // var pages = 0
            // if (this.allPage % 8 === 0) {
            //     pages = Number.parseInt(this.allPage / 6)
            // } else {
            //     pages = Number.parseInt(this.allPage / 6) + 1
            // }
            // 当前页面不是最后一页时的情况
            if (this.page < this.pages) {
                // 当前页面自增1
                this.page++
                // 将当前页面进行清空
                this.currentList = []
                // 对应的赋值算法
                for (var i = (this.page - 1) * 6; i < this.page * 6; i++) {
                    if (i < this.allPage) {
                        this.currentList.push(this.artList[i])
                    }
                }
            }
        },
        // 初始化对应的搜索数据列表
        async initSearchList(subtitle) {
            // 清空创建创建生命周期时的数据
            this.currentList = []
            this.artList = []
            // 使用axios发起对应的GET请求进行后续的数据获取
            const { data: res } = await this.$http.get('/article/search?subtitle=' + subtitle)
            this.artList = res
            // 对应的赋值算法
            for (var i = 0; i < 6; i++) {
                if (i < this.allPage) {
                    this.currentList.push(this.artList[i])
                }
            }
        },
        // 初始化对应的搜索数据列表数
        async initSearchCount(subtitle) {
            // 重置当前页面为1
            this.page = 1
            // 使用axios发起对应的GET请求进行后续的数据获取
            const { data: res } = await this.$http.get('/article/searchCount?subtitle=' + subtitle)
            this.allPage = res[0].count
            // 计算得到总共的页数，提高页面使用友好性
            this.pages = this.allPage % 6 === 0 ? parseInt(this.allPage / 6) : parseInt(this.allPage / 6) + 1
        },
        // 通过副分类进行分类搜索
        search() {
            // 调用对应的方法，进行数据的更新
            this.initSearchCount(this.searchMsg)
            this.initSearchList(this.searchMsg)
        }
    }
}
</script>

<style lang="less" scoped>
#class-container {
    width: 100%;
    height: 100%;
    background: #c9c9c9
}

#search {
    margin-bottom: 10px;
    width: 100%;
    text-align: center;

    input {
        width: 200px;
        height: 20px;
        margin-right: 10px;
        outline: none;
    }
}

.operations {
    float: right;
    margin-top: 10px;
    padding: 0 5px 0 0;
}

#info {
    position: absolute;
    display: none;
    right: 5%;
    top: 9.5%;
    width: 120px;
    min-height: 55;
    text-align: center;
    line-height: 55px;
    color: white;
    font-size: 13px;
    border-radius: 5px;
    background: rgba(51, 66, 86, 1);
    z-index: 4;
}
</style>