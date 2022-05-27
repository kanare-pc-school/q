<template>
  <div class="relative">
    <header class="sticky top-0 flex content-between w-full bg-gray-100">
      <div class="flex items-center justify-start w-full p-4 font-semibold">
        <font-awesome-icon :icon="['fa', 'chalkboard-user']" />
        <span class="mx-4">管理者</span>
      </div>
      <div class="flex items-center justify-end w-full p-4 font-semibold">
        <div :class="{active: mode === 'connectWord'}" class="flex items-center justify-center shadow rounded-full h-10 w-10 mr-4" @click="chgMode('connectWord')">
          <font-awesome-icon :icon="['fa', 'tape']" />
        </div>
        <div :class="{active: mode === 'lineUp'}" class="flex items-center justify-center shadow rounded-full h-10 w-10 mr-4" @click="chgMode('lineUp')">
          <font-awesome-icon :icon="['fa', 'bars-staggered']" />
        </div>
        <div :class="{active: mode === 'choices'}" class="flex items-center justify-center shadow rounded-full h-10 w-10 mr-4" @click="chgMode('choices')">
          <font-awesome-icon :icon="['fa', 'square-check']" />
        </div>
        <div class="flex items-center justify-center shadow rounded-full h-10 w-10 mr-4" @click="visible">
          <font-awesome-icon v-if="visiblity" :icon="['fa', 'eye']" />
          <font-awesome-icon v-else :icon="['fa', 'eye-slash']" />
        </div>
        <div class="flex items-center justify-center shadow rounded-full h-10 w-10" @click="trash">
          <font-awesome-icon :icon="['fa', 'trash']" />
        </div>
      </div>
    </header>
    <main class="sticky overflow-y-auto">
      <div class="question border rounded-lg m-4 p-4 font-semibold" v-html="question"></div>
      <div class="flex flex-wrap items-center mx-8 my-4">
        <div v-if="messages.length === 0"></div>
        <div v-else v-for="message in messages" :key="message.id" class="relative mt-8 mx-4 p-6">
          <span class="text-lg font-semibold">
            <span :class="{trans: !visiblity}">{{ message.text }}</span>
            <span class="tooltip" :style="message.color">{{ message.user }}</span>
          </span>
        </div>
      </div>
    </main>
    <footer class="fixed bottom-0 flex items-center justify-center p-4 font-semibold w-full bg-gray-100">
      <textarea v-model="text" class="appearance-none h-full w-full rounded-lg border-none text-gray-700 mr-3 p-4 leading-tight focus:outline-none" placeholder="もんだい" ref="text" @keydown.enter.shift="submit"></textarea>
      <button class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 border-4 text-white px-6 py-2 rounded-lg" type="button" @click="submit">
        送信
      </button>
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
      mode: string,
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
      mode: 'connectWord'
    }
  },
  mounted() {
    this.name = (this.$route.query.name) as string
    this.img = this.$config.avatarURL + this.name + '.svg'
    this.socket.on('message', (user: string, text: string) => {
      this.show(user, text)
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
      this.socket.emit('question', this.text)
    },
    show(user: string, text: string) {
      if (text === '') return
      const message: IMessage = {
        id: this.messages.length + 1,
        user,
        text,
        color: 'background-color: ' + this.getColor(user)
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
    trash() {
      this.socket.emit('trash')
    },
    visible() {
      this.visiblity = !this.visiblity 
      this.socket.emit('visible', this.visiblity)
    },
    chgMode(mode: string) {
      this.mode = mode
    }
  }
})
</script>

<style scoped>
header {
  height: 10vh;
}

main {
  height: 70vh;
}

footer {
  height: 20vh;
}

main > .question {
  min-height: 7.5rem;
}

.trans {
  opacity: .2;
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

.active {
  background-color: #e76f51;
  color: #fff;
}
</style>

