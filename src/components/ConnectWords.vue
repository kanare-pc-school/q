<template>
  <div class="relative">
    <header class="sticky top-0 flex content-between w-full bg-gray-100">
      <div class="flex items-center justify-start w-full p-4 font-semibold">
        <font-awesome-icon :icon="['fa', 'tape']" />
        <span class="mx-4">つなげる</span>
      </div>
      <div class="flex items-center justify-end w-full p-4 font-semibold">
        <img class="cursor-pointer shadow rounded-full h-10 w-10" :src="img" @click="logout">
        <span class="cursor-pointer mx-4" @click="logout">{{name}}</span>
      </div>
    </header>
    <main class="sticky overflow-y-auto">
      <div class="border rounded-lg m-4 p-4 min-h-[7.5rem]">
        <transition name="fadein">
          <div v-show="question" class="font-semibold" v-html="question"></div>
        </transition>
      </div>
      <transition-group name="message" tag="div" class="flex flex-wrap items-center mx-8 my-4">
        <div v-for="message in messages" :key="message.id" class="relative mt-8 mx-4 p-6">
          <span class="text-lg font-semibold">
            <span v-if="visiblity">{{ message.text }}</span>
            <span v-else>{{ hide(message.text) }}</span>
            <span class="tooltip" :style="message.color">{{ message.user }}</span>
          </span>
        </div>
      </transition-group>
    </main>
    <footer class="fixed bottom-0 flex content-between w-full bg-gray-100">
      <div class="flex items-center justify-start w-full p-4 font-semibold">
        <span class="mx-2">{{comments}}</span>
      </div>
      <div class="flex items-center justify-end w-full p-4 font-semibold">
        <input v-model="text" class="appearance-none w-full rounded-lg border-none text-gray-700 mr-3 p-4 leading-tight focus:outline-none" type="text" placeholder="メッセージ" @keydown.enter="submit" ref="text">
        <button class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 border-4 text-white px-6 py-2 rounded-lg" type="button" @click="submit">
          送信
        </button>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { io } from 'socket.io-client'

interface IMessage {
  id: number,
  user: string,
  text: string,
  color: string,
}

export default Vue.extend({
  data(): {
      name: string,
      img: string,
      socket: any,
      question: string,
      text: string,
      comments: string,
      messages: IMessage[],
      visiblity: boolean,
  } {
    return {
      name: '',
      img: '',
      socket: io(this.$config?.apiURL, {
        transports: ['websocket', 'flashsocket'],
      }),
      question: '',
      text: '',
      comments: '',
      messages: [],
      visiblity: true,
    }
  },
  mounted() {
    this.name = (this.$route.query.name) as string
    this.img = this.$config.avatarURL + this.name + '.svg'
    this.socket.on('message', (name: string, text: string) => {
      this.show(name, text)
    })
    this.socket.on('question', (question: string) => {
      this.question = question.replace(/\n/g,'<br/>')
    })
    this.socket.on('trash', () => {
      this.question = ''
      this.messages = []
    })
    this.socket.on('visible', (visiblity: boolean) => {
      this.visiblity = visiblity
    })
    const m = this.$refs.text as HTMLInputElement
    m.focus()
  },
  methods: {
    submit() {
      this.socket.emit('message', this.name, this.text)
      this.text = ''
    },
    show(name: string, text: string) {
      if (text === '') return
      const message: IMessage = {
        id: this.messages.length + 1,
        user: name,
        text,
        color: 'background-color: ' + this.getColor(name)
      }
      this.messages.push(message)
      const main = this.$el.querySelector('main')
      if (main) main.scrollTop = main.scrollHeight
    },
    getColor(user: string) {
      const n = Array.from(user).map(ch => ch.charCodeAt(0)).reduce((a, b) => a + b)
      const colorAngle = (n * n) % 360
      return `hsl(${colorAngle}, 80%, 64%)`
    },
    hide(text: string): string {
      let kome = ''
      for(let i = 0; i < text.length; i++) {
        kome += '*'
      }
      return kome
    },
    logout() {
      this.$router.push('/')
    }
  }
})
</script>

<style scoped>
header,
footer {
  height: 10vh;
}

main {
  height: 80vh;
}

.tooltip {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem 0.75rem;
  white-space: nowrap;
  font-size: .85rem;
  line-height: 1.3;
  transition: 0.3s ease-in;
}
</style>

