const express = require('express');
const axios = require('axios');
const internal = express();
const internal_port = 3004; // port 3004 is used to receive requests for sending push notifications

// FCM part

var admin = require("firebase-admin");
var serviceAccount = require('./adminsdk_private_key.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://f-luminus.firebaseio.com"
});

function sendMessage(id, title, body) {
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
    admin.messaging().sendToDevice(getToken(id), payload, options)
        .then((response) => {
            console.log(response);
        })
        .catch((e) => {
            console.log(e);
        })
}

// Server part

internal.get('/send', (req, res) => {
    var id = req.query.id;
    var title = req.query.title;
    var body = req.query.body;
    sendMessage(id, title, body);
    res.send('success');
});

internal.listen(internal_port, '127.0.0.1', () => console.log(`Internel server listening on port ${internal_port}!`));