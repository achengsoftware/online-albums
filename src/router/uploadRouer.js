import express from 'express'
import multer from 'multer'
import fs from 'fs'

import Photo from '../db/models/PhotosModel'
import { Promise } from 'mongoose'
import { resolve } from 'url'

let router = express.Router()

let storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,"upload-images")
    },
    filename:  (req,file,cb) =>{
        let suff = file.mimetype.split('/')
        cb(null,Date.now()+'.'+suff[suff.length-1])
    }
})
let upload = multer({storage,
    limits:1024*1024*1024
})

//图片信息保存到数据库
async function saveImage2Db(req,res,next){
    try {
        let url = `${req.file.destination}/${req.file.filename}`
        let {uploaderId} = req.body
        if(!uploaderId){
           fs.unlinkSync(req.file.path)
           return res.json({errorno:-3,message:'param error.'})
        }
        let data = await Photo.create({uploaderId,url})
        if(data){
            let message = `${req.protocol}://${req.get('host')}/${req.file.destination}/${req.file.filename}`
            return  res.json({errorno:0,message})
        }else{
            fs.unlinkSync(req.file.path)
            return  res.json({errorno:-3,message:'db err.'})
        }
    } catch (error) {
        next(error)
    }
}
//上传文件
router.post('/add',upload.single("file"),(req,res,next) =>{
    saveImage2Db(req,res,next)
})

//获取所有图片信息
router.get('/',async (req,res) => {
    let images = await Photo.find()
    res.json(images)
})

//删除所有
router.get('/removeAll',async (req,res) => {
    let images = await Photo.find()
    images.forEach(element => {
        Photo.deleteMany({_id:element._id},err => {
            if(err){
                return  res.json({errorno:-3,message:'del err.'})
            }
            if(fs.existsSync(element.url)){
                fs.unlinkSync(element.url)
            }
        })
    })
    res.json({errorno:0,message:'ok.'})
})

// 删除
router.get('/remove',async (req,res) =>{
    console.log(req.query)
    let {id:_id} = req.query
    console.log(_id)
    let data = await Photo.find({_id})
    if(data.length === 0){
        return res.json({errorno:0,message:'not find'})
    }
    let filePath = data[0].url
    if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath)
    }
    await Photo.findByIdAndRemove(_id)
    res.json({errorno:0,message:'ok'})
})

//分页查询
router.get('/photosByPages',(req,res) => {
    let {pageNum = 1, pageSize = 2} = req.query
    let curIndex = parseInt(pageNum)
    let curPageSize = parseInt(pageSize)
    //获取总条数
    Photo.count({},(err, count) =>{
        //条件查询
        Photo.find().skip((curIndex-1)*curPageSize).limit(curPageSize).sort({'date':-1}).exec((err,doc) => {
            try {
                if (!err && doc) {
                    let totalPage = Math.ceil(count/curPageSize)
                    let nextPage = totalPage<= curIndex ? 1:curIndex+1
                    let prePage = curIndex===1 ? 1:curIndex-1
                    let base = `${req.protocol}://${req.get('host')}/`
                    doc.forEach(element => {
                        element.url = base + element.url
                        //console.log(element.url)
                    });
                    return res.json(
                        {
                            curPage:curIndex,
                            nextPage,
                            prePage,
                            totalPage,
                            totalCount: count,
                            data: doc,
                            errorno: 0,
                            message: 'ok', 
                        })
                }
                res.json({errorno: -1, msg: '',data:[]})
            } catch (e) {
                console.log('=====================================')
                res.json({errorno: -1, msg: '',data:[]})
            }
        })
    })

})
export default router