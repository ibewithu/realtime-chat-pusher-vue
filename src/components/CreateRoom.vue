<template>
    <div class="container">
        <label for="room-id">Room Id</label><br>
        <input type="text" name="room-id" v-model="roomId" placeholder="Enter your room id ">
        <button class="create-new"><router-link :to="`/chat-box/${roomId}`"> {{type}} </router-link></button>
    </div>
</template>

<script>
export default {
    name: 'CreateRoom',
    data () {
        return {
            roomId: ''
        }
    },
    props : {
        type: String
    }
}
</script>

<style scoped>
.container {
    margin: 10%;
    padding: 5%;
    border: 2px solid lightgreen;
    display: flex;
    flex-direction: column;
    text-align: start;
}
input {
    padding: 2%;
}
.create-new {
    margin-top: 2%;
    padding: 2%;
    background-color: lightgreen;
    border: none;
    border-radius: 2%;
    cursor: pointer;
    max-width: 80px;
}
.create-new a {
  text-decoration: none;
  color: black;
}
</style>