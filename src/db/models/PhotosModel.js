import mongoose from 'mongoose'

let photos = mongoose.model('photos',new mongoose.Schema({
    url: {
        required: true,
        type: String,
    },
    uploaderId: String,
    date: { type: Date, default: Date.now }
}))

module.exports  = photos