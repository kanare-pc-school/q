<template>
  <div class="relative w-full bg-gray-100">
    <header class="flex content-between w-full">
      <div class="flex items-center justify-start w-full p-4 font-semibold">
        <font-awesome-icon :icon="['fa', 'tape']" />
        <span class="mx-4">つなげる</span>
      </div>
      <div class="flex items-center justify-end w-full p-4 font-semibold">
        <img class="shadow rounded-full h-10 w-10" :src="img">
        <span class="mx-4">{{name}}</span>
      </div>
    </header>
    <div class="question flex items-center justify-start w-full p-4 font-semibold">
      aaaaaaaaaaaa
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { io } from 'socket.io-client'

export default Vue.extend({
  data() {
    return {
      name: '',
      img: '',
      socket: io('http://localhost:8080', {
        transports: ['websocket', 'flashsocket'],
      }),
      msg: '',
    }
  },
  mounted() {
    this.name = 'aaaaa'
    this.img = 'https://avatars.dicebear.com/api/adventurer/' + this.name + '.svg'
    this.socket.on('reciever', (user: string, msg: string,) => {
      console.info(user, msg)
    })
  },
  methods: {
    sendMsg() {
      this.socket.emit('sender', this.msg)
      this.msg = ''
    },
  }
})
</script>

