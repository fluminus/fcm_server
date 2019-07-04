const express = require('express');
const body_parser = require('body-parser');
const internal = express();
const internal_port = 3004; // port 3004 is used to receive requests for sending push notifications

internal.use(body_parser.json())

// FCM part

var admin = require("firebase-admin");
var serviceAccount = require('./adminsdk_private_key.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://f-luminus.firebaseio.com"
});

function sendMessage(token, title, body) {
    var payload = {
        notification: {
            title: title,
            body: body
        }
    }
    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    }
    admin.messaging().sendToDevice(token, payload, options)
        .then((response) => {
            console.log(response);
        })
        .catch((e) => {
            console.log(e);
        })
}

// Server part

internal.listen(internal_port, '127.0.0.1', () => console.log(`Internel server listening on port ${internal_port}!`));

internal.post('/send_pn', (req, res) => {
    // console.log(req.body)
    sendMessage(req.body.fcm_token, req.body.type, req.body.notifyMessage);
    res.send('success');
});