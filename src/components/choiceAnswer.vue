<template>
  <div class="relative">
    <header class="sticky top-0 flex content-between w-full bg-gray-100">
      <div class="flex items-center justify-start w-full p-4 font-semibold">
        <font-awesome-icon :icon="['fa', 'square-check']" />
        <span class="mx-4">せんたく</span>
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
      <transition-group name="fadein" tag="div" class="flex items-center mx-8 my-4">
        <div v-for="(user, i) in users" :key="i" class="box">
          <div :class="{active: user.name === name}" class="h">
            <img :src="user.img">
            <span>{{user.name}}</span>
          </div>
          <div class="b">
            <span v-if="visiblity">{{user.text}}</span>
            <span v-else>?</span>
            <img :class="{hide: user.correct !== 1}" class="circle" :src="require('~/assets/images/circle.svg')" />
            <img :class="{hide: user.correct !== 2}" class="delete" :src="require('~/assets/images/delete.svg')" />
          </div>
        </div>
      </transition-group>
    </main>
    <footer class="fixed bottom-0 flex content-between w-full bg-gray-100">
      <div class="flex items-center justify-start w-full p-4 font-semibold">
        <span class="mx-2">{{comments}}</span>
      </div>
      <div class="flex items-center justify-end w-full p-4 font-semibold">
        <div :class="{active: selected === 'ア'}" class="flex items-center justify-center shadow rounded-full h-16 w-16 mr-4 cursor-pointer" @click="submit('ア')">
          ア
        </div>
        <div :class="{active: selected === 'イ'}" class="flex items-center justify-center shadow rounded-full h-16 w-16 mr-4 cursor-pointer" @click="submit('イ')">
          イ
        </div>
        <div :class="{active: selected === 'ウ'}" class="flex items-center justify-center shadow rounded-full h-16 w-16 mr-4 cursor-pointer" @click="submit('ウ')">
          ウ
        </div>
        <div :class="{active: selected === 'エ'}" class="flex items-center justify-center shadow rounded-full h-16 w-16 mr-4 cursor-pointer" @click="submit('エ')">
          エ
        </div>
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
  correct: number,
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
      selected: string,
  } {
    return {
      name: '',
      img: '',
      socket: io(this.$config?.apiURL, {
        transports: ['websocket'],
      }),
      question: '',
      text: '',
      comments: '',
      users: [],
      visiblity: true,
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
      this.selected = ''
      this.users.forEach((user: IUser) => {
        user.text = ''
        user.correct = 0
      })
      this.socket.emit('message', this.name, '')
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
    this.socket.emit('message', this.name, '')
  },
  methods: {
    submit(text: string) {
      this.socket.emit('message', this.name, text)
      this.selected = text
    },
    show(name: string, text: string) {
      if (!name) return
      const target = this.users.filter((user: IUser) => user.name === name)
      if (target.length === 0) {
        const user: IUser = {
          id: this.users.length + 1,
          img: this.$config.avatarURL + name + '.svg',
          name,
          text,
          correct: 0,
        }
        this.users.push(user)
      } else {
        target[0].text = text
      }
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

.active {
  background-color: #e76f51!important;
  color: #fff!important;
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

.box .b .circle,
.box .b .delete {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    height: 120px;
    width: 120px;
    opacity: .7;
}

.box .b .circle.hide,
.box .b .delete.hide {
    display: none!important;
}
</style>

