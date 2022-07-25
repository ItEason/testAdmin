// (一) 导入对应的模板
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// (二) 创建对应的express实例app
const app = express()

// (三.一) 使用app.use()方法将cors注册为插件，实现解决跨域问题(允许跨域资源共享)
app.use(cors())
// (三.二) 使用body-parser模块进行处理Post请求的参数 注意：这个极其之重要
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// (四) 导入数据库连接对象db，之前使用的是直接填写对应的数据库对象信息，现在使用的是模块化
const conn = require('./index')


// (五) 创建对应的查询article表的路由,进行数据的读取(使用分页查询完成)
app.get('/articleInfo', (req, res) => {
    // 5.1 设置分页查询的sql语句
    let sql = `select * from article`
    // 5.2 调用query方法进行sql语句的相关操作
    conn.query(sql, (err, results) => {
        // 5.2.1 若发生错误,打印错误信息,并停止后续程序的进行
        if (err) {
            console.log(err.message);
            return
        }
        //5.2.2 返回的查询信息为result,用于前台的接收
        res.send(results)
    })
})
// (六) 创建对应的查询article表拥有数据数,进行后续的分页查询使用
app.get('/articleCount', (req, res) => {
    // 5.1 设置分页查询的sql语句
    let sql = "select count(*) as count from article"
    // 5.2 调用query方法进行sql语句的相关操作
    conn.query(sql, (err, results) => {
        // 5.2.1 若发生错误,打印错误信息,并停止后续程序的进行
        if (err) {
            console.log(err.message);
            return
        }
        //5.2.2 返回的查询信息为result,用于前台的接收
        res.send(results)
    })
})

// (七) 创建对应的查询administrator表的路由,进行数据的读取
app.get('/userInfo', (req, res) => {
    // 7.1 设置分页查询的sql语句
    let sql = "select * from administrator"
    // 7.2 调用query方法进行sql语句的相关操作
    conn.query(sql, (err, results) => {
        // 7.2.1 若发生错误,打印错误信息,并停止后续程序的进行
        if (err) {
            console.log(err.message);
            return
        }
        //7.2.2 返回的查询信息为result,用于前台的接收
        res.send(results)
    })
})

// (八)创建对应的删除administrator表数据的路由，进行用户信息的删除
app.get('/adminstrator/delete', (req, res) => {
    const sql = "delete from administrator where id = ?"

    const params = req.query

    conn.query(sql, [params.id], (err, results) => {
        if (err) {
            console.log(err.message);
            return
        }
        if (results.affectedRows > 0) {
            res.send('success')
            return
        }
        res.send('fail')
    })
})

// (九) 将新增的管理员信息存进数据库
app.post('/administrator', (req, res) => {
    // 8.1 获取用户通过post请求传输到该路由的查询参数
    const bodys = req.body
    // 8.2 设置对应的sql语句
    const sql = "insert into administrator values(null, ?, ?, ?, ?)"
    // 8.3 执行对应的sql语句
    conn.query(sql, [bodys.username, bodys.password, bodys.position, bodys.address], (err, results) => {
        if (err) {
            console.log(err.message);
            return
        }
        res.send('success')
    })
})

// (十) 创建路由进行对应的管理员用名新增检验
app.get('/ckeck', (req, res) => {
    const params = req.query
    const sql = "select * from administrator where username = ?"
    conn.query(sql, [params.username], (err, results) => {
        if (err) {
            return console.log(err.message);
        }
        // 我真是个傻逼，怎么判断数据未null都忘记了，直接判断里面是否有数据即可(length === 0?)
        if (results.length === 0) {
            res.send('no-exits')
            return
        }
        res.send('exits')
    })
})

