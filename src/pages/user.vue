<template>
  <transition name="scale">
    <component :is="currentComponent"></component>
  </transition>
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
      currentComponent: 'ConnectWords',
      socket: io(this.$config?.apiURL, {
        transports: ['websocket'],
        'reconnection': true,
        'reconnectionAttempts': 2
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
    this.socket.io.on('reconnect_failed', () => {
        console.log('reconnect_failed')
    })
  },
})
</script>

<style scoped>
.scale-enter-active {
  animation: bounce-in 1s;
}

.scale-leave-active {
  animation: bounce-out .5s;
}

@keyframes bounce-in {
  0% { transform: scale(0) }
  100% { transform: scale(1) }
}

@keyframes bounce-out {
  0% { transform: scale(1) }
  100% { transform: scale(0) }
}
</style>
