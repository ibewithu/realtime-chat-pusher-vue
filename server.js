//required packages
require('dotenv').config()
const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//server app
const app = express();

//required settings
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//pusher server side
//pusher object
// console.log(process.env)
const pusher = new Pusher({
  appId: process.env.VUE_APP_APP_ID,
  key: process.env.VUE_APP_KEY,
  secret: process.env.VUE_APP_SECRET,
  cluster: process.env.VUE_APP_CLUSTER,
  encrypted: true
});


app.set('PORT', process.env.PORT || 5000);


app.post("/pusher/auth/:username", function (req, res) {  //same endpoint as declared in auth endpoint on client side
  const socketId = req.body.socket_id     //provided automatically by system
  const channel = req.body.channel_name   //provided automatically bypusher
  const presenceData = {
    user_id: socketId + req.params.username,   //You can have any unique id on your own
    user_info: { name: req.params.username},
  }
  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);  //presence data is required for presence channel 
  console.log('server auth', authResponse)                                        //in private channel we can exclude presence data
  res.send(authResponse);
})



app.listen(app.get('PORT'), () => console.log('Listening at ' + app.get('PORT')))