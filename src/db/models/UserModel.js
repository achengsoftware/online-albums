import mongoose from 'mongoose'

let Users = mongoose.model('Users',new mongoose.Schema({
    name:  String,
    password: String,
    date: { type: Date, default: Date.now }
}))

module.exports  = Users