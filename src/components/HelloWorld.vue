<template>
  <div>
    <h3>Hi, {{username}}</h3><br>
    <h3>Welcome to our chat application</h3>

    <div class="row">
      <img class="image" src="../assets/logo.png" />

      <div class="col">

        <div class="room-box col">
          <div>
            <div>Available chat rooms: </div>
            <div class="room" v-for="room in publicRooms" :key="room"><router-link :to="`/chat-box/${room}`">{{room}} </router-link></div>
            <!-- <div class="room"><router-link to="/chat-box/Room1">Room1</router-link></div>
            <div class="room"><router-link to="/chat-box/Room2">Room2</router-link></div>
            <div class="room"><router-link :to="`/chat-box/${room}`">{{room}} </router-link></div> -->
          </div>
          <div class="create-tab">
            <h2 class="question">Not interested in above rooms?</h2>
            <button class="create-button"><router-link to="/create-room/create"> Create One </router-link></button>
            <button class="create-button"><router-link to="/create-room/join"> Join your friend's room </router-link></button>
          </div>

        </div>


      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
      publicRooms: ['room-1', 'room-2', 'room-3', 'room-4', 'room-5', 'room-6', 'room-7']
    }
  },
  props : {
    username: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 0;
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
  height: 40vh;
  width: 20vw;
  margin-top: 10%;
}
/* .image img {
  height: 60vh;
  width: 30vw;
} */
.room-box {
  display: flex;
  flex-direction: column;
  width: 40vw;
  height: 80vh;
  margin: 2%;
  border: 2px solid black;
  justify-content: space-around;
}
.room {
  margin: 2%;
  border: 2px solid lightgrey;
  list-style: none;
}
.room a{
  text-decoration: none;
}
.question {
  color: crimson;
}
.create-button {
  margin: 2%;
  padding: 2%;
  cursor: pointer;
  background-color: lightgreen;
  border: none;
  border-radius: 5%;
  color: black !important;
}
.create-button a{
  text-decoration: none;
  color: black;
  }
</style>
