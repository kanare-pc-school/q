<template>
  <div class="relative">
    <header class="sticky top-0 flex content-between w-full bg-gray-100">
      <div class="flex items-center justify-start w-full p-4 font-semibold">
        <font-awesome-icon :icon="['fa', 'chalkboard-user']" />
        <span class="mx-4">管理者</span>
      </div>
      <div class="flex items-center justify-end w-full p-4 font-semibold">
        <div :class="{active: mode === 'connectWords'}" class="flex items-center justify-center shadow rounded-full h-10 w-10 mr-4 cursor-pointer" @click="chgMode('connectWords')">
          <font-awesome-icon :icon="['fa', 'tape']" />
        </div>
        <div :class="{active: mode === 'lineUp'}" class="flex items-center justify-center shadow rounded-full h-10 w-10 mr-4 cursor-pointer" @click="chgMode('lineUp')">
          <font-awesome-icon :icon="['fa', 'bars-staggered']" />
        </div>
        <div :class="{active: mode === 'choiceAnswer'}" class="flex items-center justify-center shadow rounded-full h-10 w-10 mr-4 cursor-pointer" @click="chgMode('choiceAnswer')">
          <font-awesome-icon :icon="['fa', 'square-check']" />
        </div>
        <div class="flex items-center justify-center shadow rounded-full h-10 w-10 mr-4 cursor-pointer" @click="visible">
          <font-awesome-icon v-if="visiblity" :icon="['fa', 'eye']" />
          <font-awesome-icon v-else :icon="['fa', 'eye-slash']" />
        </div>
        <div class="flex items-center justify-center shadow rounded-full h-10 w-10 mr-4 cursor-pointer" @click="trash">
          <font-awesome-icon :icon="['fa', 'trash']" />
        </div>
        <div class="flex items-center justify-center shadow rounded-full h-10 w-10 cursor-pointer" @click="logout">
          <font-awesome-icon :icon="['fa', 'arrow-right-from-bracket']" />
        </div>
      </div>
    </header>
    <main class="sticky overflow-y-auto">
      <div class="question border rounded-lg m-4 p-4 font-semibold" v-html="question"></div>
      <div v-if="mode === 'connectWords'" class="flex flex-wrap items-center mx-8 my-4">
        <div v-if="messages.length === 0"></div>
        <div v-else v-for="message in messages" :key="message.id" class="relative mt-8 mx-4 p-6">
          <span class="text-lg font-semibold">
            <span :class="{trans: !visiblity}">{{ message.text }}</span>
            <span class="tooltip" :style="message.color">{{ message.user }}</span>
          </span>
        </div>
      </div>
      <div v-else-if="mode === 'lineUp'" class="flex flex-col items-center mx-8 my-4">
        <div v-if="users.length === 0"></div>
        <div v-else v-for="user in users" :key="user.id" class="relative flex items-center mt-4 mb-2 w-full">
          <img class="mx-4 h-16 w-16" :src="user.img">
          <div class="text-ellipsis overflow-hidden mr-4 min-w-[140px]">{{user.name}}</div>
          <div :class="{trans: !visiblity}" class="break-all">{{user.text}}</div>
        </div>
      </div>
      <div v-else class="flex items-center mx-8 my-4">
        <div v-if="users.length === 0"></div>
        <div v-else v-for="user in users" :key="user.id" class="box">
          <div class="h">
            <img :src="user.img">
            <span>{{user.name}}</span>
          </div>
          <div class="b">
            <span :class="{trans: !visiblity}">{{user.text}}</span>
            <img :class="{hide: !user.correct}" class="circle" :src="require('@/assets/images/circle.svg')" />
          </div>
        </div>
      </div>
    </main>
    <footer class="fixed bottom-0 flex items-center justify-center p-4 font-semibold w-full bg-gray-100">
      <textarea v-model="text" class="appearance-none h-full w-full rounded-lg border-none text-gray-700 mr-3 p-4 leading-tight focus:outline-none" placeholder="もんだい" ref="text" @keydown.enter.shift="shiftEnter"></textarea>
      <button class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 border-4 text-white px-6 py-2 rounded-lg" type="button" @click="submit">
        送信
      </button>
      <div v-show="mode === 'choiceAnswer'" class="flex items-center justify-end w-full p-4 font-semibold">
        <div :class="{active: selected === 'ア'}" class="flex items-center justify-center shadow rounded-full h-16 w-16 mr-4 cursor-pointer" @click="marking('ア')">
          ア
        </div>
        <div :class="{active: selected === 'イ'}" class="flex items-center justify-center shadow rounded-full h-16 w-16 mr-4 cursor-pointer" @click="marking('イ')">
          イ
        </div>
        <div :class="{active: selected === 'ウ'}" class="flex items-center justify-center shadow rounded-full h-16 w-16 mr-4 cursor-pointer" @click="marking('ウ')">
          ウ
        </div>
        <div :class="{active: selected === 'エ'}" class="flex items-center justify-center shadow rounded-full h-16 w-16 mr-4 cursor-pointer" @click="marking('エ')">
          エ
        </div>
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

