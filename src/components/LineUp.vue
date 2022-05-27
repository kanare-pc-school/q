<template>
  <div class="relative">
    <header class="sticky top-0 flex content-between w-full bg-gray-100">
      <div class="flex items-center justify-start w-full p-4 font-semibold">
        <font-awesome-icon :icon="['fa', 'bars-staggered']" />
        <span class="mx-4">ならべる</span>
      </div>
      <div class="flex items-center justify-end w-full p-4 font-semibold">
        <img class="cursor-pointer shadow rounded-full h-10 w-10" :src="img" @click="logout">
        <span class="cursor-pointer mx-4" @click="logout">{{name}}</span>
      </div>
    </header>
    <main class="sticky overflow-y-auto">
      <div class="question border rounded-lg m-4 p-4 font-semibold" v-html="question"></div>
      <div class="flex flex-col items-center mx-8 my-4">
        <div v-if="users.length === 0"></div>
        <div v-else v-for="user in users" :key="user.id" class="relative flex items-center mt-4 w-full">
          <img class="mx-4 h-16 w-16" :src="user.img">
          <div class="text-ellipsis overflow-hidden mr-4 min-w-[140px]">{{user.name}}</div>
          <div class="break-all">{{user.text}}</div>
        </div>
      </div>
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

interface IUser {
  id: number,
  img: string,
  name: string,
  text: string,
}

export default Vue.extend({
  data(): {
      name: string,
      img: string,
      socket: any,
      question: string,
      text: string,
      comments: string,
      users: IUser[],
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
      users: [],
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
      this.users.forEach((user: IUser) => {
        user.text = ''
      })
      this.socket.emit('message', this.name, '')
    })
    this.socket.on('visible', (visiblity: boolean) => {
      this.visiblity = visiblity
    })
    const m = this.$refs.text as HTMLInputElement
    m.focus()
    this.socket.emit('message', this.name, '')
  },
  methods: {
    submit() {
      this.socket.emit('message', this.name, this.text)
      this.text = ''
    },
    show(name: string, text: string) {
      const target = this.users.filter((user: IUser) => user.name === name)
      if (target.length === 0) {
        const user: IUser = {
          id: this.users.length + 1,
          img: this.$config.avatarURL + name + '.svg',
          name,
          text
        }
        this.users.push(user)
      } else {
        target[0].text = target[0].text + text
      }
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

main > .question {
  min-height: 7.5rem;
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

