import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/albums',{
    useUnifiedTopology: true ,
    useNewUrlParser: true
})
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open',() => {
    console.log('open db ok.')
})