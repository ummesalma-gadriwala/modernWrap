const mongoose = require('mongoose')
const {GiftRequests, Message} = require('../models/giftRequests-model')
const send = require('../scheduler/sms')

// Create new gift request
createGiftRequest = (req, res) => {
    console.log("Creating Gift Request", req.body)

    if (Object.keys(req.body).length == 0) {
        return res.status(400).json({
            status: 'Fail',
            message: 'Missing Gift Request Body'
        })
    }

    let introductionMessage = {}
    let finalMessage = {}
    let clues = []

    introductionMessage = new Message(req.body.introductionMessage)
    finalMessage = new Message(req.body.finalMessage)

    req.body.clues.forEach(function(clue){
        clues.push(new Message(clue))
    })

    let giftRequest = new GiftRequests({
        giverName: req.body.giverName,
        giverContact: req.body.giverContact,
        receiverName: req.body.receiverName,
        receiverContact: req.body.receiverContact,
        startDate: introductionMessage.time,
        endDate: finalMessage.time,
        clueFrequency: req.body.clueFrequency,
        clues: clues,
        introductionMessage: introductionMessage,
        finalMessage: finalMessage,
        giftCategory: req.body.giftCategory,
        confirmationNumber: new mongoose.Types.ObjectId()
    })

    console.log("giftRequest", giftRequest)    

    giftRequest
        .save()
        .then(() => {
            // send order confirmation to giver
            var messageList = []
            var body = giftRequest.giverName + ", your gift request for " + giftRequest.receiverName + " is confirmed. Confirmation number: " + giftRequest.confirmationNumber
            messageList.push({
                'body': body,
                'contact': giftRequest.giverContact
            })
            send(messageList)

            return res.status(201).json({
                status: 'Success',
                message: giftRequest.confirmationNumber.toString()
            })
        })
        .catch(error => {
            return res.status(400).json({
                status: 'Fail',
                message: error
            })
        })
}

// Get gift request by confirmation number
getGiftRequest = async (req, res) => {
    console.log("Getting Gift Request", req.query)

    if (req.query.confirmationNumber == 'undefined' || 
        req.query.confirmationNumber == '') {
        console.log("confirmationNumber", req.query.confirmationNumber)
        return res.status(400).json({ status: 'Fail', message: "Missing Confirmation Number" })
    }

    await GiftRequests.findOne({ confirmationNumber: req.query.confirmationNumber }, (error, giftRequest) => {
        if (error) {
            return res.status(400).json({ status: 'Fail', message: error })
        }

        if (!giftRequest) {
            return res.status(404).json({ status: 'Fail', message: 'Gift Request not found' })
        }
        console.log("giftRequest", giftRequest)
        return res.status(200).json({ status: 'Success', message: giftRequest })
    }).catch(err => console.log(err))
}

// Get all gift requests
getGiftRequests = async (req, res) => {
    console.log("Getting Gift Requests")

    await GiftRequests.find({}, (error, giftRequests) => {
        if (error) {
            return res.status(400).json({ status: 'Fail', message: error })
        }

        if (giftRequests.length == 0) {
            return res.status(404).json({ success: false, error: 'No Gift Requests' })
        }

        return res.status(200).json({ status: 'Success', message: giftRequests })
    }).catch(err => console.log(err))
}

// Delete gift request by confirmation number
cancelGiftRequest = async (req, res) => {
    console.log("Cancelling Gift Request")

    await GiftRequests.findOne({ confirmationNumber: req.query.confirmationNumber }, (error, giftRequest) => {
        if (error) {
            return res.status(400).json({ status: 'Fail', message: error })
        }

        if (!giftRequest) {
            return res.status(404).json({ status: 'Fail', message: 'Gift Request not found' })
        }

        giftRequest.status = "Cancelled"
        giftRequest.introductionMessage.status = true
        giftRequest.finalMessage.status = true
        var i;
        for (i=0; i < giftRequest.clues.length; i++) {
            giftRequest.clues[i].status = true
        }

        giftRequest
        .save()
        .then(() => {
            // send order confirmation to giver
            var messageList = []
            var body = giftRequest.giverName + ", your gift request for " + giftRequest.receiverName + " is cancelled. Confirmation number: " + giftRequest.confirmationNumber
            messageList.push({
                'body': body,
                'contact': giftRequest.giverContact
            })
            send(messageList)

            return res.status(200).json({
                status: 'Success',
                message: 'Cancelled ' + giftRequest.confirmationNumber.toString()
            })
        })
        .catch(error => {
            return res.status(400).json({
                status: 'Fail',
                message: error
            })
        })
    }).catch(err => console.log(err))
}

// Not MVP
// Update gift request by confirmation number
updateGiftRequest = async (req, res) => {
    console.log("Updating Gift Request", req.query)

    if (Object.keys(req.body).length == 0) {
        return res.status(400).json({
            status: 'Fail',
            message: 'Missing Gift Request Body'
        })
    }

    await GiftRequests.findOne({ confirmationNumber: req.query.confirmationNumber }, (error, giftRequest) => {
        if (error) {
            return res.status(400).json({ status: 'Fail', message: error })
        }

        if (!giftRequest) {
            return res.status(404).json({ status: 'Fail', message: 'Gift Request not found' })
        }

        let clues = giftRequest.clues

        var i;
        for (i=0; i < req.body.clues.length; i++) {
            clues[i].message = req.body.clues.message
            clues[i].time = req.body.clues.time
        }

        giftRequest.giverName = req.body.giverName
        giftRequest.giverContact = req.body.giverContact
        giftRequest.receiverName = req.body.receiverName
        giftRequest.receiverContact = req.body.receiverContact
        giftRequest.startDate = req.body.introductionMessage.time
        giftRequest.endDate = req.body.finalMessage.time
        giftRequest.clueFrequency = req.body.clueFrequency
        giftRequest.clues = clues
        giftRequest.introductionMessage = new Message(req.body.introductionMessage)
        giftRequest.finalMessage = new Message(req.body.finalMessage)
        giftRequest.giftCategory = req.body.giftCategory
        

        console.log("giftRequest updated", giftRequest)

        giftRequest
        .save()
        .then(() => {
            // send order confirmation to giver
            var messageList = []
            var body = giftRequest.giverName + ", your gift request for " + giftRequest.receiverName + " is updated. Confirmation number: " + giftRequest.confirmationNumber
            messageList.push({
                'body': body,
                'contact': giftRequest.giverContact
            })
            send(messageList)

            return res.status(200).json({
                status: 'Success',
                message: 'Updated ' + giftRequest.confirmationNumber.toString()
            })
        })
        .catch(error => {
            return res.status(400).json({
                status: 'Fail',
                message: error
            })
        })
    }).catch(err => console.log(err))
}


module.exports = {
    createGiftRequest,
    getGiftRequest,
    getGiftRequests,
    cancelGiftRequest,
    updateGiftRequest
}