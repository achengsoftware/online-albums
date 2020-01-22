import express from 'express'
import path from 'path'
import bodyParser  from 'body-parser'
import session  from 'express-session'

//链接数据库
import './db/connect'

import uploadImageRouter from './router/uploadRouer'
import userRouter from './router/userRouter'


const app = express()
//开放静态资源目录
app.use('/upload-images',express.static(path.join(__dirname,'../upload-images')))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// 设置session
app.use(session({
    // 对session id 相关的cookie 进行签名
    secret:'albums',
    resave: true,
    //是否保存未初始化的会话
    saveUninitialized:false,
    cookie:{
        // 设置 session 的有效时间，单位毫秒
        maxAge : 1000 * 60 * 3
    },
    store: new MongoStore({
        db: 'sessiondb'
    })
}))

// 允许跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

//设置路由
app.use('/upload',uploadImageRouter)
app.use('/user',userRouter)

//处理出错
app.use((err,req,res) => {
    let {errno,message} = err
    res.json({errno,message})
})
//处理404
app.use((req,res) => {
    res.json({
        errno:404,
        message:''
    })
})
app.listen(3000,() => console.log(`Server is running at port 3000...`))