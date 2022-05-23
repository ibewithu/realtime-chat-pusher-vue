const Pusher = require('pusher');
    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    
    const app = express();
    
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());


    //pusher server side
    const pusher = new Pusher({
      appId: '1410373',
      key: 'd0214c65a7403acf0b27',
      secret: '563a586cc4960c9e851c',
      cluster: 'ap2',
      encrypted: true
    });



    app.set('PORT', process.env.PORT || 5000);
    

    //pusher post request
    // app.post('/message/:room', (req, res) => {
    //   const payload = req.body;
    //   pusher.trigger(req.params.room, 'message', payload);
    //   res.send(payload)
    // });
    
    app.post("/pusher/auth/:username", function (req, res) {
      const socketId = req.body.socket_id;
      const channel = req.body.channel_name;
      const presenceData = {
        user_id: socketId + req.params.username,
        user_info: { name: req.params.username},
      };
      const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
      console.log('server auth', authResponse)
      res.send(authResponse);
    });
    


    app.listen(app.get('PORT'), () => 
      console.log('Listening at ' + app.get('PORT')))