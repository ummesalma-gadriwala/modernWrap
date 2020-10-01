const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = new Schema(
    {
        content: { type: String, required: true },
        // true = sent, false = pending
        status: { type: Boolean, required: true, default: false },
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
        clues: { type: [Message], required: true },
        introductionMessage: { type: Message, required: true },
        finalMessage: { type: Message, required: true },
        giftCategory: { type: String, required: true, default: 'BuildYourOwn' },
        // Cancelled, Completed <- Ongoing <- Unstarted
        status: { type: String, required: true, default: "Unstarted" },
        confirmationNumber: { type: mongoose.ObjectId, required: true }
    },
    { timestamps: true },
)

module.exports = {
    GiftRequests: mongoose.model('GiftRequests', GiftRequests),
    Message: mongoose.model('Message', Message)
}