<template>
  <div class="row">
    <img class="image" src="../assets/bg.jpg" />
    <div class="chat-box">
      <h3>Hello, {{ username }}</h3>
      <h2>Welcome to {{ room }} <br> Users online: {{ onlineUsersCount }}</h2>
      <ul class="chats">
        <li class="col" v-for="item in chats" :key="item">
          <div class="name">
            <strong>From : {{ item.username }}</strong>
          </div>
          <div class="message">Message : {{ item.message }}</div>
        </li>
      </ul>
      <input type="text" v-model.lazy="message" placeholder="chat here...." />
      <button class="button-submit" @click="handleSubmit">Send</button>
    </div>
  </div>
</template>

<script>
import Pusher from "pusher-js";
// import axios from "axios";

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
      const pusher = new Pusher("d0214c65a7403acf0b27", {
        cluster: "ap2",
        authEndpoint: `http://localhost:5000/pusher/auth/${this.username}`,
        params: { username: this.username },
      });
      // const pusher = new Pusher("d0214c65a7403acf0b27", {
      //   cluster: 'ap2',
      //   authEndpoint: "http://localhost:5000/pusher/auth",
      //   userAuthentication: {
      //     endpoint: "http:/localhost:5000/pusher/auth",
      //     params: { username: this.username }
      //   }
      // });

      // new Pusher("d0214c65a7403acf0b27", cluster: 'ap2', { userAuthentication: { endpoint: "/pusher_user_auth.php", props: {username: this.username}}})

      // const channel = pusher.subscribe(this.room);
      this.channel = pusher.subscribe(`presence-${this.room}`);

      this.channel.bind("client-message", (msg) => {
        const newObj = JSON.parse(JSON.stringify(msg));
        this.chats = [...this.chats, newObj];
      });

      // pusher.bind("new-message", (data) => {
      //   console.log(data);
      //   this.chat.push({ text: data.text, sender: data.sender });
      // })

      this.channel.bind("pusher:subscription_succeeded", (members) => {
        console.log('I logged in. users: ', members.count);
        this.onlineUsersCount = members.count;
        this.onlineUsers = members.members
      });

      this.channel.bind("pusher:member_added", (member) => {
        this.onlineUsersCount = Object.keys(this.onlineUsers).length
        console.log(member.info.name + ' logged in. users: ', Object.keys(this.onlineUsers).length)
        // console.log(member)
        // this.onlineUsersCount = this.onlineUsers.length
      });
      this.channel.bind("pusher:member_removed", (member) => {
        this.onlineUsersCount = Object.keys(this.onlineUsers).length
        console.log(member.info.name + ' logged out. users: ', Object.keys(this.onlineUsers).length)
        // console.log(member)
        // this.onlineUsersCount = this.onlineUsers.length
      });
    },
    unsubscribe() {
      this.channel.unsubscribe(`presence-${this.room}`);
    },
    handleSubmit(e) {
      e.preventDefault();
      const payload = {
        username: this.username,
        message: this.message,
      };
      // axios.post(`http://localhost:5000/message/${this.room}`, payload);
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
  width: 40vw;
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
