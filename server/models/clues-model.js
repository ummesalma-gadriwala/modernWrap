const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Clue = new Schema(
    {
        sequence: { type: Number, required: true },
        message: { type: String, required: true }
    }
)

const ClueList = new Schema(
    {
        clues: { type: [Clue], required: true },
        category: { type: String, required: true }
    }
)

module.exports = {
    Clue: mongoose.model('Clue', Clue),
    ClueList: mongoose.model('ClueList', ClueList)
}