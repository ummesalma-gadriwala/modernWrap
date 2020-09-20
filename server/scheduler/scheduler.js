const cronJob = require('cron').CronJob
const {GiftRequests} = require('../models/giftRequests-model')
const send = require('./sms')

const db = require('../db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const job = new cronJob('0 13 * * *', async () => {
    var today = new Date()
    today = new Date((today.getMonth()+1) + '/' + 
                     today.getDate() + '/' + 
                     today.getFullYear())
    
    console.log("running everyday at 1 pm")
    console.log('Checking if there are any messages to send today');

    await GiftRequests.find({
        'clues.time': today
    }, (error, giftRequests) => {
        if (error) {
            console.log("error", error)
        }

        if (giftRequests.length == 0) {
            console.log("no requests")
        }

        console.log("giftRequests", giftRequests, giftRequests.length)

        let messagesToSend = [];

        giftRequests.forEach(giftRequest => {
            var clues = giftRequest.clues

            clues.forEach(clue => {
                
                if (clue.time.toString() === today.toString()) {
                    clue.status = true
                    var body = giftRequest.receiverName + ', ' + clue.message + '\n From ' + giftRequest.giverName
                    messagesToSend.push({
                        'body': body,
                        'contact': giftRequest.receiverContact
                    })
                }
            });

            // Update database
            giftRequest
            .save()
            .then(() => {
                console.log("updated giftRequest", giftRequest._id)
            })
            .catch(error => {
                console.log("update failed", error)
            })
        });

        console.log("messagesToSend", messagesToSend)

        // Send messages
        send(messagesToSend)
    }).catch(err => console.log(err))
});

job.start();