// (十一) 创建路由进行对应的管理员用名是否存在检验
app.post('/exist', (req, res) => {
    // 10.1 获取用户从网页中传输到后端的数据参数
    const bodys = req.body
    // 10.2 设置对应的查询administrator表的sql语句
    const sql = "select * from administrator where username = ?"
    // 10.3 使用query()方法进行执行
    conn.query(sql, [bodys.username], (err, results) => {
        // 10.3.1 当结果数组length===0时即不存在该用户
        if (results.length === 0) {
            res.send('usn')
            return
        }
        // 10.3.2 存在该用户，且密码正确
        if (bodys.password === results[0].password) {
            res.send('OK')
            return
        }
        // 10.3.3 存在该用户，但是跟原本设置的密码出错时
        res.send('psw')
    })
})

// (十二) 创建路由对文章article表的删除
app.post('/article/delete', (req, res) => {
    // 11.1 获取网页传输到后端的参数
    const bodys = req.body
    // 11.2 设置对应的sql语句
    const sql = "delete from article where id = ?"
    // 11.3 执行对应的sql语句
    conn.query(sql, bodys.id, (err, results) => {
        if (err) {
            console.log(err.message);
            return
        }
        if (results.affectedRows > 0) {
            res.send('success')
            return
        }
        res.send('failure')
    })
})

// (十三) 创建对应的查询manager表的路由,进行数据的读取
app.get('/classifitionInfo', (req, res) => {
    // 12.1 设置分页查询的sql语句
    let sql = `select * from manager limit ?, 5`
    // 12.2 调用query方法进行sql语句的相关操作
    conn.query(sql, [(req.query.current - 1) * 5], (err, results) => {
        // 12.2.1 若发生错误,打印错误信息,并停止后续程序的进行
        if (err) {
            console.log(err.message);
            return
        }
        // 12.2.2 返回的查询信息为result,用于前台的接收
        res.send(results)
    })
})

// (十四) 创建对应的查询manager表拥有数据数,进行后续的分页查询使用
app.get('/clsCount', (req, res) => {
    // 5.1 设置分页查询的sql语句
    let sql = "select count(*) as count from manager"
    // 5.2 调用query方法进行sql语句的相关操作
    conn.query(sql, (err, results) => {
        // 5.2.1 若发生错误,打印错误信息,并停止后续程序的进行
        if (err) {
            console.log(err.message);
            return
        }
        //5.2.2 返回的查询信息为result,用于前台的接收
        res.send(results)
    })
})

// (十五) 创建添加数据库类别的路由，调用该路由可以进行数据库manager表的信息添加
app.post('/classify/add', (req, res) => {
    // 14.1 获取页面传到后端的参数
    const bodys = req.body
    // 14.2 书写对应的sql语句
    const sql = "insert into manager values(?, 0)"
    // 14.3 执行sql语句并返回对应的状态
    conn.query(sql, bodys.tname, (err, results) => {
        // 14.3.1 倘若执行过程中出现错误，将错误信息打印并直接停止后续代码的执行
        if (err) {
            console.log(err.message);
            return
        }
        // 14.3.2 倘若成功地执行了sql语句，就返回对应的方法
        if (results.affectedRows > 0) {
            res.send({
                status: 'success'
            })
            return
        }
        res.send('fail')
    })
})

// (十六) 创建查询博主信息路由，进行数据库bloger表中数据的读取
app.get('/blogInfo', (req, res) => {
    // 15.1 编写sql语言
    const sql = "select * from bloger"
    // 15.2 执行对应的查询语句
    conn.query(sql, (err, results) => {
        // 15.2.1 倘若执行过程中出现错误，将错误信息打印并直接停止后续代码的执行
        if (err) {
            console.log(err.message);
            return
        }
        // 15.2.2 返回执行结果
        res.send(results)
    })
})

// (十七) 创建通过副分类名称进行查询的文章路由
app.get('/article/search', (req, res) => {
    // 16.1 设置对应的sql语句
    const sql = "select * from article where subtitle = ? "
    // 16.2 获取用户的查询参数
    const params = req.query
    // 16.3 执行对应的语句
    conn.query(sql, params.subtitle, (err, results) => {
        // 16.3.1 倘若执行过程中出现错误，将错误信息打印并直接停止后续代码的执行
        if (err) {
            console.log(err.message);
            return
        }
        // 16.3.2 返回结果集
        res.send(results)
    })
})

