const express = require('express')
const GiftRequestController = require('../controllers/giftRequests-controller')
const CluesController = require('../controllers/clues-controller')
const router = express.Router()

// Gift Request
router.post('/createGiftRequest', GiftRequestController.createGiftRequest)
router.get('/getGiftRequest', GiftRequestController.getGiftRequest)
router.get('/getGiftRequests', GiftRequestController.getGiftRequests)
router.get('/cancelGiftRequest', GiftRequestController.cancelGiftRequest)
// router.put('/updateGiftRequest', GiftRequestController.updateGiftRequest)

// Clue
router.post('/createClue', CluesController.createClue)
router.get('/getClue', CluesController.getClue)
router.get('/getClues', CluesController.getClues)
router.get('/deleteClue', CluesController.deleteClue)
router.put('/updateClue', CluesController.updateClue)

module.exports = router