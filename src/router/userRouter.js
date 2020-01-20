import User from '../db/models/UserModel'
import express from 'express'

let router = express.Router()

/**
 * 创建用户
 */
async function addUser(req,res,next){
    let {name,password} = req.body
    try {
        if(!name || !password){
            res.json({errno:-1,message:'param err.'})
         }else{
             let user  = await User.find({name})
             console.log('find',user)
             if(user.length>0){
                res.json({errno:-1,message:'user is existed.'})
             }else{
                 let newData = await User.create({name,password})
                 console.log('newData',newData)
                 if(newData){
                    res.json({errno:0,message:'ok.'})
                 }else{
                    res.json({errno:-2,message:'no.'})
                 }
             }
         }
    } catch (error) {
        next(error)
    }
}

//添加用户
router.post('/add',(req,res,next) => {
    addUser(req,res,next)
})

//获取用户列表
router.get('/',(req,res,next) => {
    User.find()
    .then( data => {
        res.json(data)
    })
    .catch(err => {
        res.json([])
    })
})
module.exports = router