interface IUser {
  id: number,
  img: string,
  name: string,
  text: string,
  correct: boolean,
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
      users: IUser[],
      visiblity: boolean,
      mode: string,
      selected: string,
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
      users: [],
      visiblity: true,
      mode: 'connectWords',
      selected: '',
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
      if (this.mode === 'connectWords') {
        this.messages = []
      }
      else {
        this.users.forEach((user: IUser) => {
          user.text = ''
          user.correct = false
        })
        this.socket.emit('message', this.name, '')
        this.selected = ''
      }
    })
    this.socket.on('visible', (visiblity: boolean) => {
      this.visiblity = visiblity
    })
    this.socket.on('marking', (text: string) => {
      this.users.forEach((user: IUser) => {
        if (user.text === text) {
          user.correct = true
        }
      })
    })
    const m = this.$refs.text as HTMLInputElement
    m.focus()
  },
  methods: {
    shiftEnter(e: any) {
      e.preventDefault()
      this.submit()
    },
    submit() {
      this.socket.emit('question', this.text)
    },
    show(name: string, text: string) {
      if (this.mode === 'connectWords') {
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
      }
      else {
        if (!name) return
        const target = this.users.filter((user: IUser) => user.name === name)
        if (target.length === 0) {
          const user: IUser = {
            id: this.users.length + 1,
            img: this.$config.avatarURL + name + '.svg',
            name,
            text,
            correct: false,
          }
          this.users.push(user)
        } else {
          if (this.mode === 'lineUp') {
            target[0].text = target[0].text + text
          }
          else {
            target[0].text = text
          }
        }
      }
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
      this.socket.emit('mode', mode)
      this.mode = mode
    },
    marking(text: string) {
      this.socket.emit('marking', text)
      this.selected = text
    },
    logout() {
      this.socket.emit('logout')
      location.reload()
    },
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

.box {
    display: flex;
    flex-direction: column;
    margin: 1rem;
    border-radius: 1rem;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, .4);
    max-height: 240px;
    max-width: 240px;
    height: 40vw;
    width: 40vw;
}

.box .h {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: .5rem;
    border-radius: 1rem 1rem 0 0;
    background-color: rgb(243 244 246);
}

.box .h img {
    height: 40px;
    width: 40px;
    margin: 0 1rem;
    border-radius: 50%;
}

.box .h span {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.box .b {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 0 0 1rem 1rem;
    height: 100%;
    width: 100%;
}

.box .b span {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    font-size: 4rem;
    height: 100%;
    width: 100%;
}

.box .b .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    height: 150px;
    width: 150px;
}

.box .b .circle.hide {
    display: none!important;
}
</style>