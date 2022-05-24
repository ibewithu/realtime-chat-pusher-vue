# chat-vue-pusher

## Project setup
```
yarn install
```

### Start the server
```
nodemon server
```

### Compiles and hot-reloads for development
```
yarn serve
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# Guide for using presence-channels in pusher js

#### Login to pusher official website
#### create a new app through channel tab
#### get your details:
#### go to app keys tab and you will have some data like:
```
app_id = "YOUR_APP_ID"
key = "YOUR_APP_KEY"
secret = "YOUR_APP_SECRET"
cluster = "YOUR_APP_CLUSTER"
```

#### For using presence channels or private channels on pusher we have to define authentication endpoints while any user tries to access a particular channel because pusher wants to distinguish between users in private and pusher channels.
#### Also to use both side trigger events i.e, to use the client-events instead of api calls in user/client side in pusher we have to use either private or presence channels.


### Authentication process:
#### Client-side:
##### when a user tries joins a particular channel:
````
const pusher = new Pusher("d0214c65a7403acf0b27", {
        cluster: "ap2",
        authEndpoint: `http://localhost:5000/pusher/auth/${this.username}`    //create an endpoint for auth 
        })
        
 this.channel = pusher.subscribe(`presence-${this.room}`);
````

#### Server-side
##### Create a post request endpoint in node js:
````
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
````

#### Now the auth part is over and if we are using a presence channel then we have access to some pre defined binding functions:
##### pusher:subscription_succeeded
###### This method will actually be called on only the user who is now logging in to the channel
###### It will have access to a members parameter in which it has some info about the channel
````
channel.bind("pusher:subscription_succeeded", (members) => {
  // For example
  update_member_count(members.count);

  members.each((member) => {
    // For example
    add_member(member.id, member.info);
  });
});
````

##### pusher:member_added
###### This method will actually be called on all the other users who are currently logged in to the channel
###### It will have access to a members parameter in which it has some info about the user who is now logged in to the channel
````
channel.bind("pusher:member_added", (member) => {
  // For example
  add_member(member.id, member.info);
});
````

##### pusher:member_removed
###### This method will actually be called on all the other users who are currently logged in to the channel
###### It will have access to a members parameter in which it has some info about the user who is now logged out of the channel
````
channel.bind("pusher:member_removed", (member) => {
  // For example
  remove_member(member.id, member.info);
});
````

##### unsubscribing from the channel:
````
this.channel.unsubscribe(`presence-${this.room}`);
````

### Now coming to the client events
#### While using either private or presence channel we can trigger the events from the user side
#### Client events has to be prefixed with client-
#### example: i want to trigger a message event on submit then
````
handleSubmit(e) {
      e.preventDefault();
      const payload = {
        username: this.username,
        message: this.message,
      };
      var wasTriggered = this.channel.trigger("client-message", payload);
      this.chats = [...this.chats, payload];
      this.message = "";
    }
````

#### to receive this event on other channel members we have to bind this event
````
this.channel.bind("client-message", (msg) => {
        const newObj = JSON.parse(JSON.stringify(msg));
        this.chats = [...this.chats, newObj];
      })
````

### If you have any other problems you can refer pusher official documents : https://pusher.com/docs/channels/

