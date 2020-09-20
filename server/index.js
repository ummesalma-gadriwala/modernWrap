const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const config = require("../config")
const db = require('./db')
const router = require('./routes/router')
const app = express()

const apiPort = config.port

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('ModernWrap Live')
})

app.use('/modernWrap', router)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
