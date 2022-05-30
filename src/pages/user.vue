<template>
  <component :is="currentComponent"></component>
</template>

<script lang="ts">
import Vue from 'vue'
import { io } from 'socket.io-client'

import connectWords from '../components/ConnectWords.vue'
import lineUp from '../components/LineUp.vue'
import choiceAnswer from '../components/choiceAnswer.vue'

export default Vue.extend({
  name: 'UserPage',
  components: {
    connectWords,
    lineUp,
    choiceAnswer,
  },
  data() {
    return {
      currentComponent: 'connectWords',
      socket: io(this.$config?.apiURL, {
        transports: ['websocket', 'flashsocket'],
      }),
    }
  },
  mounted() {
    this.socket.on('mode', (mode: string) => {
      this.currentComponent = mode
    })
    this.socket.on('logout', () => {
      this.$router.push('/')
    })
  },
})
</script>
