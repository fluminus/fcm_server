var admin = require("firebase-admin");

var serviceAccount = require('./adminsdk_private_key.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://f-luminus.firebaseio.com"
});

var token = "caqQvleh0uY:APA91bHv-tDE5DTo_uZf27ZvNoFTZzMtuhmMXo_l0b-uNBdjWiDns_e4F23JH4JaHqhvtx3E1BXoHxJIco6BfhEm-zrIb5p9tc4jswOJ6n30jx_xI_wwv4E6y9MT54bgXJiitfFG8_e9";

var payload = {
    notification: {
        title: "Hello",
        body: "World"
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