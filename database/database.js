const mongoose = require('mongoose')
//Ket noi csdl
const connectDatabase = async () => {
    try {
        let uri = 'mongodb://quynh:123456@127.0.0.1:27018/fullstackNodejs'
        let options = {
            connectTimeoutMS: 10000,// 10 giây
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }
        await mongoose.connect(uri, options)
        console.log('Connected MongoDB successfully!')
    } catch (error) {
        console.log(`Cannot connect Mongo. Error:${error}`)
    }
}

connectDatabase()

module.exports = { mongoose }