const express = require('express');
const axios = require('axios');
const external = express();
const internal = express();
const external_port = 3003; // port 3003 is used to receive registration and log-out requests
const internal_port = 3004; // port 3004 is used to receive requests for sending push notifications from Dart server

// DB part

var db = {};

function addUser(id, fcm_token) {
    db[id] = fcm_token;
}

function removeUser(id) {
    db[id] = undefined;
}

function getToken(id) {
    return db[id];
}

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

external.get('/api/notification/activate', (req, res) => {
    var id = req.query.id;
    var token = req.query.fcm_token;
    console.log('[activate] ' + 'id: ' + id + ', fcm_token: ' + token);
    addUser(id, token);
    axios.get('http://127.0.0.1:4004/activate', {
        params: {
            id: id
        }
    }).then((resp) => console.log('success'))
        .catch((e) => console.log(e));
});

external.listen(external_port, () => console.log(`Externel server listening on port ${external_port}!`));

internal.get('/send', (req, res) => {
    var id = req.query.id;
    var title = req.query.title;
    var body = req.query.body;
    sendMessage(id, title, body);
    res.send('success');
});

internal.listen(internal_port, '127.0.0.1', () => console.log(`Internel server listening on port ${internal_port}!`));