// (十八) 创建通过副分类名称进行查询的文章路由
app.get('/article/searchCount', (req, res) => {
    // 16.1 设置对应的sql语句
    const sql = "select count(*) as count from article where subtitle = ? "
    // 16.2 获取用户的查询参数
    const params = req.query
    // 16.3 执行对应的语句
    conn.query(sql, params.subtitle, (err, results) => {
        // 16.3.1 倘若执行过程中出现错误，将错误信息打印并直接停止后续代码的执行
        if (err) {
            console.log(err.message);
            return
        }
        // 16.3.2 返回结果集
        res.send(results)
    })
})

// (十九) 创建修改个人信息的路由，进行bloger表的数据更新
app.post('/bloger/update', (req, res) => {
    // 19.1 获取用户发送过来的信息
    const bodys = req.body
    // 19.2 设置对应的sql代码
    const sql = "update bloger set age = ?, tel = ?, school = ?, address = ?, edit = CURRENT_DATE"
    // 19.3 执行sql语句，进行数据的更新
    conn.query(sql, [bodys.age, bodys.tel, bodys.school, bodys.address], (err, results) => {
        // 19.3.1 倘若执行过程中出现错误，将错误信息打印并直接停止后续代码的执行
        if (err) {
            console.log(err.message);
            return
        }
        // 19.3.2 执行成功使用res.send()方法向客户端响应对应的字符串
        if (results.affectedRows > 0) {
            res.send('success')
        }
    })
})

// (二十) 创建修改文章信息的路由，进行article表的数据更新
app.get('/article/update', (req, res) => {
    // 20.1 获取url处的查询参数
    const params = req.query
    // 20.2 设置用于更新信息的update语句
    const sql = "update article set title = ?, subtitle = ?, md_content = ? where id = ?"
    // 20.3 执行对应的sql语句
    conn.query(sql, [params.title, params.subtitle, params.md_content, params.id], (err, results) => {
        // 20.3.1 倘若执行过程中出现错误，将错误信息打印并直接停止后续代码的执行
        if (err) {
            console.log(err.message);
            return
        }
        // 20.3.2 执行成功使用res.send()方法向客户端响应对应的字符串
        if (results.affectedRows > 0) {
            res.send('success')
        }
    })
})

// (二十一) 创建修改个人信息的路由，进行administrator表的数据更新
app.post('/administrator/update', (req, res) => {
    // 21.1 获取body处的查询参数
    const bodys = req.body
    // 21.2 设置更新sql语句
    const sql = "update administrator set username = ?, password = ?, position = ?, address = ? where id = ?"
    // 21.3 执行对应的sql语句
    conn.query(sql, [bodys.username, bodys.password, bodys.position, bodys.address, bodys.id], (err, results) => {
        // 21.3.1 倘若执行过程中出现错误，将错误信息打印并直接停止后续代码的执行
        if (err) {
            console.log(err.message);
            return
        }
        // 21.3.2 执行成功使用res.send()方法向客户端响应对应的字符串
        if (results.affectedRows > 0) {
            res.send('success')
        }
    })
})

// (二十二) 创建添加文章的路由，进行article表的数据更新
app.get('/article/add', (req, res) => {
    // 22.1 获取url中的查询参数
    const params = req.query
    // 22.2 设置对应的sql语句
    const sql = "insert into article values(null, ?, ?, ?, ?, 1, 1, 1)"
    // 22.3 执行对应的sql语句
    conn.query(sql, [params.title, params.subtitle, params.md_content, params.creatdate], (err, results) => {
        // 22.3.1 倘若执行过程中出现错误，将错误信息打印并直接停止后续代码的执行
        if (err) {
            console.log(err.message);
            return
        }
        // 22.3.2 执行成功使用res.send()方法向客户端响应对应的字符串
        if (results.affectedRows > 0) {
            res.send('success')
        }
    })
})

// (二十三) 开启服务器，使用8000端口进行监听
app.listen(8000, () => {
    console.log("服务已经开启，8000端口监听...");
})