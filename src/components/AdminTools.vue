<template>
  <div class="relative">
    <header class="sticky top-0 flex content-between w-full bg-gray-100">
      <div class="flex items-center justify-start w-auto p-4 font-semibold">
        <font-awesome-icon :icon="['fa', 'chalkboard-user']" />
        <span class="mx-4 whitespace-nowrap">管理者</span>
      </div>
      <div class="flex items-center p-4 font-semibold overflow-x-auto overflow-y-hidden whitespace-nowrap w-full sm:justify-end">
        <div :class="{active: mode === 'connectWords'}" class="flex items-center justify-center shadow rounded-full h-10 w-10 px-4 mr-4 cursor-pointer bg-white" @click="chgMode('connectWords')">
          <font-awesome-icon :icon="['fa', 'tape']" />
        </div>
        <div :class="{active: mode === 'lineUp'}" class="flex items-center justify-center shadow rounded-full h-10 w-10 px-4 mr-4 cursor-pointer bg-white" @click="chgMode('lineUp')">
          <font-awesome-icon :icon="['fa', 'bars-staggered']" />
        </div>
        <div :class="{active: mode === 'choiceAnswer'}" class="flex items-center justify-center shadow rounded-full h-10 w-10 px-4 mr-8 cursor-pointer bg-white" @click="chgMode('choiceAnswer')">
          <font-awesome-icon :icon="['fa', 'square-check']" />
        </div>
        <div :class="{active: mode === 'edit'}"  class="flex items-center justify-center shadow rounded-full h-10 w-10 px-4 mr-8 cursor-pointer bg-white" @click="edit">
          <font-awesome-icon :icon="['fa', 'file-pen']" />
        </div>
        <div :class="{active: !visiblity}" class="flex items-center justify-center shadow rounded-full h-10 w-10 px-4 mr-4 cursor-pointer bg-white" @click="visible(!visiblity)">
          <font-awesome-icon v-if="visiblity" :icon="['fa', 'eye']" />
          <font-awesome-icon v-else :icon="['fa', 'eye-slash']" />
        </div>
        <div class="flex items-center justify-center shadow rounded-full h-10 w-10 px-4 mr-4 cursor-pointer bg-white" @click="trash">
          <font-awesome-icon :icon="['fa', 'trash']" />
        </div>
        <div class="flex items-center justify-center shadow rounded-full h-10 w-10 px-4 cursor-pointer bg-white" @click="logout">
          <font-awesome-icon :icon="['fa', 'arrow-right-from-bracket']" />
        </div>
      </div>
    </header>
    <main class="sticky overflow-y-auto">
      <transition name="fadein">
        <div v-show="question" class="font-semibold border rounded-lg m-4 p-4 min-h-[7.5rem]" v-html="question"></div>
      </transition>
      <transition-group name="fadein" v-if="mode === 'edit'" tag="div" class="flex flex-col items-center mx-8 my-4">
        <div v-for="(q, i) in questions" :key="'q' + i" class="flex items-center mt-4 mb-2 w-full">
          <div class="flex items-center justify-center shadow rounded-full h-10 w-10 mx-4">{{('00' + i ).slice(-2)}}</div>
          <textarea v-model="questions[i].text" class="appearance-none h-full w-full rounded-lg border-2 text-gray-700 mr-3 p-4 leading-tight focus:outline-none"></textarea>
          <button class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 border-4 text-white px-6 py-2 rounded-lg" type="button" @click="update((i + 1), questions[i].text)">
            更新
          </button>
        </div>
      </transition-group>
      <transition-group name="message" v-else-if="mode === 'connectWords'" tag="div" class="flex flex-wrap items-center mx-8 my-2">
        <div v-for="message in messages" :key="'m' + message.id" class="relative mb-8 mx-4 px-6 py-4">
          <span class="text-lg font-semibold">
            <span v-if="visiblity">{{ message.text }}</span>
            <span v-else class="opacity-50">{{ message.text }}</span>
            <span class="tooltip" :style="message.color">{{ message.user }}</span>
          </span>
        </div>
      </transition-group>
      <transition-group name="fadein" v-else-if="mode === 'lineUp'" tag="div" class="flex flex-col items-center mx-8 my-4">
        <div v-for="(user, i) in users" :key="'u' + i" class="relative flex items-center mt-4 mb-2 w-full">
          <img :class="{active: user.name === name}" class="mx-4 h-16 w-16" :src="user.img">
          <div :class="{active: user.name === name}" class="text-ellipsis overflow-hidden mr-4 min-w-[140px]">{{user.name}}</div>
          <transition-group name="message" tag="div" class="flex items-center">
            <div v-for="(t, i) in user.text" :key="'t' + i">{{t}}</div>
          </transition-group>
        </div>
      </transition-group>
      <transition-group name="fadein" v-else tag="div" class="flex flex-wrap items-center mx-2 my-4">
        <div v-for="(user, i) in users" :key="'u' + i" class="box">
          <div :class="{active: user.name === name}" class="h">
            <img :src="user.img">
            <span>{{user.name}}</span>
          </div>
          <div class="b">
            <span :class="{'opacity-30': !visiblity}">{{user.text}}</span>
            <img :class="{invisible: user.correct !== 1}" class="circle" :src="require('~/assets/images/circle.svg')" />
            <img :class="{invisible: user.correct !== 2}" class="delete" :src="require('~/assets/images/delete.svg')" />
          </div>
        </div>
      </transition-group>
    </main>
    <footer>
      <div class="flex flex-col items-center h-full w-auto">
        <div class="flex flex-nowrap items-center justify-center h-auto w-full pb-2 grow">
          <textarea v-show="!picture" v-model="text" class="appearance-none h-full w-full rounded-lg border-none text-gray-700 mr-3 p-4 leading-tight focus:outline-none" placeholder="もんだい" @keydown.enter.shift="shiftEnter"></textarea>
          <img v-show="picture" :src="picture" class="pic">
          <button class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 border-4 text-white px-6 py-2 rounded-lg ml-2" type="button" @click="submit">送信</button>
        </div>
        <div :class="{'short': mode === 'choiceAnswer'}" class="questions">
          <div v-for="(q, i) in questions" :key="'q' + i" class="flex items-center justify-center shadow rounded-full h-8 w-8 p-4 mr-2 my-2 cursor-pointer bg-white" @click="setQuestion(q.no, q.text)">{{(i + 1)}}</div>
        </div>
      </div>
      <div v-show="mode === 'choiceAnswer'" :class="{'short': mode === 'choiceAnswer'}" class="choces">
        <div class="flex flex-row flex-nowrap items-center justify-end">
          <div :class="{active: selected === 'ア'}" class="flex items-center justify-center shadow rounded-full h-12 w-12 sm:h-16 sm:w-16 mr-4 font-semibold cursor-pointer" @click="marking('ア')">
            ア
          </div>
          <div :class="{active: selected === 'イ'}" class="flex items-center justify-center shadow rounded-full h-12 w-12 sm:h-16 sm:w-16 font-semibold cursor-pointer" @click="marking('イ')">
            イ
          </div>
        </div>
        <div class="flex flex-nowrap items-center justify-end">
          <div :class="{active: selected === 'ウ'}" class="flex items-center justify-center shadow rounded-full h-12 w-12 sm:h-16 sm:w-16 mr-4 font-semibold cursor-pointer" @click="marking('ウ')">
            ウ
          </div>
          <div :class="{active: selected === 'エ'}" class="flex items-center justify-center shadow rounded-full h-12 w-12 sm:h-16 sm:w-16 font-semibold cursor-pointer" @click="marking('エ')">
            エ
          </div>
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
  correct: number,
}

