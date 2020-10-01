const config = require("../../config")
const client = require('twilio')(config.twilio_sid, config.twilio_auth_token);

function send(messageList) {
  console.log("sending messages", messageList)
  messageList.forEach(message => {
    client.messages
    .create({
      body: message.body,
      from: config.twilio_phone_number,
      to: message.contact
   })
   .then(message => console.log("Message sent", message.sid));
  });  
}

module.exports = send