const cronJob = require('cron').CronJob
const {GiftRequests} = require('../models/giftRequests-model')
const send = require('./sms')

const db = require('../db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

console.log("running at", new Date())
const job = new cronJob('*/30 * * * * *', async () => {
    var today = new Date()
    today = new Date((today.getMonth()+1) + '/' + 
                     today.getDate() + '/' + 
                     today.getFullYear())
    
    console.log('Checking if there are any messages to send today', today);

    await GiftRequests.find({
        $or: [
            { 
                'clues.time': today,
                'clues.status': false
            },
            { 
                'introductionMessage.status': false,
                'introductionMessage.time': today
            },
            { 
                'finalMessage.status': false,
                'finalMessage.time': today
            }
        ]
    }, (error, giftRequests) => {
        if (error) {
            console.log("error", error)
        }

        if (giftRequests.length == 0) {
            console.log("no requests")
        }

        console.log("giftRequests", giftRequests.length)

        let messagesToSend = [];

        giftRequests.forEach(giftRequest => {

            if (giftRequest.introductionMessage.time.toString() === today.toString() &&
                !giftRequest.introductionMessage.status) {
                giftRequest.introductionMessage.status = true
                giftRequest.status = "Ongoing"
                messagesToSend.push({
                    'body': giftRequest.introductionMessage.content,
                    'contact': giftRequest.receiverContact
                })

                var introBody = "Hello, the introduction message for your gift request was just sent to " + giftRequest.receiverName
                messagesToSend.push({
                    'body': introBody + "~" + giftRequest.introductionMessage.content,
                    'contact': giftRequest.giverContact
                })
            }

            if (giftRequest.finalMessage.time.toString() === today.toString() &&
                !giftRequest.finalMessage.status) {
                giftRequest.finalMessage.status = true
                giftRequest.status = "Completed"

                messagesToSend.push({
                    'body': giftRequest.finalMessage.content,
                    'contact': giftRequest.receiverContact
                })

                var finalBody = "Hello, the final message for your gift request was just sent to " + giftRequest.receiverName
                messagesToSend.push({
                    'body': finalBody + "~" + giftRequest.finalMessage.content,
                    'contact': giftRequest.receiverContact
                })
            }

            var clues = giftRequest.clues

            clues.forEach(clue => {
                var clueBody = "Hello, the clue message for your gift request was just sent to " + giftRequest.receiverName
                if (clue.time.toString() === today.toString() &&
                    !clue.status) {
                    clue.status = true
                    messagesToSend.push({
                        'body': clue.content,
                        'contact': giftRequest.receiverContact
                    })

                    messagesToSend.push({
                        'body': clueBody + "~" + clue.content,
                        'contact': giftRequest.giverContact
                    })
                }
            });

            // Update database
            giftRequest
            .save()
            .then(() => {
                console.log("updated giftRequest", giftRequest)
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