export default Vue.extend({
  data(): {
      name: string,
      img: string,
      socket: any,
      question: string,
      text: string,
      picture: string,
      comments: string,
      messages: IMessage[],
      users: IUser[],
      visiblity: boolean,
      mode: string,
      selected: string,
      questions: any,
  } {
    return {
      name: '',
      img: '',
      socket: io(this.$config?.apiURL, {
        transports: ['websocket'],
      }),
      question: '',
      text: '',
      picture: '',
      comments: '',
      messages: [],
      users: [],
      visiblity: true,
      mode: 'connectWords',
      selected: '',
      questions: [],
    }
  },
  mounted() {
    this.name = (this.$route.query.name) as string
    this.img = this.$config.avatarURL + this.name + '.svg'
    this.socket.on('message', (name: string, text: string) => {
      this.show(name, text)
    })
    this.socket.on('question', (question: string) => {
      if (question.toLowerCase().match(/\.(jpeg|jpg|png|bmp|gif)$/i)) {
        this.question = '<img src="/files/' + question + '" />'
      }
      else {
        this.question = question.replace(/\n/g,'<br/>')
      }
    })
    this.socket.on('questions', (questions: any) => {
      this.questions = questions
    })
    this.socket.on('trash', () => {
      this.question = ''
      this.text = ''
      this.picture = ''
      if (this.mode === 'connectWords') {
        this.messages = []
      }
      else {
        this.users.forEach((user: IUser) => {
          user.text = ''
          user.correct = 0
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
          user.correct = 1
        }
        else {
          user.correct = 2
        }
      })
    })
    this.socket.emit('questions')
  },
  methods: {
    shiftEnter(e: any) {
      e.preventDefault()
      this.submit()
    },
    submit() {
      if (this.mode === 'edit') {
        this.update(this.questions.length + 1, this.text)
        return
      }
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
        if (!name || name === 'sc') return
        const target = this.users.filter((user: IUser) => user.name === name)
        if (target.length === 0) {
          const user: IUser = {
            id: this.users.length + 1,
            img: this.$config.avatarURL + name + '.svg',
            name,
            text,
            correct: 0,
          }
          this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);this.users.push(user);
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
    visible(visiblity: boolean) {
      this.visiblity = visiblity
      this.socket.emit('visible', this.visiblity)
    },
    chgMode(mode: string) {
      this.socket.emit('mode', mode)
      this.mode = mode
      this.question = ''
      this.text = ''
      this.picture = ''
      this.visiblity = true
    },
    marking(text: string) {
      this.socket.emit('marking', text)
      this.selected = text

      this.visible(true)
    },
    logout() {
      this.socket.emit('logout')
      location.reload()
    },
    setQuestion(_num: number, question: string) {
      if (question.toLowerCase().match(/\.(jpeg|jpg|png|bmp|gif)$/i)) {
        this.text = question
        this.picture = '/files/' + question
      }
      else {
        this.text = question
        this.picture = ''
      }
    },
    edit() {
      this.mode = 'edit'
      this.question = ''
      this.text = ''
      this.picture = ''
      this.visiblity = true
      this.socket.emit('logout')
    },
    update(i: number, text: string) {
      if (this.questions.length < i) {
        this.socket.emit('update', i, text)
        return
      }
      this.socket.emit('update', i, text)
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
    height: 38vw;
    width: 38vw;
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

.box .b .circle,
.box .b .delete {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    max-height: 120px;
    max-width: 120px;
    height: 20vw;
    width: 20vw;
    opacity: .7;
}

.box .b .circle.invisible,
.box .b .delete.invisible {
    display: none!important;
}

.pic {
  height: calc(20vh - 5rem);
}

footer {
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: .5rem 1rem;
  width: 100%;
  background-color: rgb(243 244 246);
  font-weight: 600;
}

footer .questions {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  height: 3rem;
  width: 96vw;
}

footer .questions.short {
  width: calc(96vw - 10rem);
}

footer .choces {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding-left: 2rem;
  width: 200px;
}

footer .choces.short {
  padding-left: 1rem;
  width: 180px;
}
</style>