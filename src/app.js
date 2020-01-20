import express from 'express'
import path from 'path'
import bodyParser  from 'body-parser'

//链接数据库
import './db/connect'

import uploadImageRouter from './router/uploadRouer'
import userRouter from './router/userRouter'
// import PhotosRouter from './router/PhotosRouter'

const app = express()
//开放静态资源目录
app.use('/upload-images',express.static(path.join(__dirname,'../upload-images')))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//设置路由
app.use('/upload',uploadImageRouter)
app.use('/user',userRouter)

//处理出错
app.use((err,req,res) => {
    console.log('========err=======')
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