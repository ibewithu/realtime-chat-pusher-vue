<template>
  <div class="row">
    <div class="chat-box">
      <div class="info">
        <h3>Hello, {{ username }}</h3>
        <h2>
          Welcome to {{ room }} <br />
          Users online: {{ onlineUsersCount }}
        </h2>
      </div>

      <div class="chatWrapper">
        <div class="messageContainer" v-for="item in chats" :key="item">
          <small :class="item.username === username ? 'sender' : 'receiver'">
            {{ item.username }}
          </small>
          <div :class="item.username === username ? 'sent' : 'received'">
            {{ item.message }}
          </div>
        </div>
      </div>

      <div>
        <input type="text" v-model.lazy="message" placeholder="chat here...." />
        <button class="button-submit" @click="handleSubmit">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import Pusher from "pusher-js";
export default {
  name: "ChatBox",
  data() {
    return {
      message: "",
      chats: [],
      channel: null,
      onlineUsersCount: 0,
      onlineUsers: [],
    };
  },
  props: {
    username: String,
    room: String,
  },
  methods: {
    subscribe() {
      const pusher = new Pusher(process.env.VUE_APP_KEY, {
        cluster: process.env.VUE_APP_CLUSTER,
        authEndpoint: `http://localhost:5000/pusher/auth/${this.username}`
      })
      this.channel = pusher.subscribe(`presence-${this.room}`)

      //binding to client event
      this.channel.bind("client-message", (msg) => {
        const newObj = JSON.parse(JSON.stringify(msg));
        this.chats = [...this.chats, newObj];
      })

      //binding to predefined presence channel events
      this.channel.bind("pusher:subscription_succeeded", (members) => {
        console.log("I logged in. users: ", members.count);
        this.onlineUsersCount = members.count;
        this.onlineUsers = members.members;
      })
      
      //binding to predefined presence channel events
      this.channel.bind("pusher:member_added", (member) => {
        this.onlineUsersCount = Object.keys(this.onlineUsers).length;
        console.log(
          member.info.name + " logged in. users: ",
          Object.keys(this.onlineUsers).length
        )
      })
      
      //binding to predefined presence channel events
      this.channel.bind("pusher:member_removed", (member) => {
        this.onlineUsersCount = Object.keys(this.onlineUsers).length;
        console.log(
          member.info.name + " logged out. users: ",
          Object.keys(this.onlineUsers).length
        )
      })
    },
    unsubscribe() {
      this.channel.unsubscribe(`presence-${this.room}`);
    },
    handleSubmit(e) {
      e.preventDefault();
      const payload = {
        username: this.username,
        message: this.message,
      }

      //triggering from client side
      var wasTriggered = this.channel.trigger("client-message", payload);
      console.log(wasTriggered);
      this.chats = [...this.chats, payload];
      this.message = "";
    },
  },
  created() {
    this.subscribe();
  },
  beforeUnmount() {
    this.unsubscribe();
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.messageContainer {
  widows: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
}
.info {
  border-bottom: 1px solid gray;
}
.chatWrapper {
  height: 63vh;
  overflow: scroll;
}
.sent {
  align-self: flex-end;
  padding: 10px;
  color: white;
  margin: 10px;
  background-color: rgb(128, 222, 243);
}
.sender {
  align-self: flex-end;
  margin: 0px 10px;
}
.receiver {
  align-self: flex-start;
  margin: 0px 10px;
}
.received {
  align-self: flex-start;
  padding: 10px;
  color: white;
  margin: 10px;
  background-color: rgb(157, 157, 157);
}
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.image {
  margin: 2%;
  height: 80vh;
  width: 40vw;
}
.chat-box {
  width: 80vw;
  height: 80vh;
  margin: 2%;
  border: 2px solid black;
}
input {
  padding: 2px;
  margin: 1px;
}
.button-submit {
  padding: 4px;
}
.chats {
  height: 80%;
  border: 2px solid grey;
  box-shadow: #42b983;
  margin: 1%;
}
.col {
  display: flex;
  flex-direction: column;
  margin: 1%;
  border: 2px solid red;
  box-shadow: lightgrey;
}
</style>