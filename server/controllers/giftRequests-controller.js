const mongoose = require('mongoose')
const {GiftRequests, Clues} = require('../models/giftRequests-model')

// Create new gift request
createGiftRequest = (req, res) => {
    console.log("Creating Gift Request", req.body)

    if (Object.keys(req.body).length == 0) {
        return res.status(400).json({
            status: 'Fail',
            message: 'Missing Gift Request Body'
        })
    }

    let clues = []

    req.body.clues.forEach(function(clue){
        clues.push(new Clues({
            message: clue.message,
            status: false,
            time: clue.time
            })
        )
    })

    let giftRequest = new GiftRequests({
        giverName: req.body.giverName,
        giverContact: req.body.giverContact,
        receiverName: req.body.receiverName,
        receiverContact: req.body.receiverContact,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        clueFrequency: req.body.clueFrequency,
        clues: clues,
        introductionMessage: req.body.introductionMessage,
        finalMessage: req.body.finalMessage,
        giftCategory: req.body.giverCategory,
        status: req.body.status,
        confirmationNumber: new mongoose.Types.ObjectId()
    })

    console.log("giftRequest", giftRequest)    

    giftRequest
        .save()
        .then(() => {
            return res.status(201).json({
                status: 'Success',
                message: giftRequest.confirmationNumber.toString()
            })
        })
        .catch(error => {
            return res.status(400).json({
                status: 'Fail',
                message: "Gift Request Failed",
                error
            })
        })
}

// Get gift request by confirmation number
getGiftRequest = async (req, res) => {
    console.log("Getting Gift Request", req.query)

    await GiftRequests.findOne({ confirmationNumber: req.query.confirmationNumber }, (error, giftRequest) => {
        if (error) {
            return res.status(400).json({ status: 'Fail', message: error })
        }

        if (!giftRequest) {
            return res.status(404).json({ status: 'Fail', message: 'Gift Request not found' })
        }

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
deleteGiftRequest = async (req, res) => {
    console.log("Deleting Gift Request", req.query)

    await GiftRequests.findOneAndDelete({ confirmationNumber: req.query.confirmationNumber }, (error, giftRequest) => {
        if (error) {
            return res.status(400).json({ status: 'Fail', message: error })
        }

        if (!giftRequest) {
            return res.status(404).json({ status: 'Fail', message: 'Gift Request not found' })
        }


        return res.status(200).json({ status: 'Success', message: giftRequest })
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
        giftRequest.startDate = req.body.startDate
        giftRequest.endDate = req.body.endDate
        giftRequest.clueFrequency = req.body.clueFrequency
        giftRequest.clues = clues
        giftRequest.introductionMessage = req.body.introductionMessage
        giftRequest.giftCategory = req.body.giverCategory
        giftRequest.finalMessage = req.body.finalMessage

        console.log("giftRequest updated", giftRequest)

        giftRequest
        .save()
        .then(() => {
            return res.status(200).json({
                status: 'Success',
                message: 'Updated ' + giftRequest.confirmationNumber.toString()
            })
        })
        .catch(error => {
            return res.status(400).json({
                status: 'Fail',
                message: "Gift Request Failed",
                error
            })
        })
    }).catch(err => console.log(err))
}


module.exports = {
    createGiftRequest,
    getGiftRequest,
    getGiftRequests,
    deleteGiftRequest,
    updateGiftRequest
}