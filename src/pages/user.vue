<template>
  <transition name="scale">
    <component :is="currentComponent" :props-name="name" :props-img="img"></component>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { io } from 'socket.io-client'

import connectWords from '../components/ConnectWords.vue'
import lineUp from '../components/LineUp.vue'
import choiceAnswer from '../components/ChoiceAnswer.vue'
import youtubeLive from '../components/YoutubeLive.vue'

export default Vue.extend({
  name: 'UserPage',
  components: {
    connectWords,
    lineUp,
    choiceAnswer,
    youtubeLive,
  },
  data() {
    return {
      currentComponent: 'connectWords',
      socket: io(this.$config?.apiURL, {
        transports: ['websocket'],
        'reconnection': true,
        'reconnectionAttempts': 2
      }),
      name: '',
      img: '',
    }
  },
  mounted() {
    this.name = (this.$route.query.name) as string
    this.img = this.$config.avatarURL + this.name + '.svg'
    if (this.name !== 'sc') this.currentComponent = 'youtubeLive'
    this.socket.on('mode', (mode: string) => {
      if (this.name === 'sc') this.currentComponent = mode
    })
    this.socket.on('logout', () => {
      this.socket.disconnect()
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
