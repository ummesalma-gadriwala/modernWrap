const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Clues = new Schema(
    {
        message: { type: String, required: true },
        status: { type: Boolean, required: true },
        time: { type: Date, required: true },
    }
)
// category
const GiftRequests = new Schema(
    {
        giverName: { type: String, required: true },
        // phone number
        giverContact: { type: String, required: true },
        receiverName: { type: String, required: true },
        receiverContact: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        clueFrequency: { type: Number, required: true, default: 3 },
        clues: { type: [Clues], required: true },
        introductionMessage: { type: String, required: true },
        finalMessage: { type: String, required: true },
        giftCategory: { type: String, required: true, default: 'BuildYourOwn' },
        status: { type: Boolean, required: true },
        confirmationNumber: { type: mongoose.ObjectId, required: true }
    },
    { timestamps: true },
)

module.exports = {
    GiftRequests: mongoose.model('GiftRequests', GiftRequests),
    Clues: mongoose.model('Clues', Clues)
}