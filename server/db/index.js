const config = require('../../config')
const mongoose = require('mongoose')

mongoose
    .connect(config.db_uri, 
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true 
        })
    .then(res => {
        console.log("mongoose connected successfully")
    })
    .catch(error => {
        console.error("MongoDB Connection Error", error.message)
    })

const db = mongoose.connection

module.exports = db