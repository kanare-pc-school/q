<template>
  <div class="relative">
    <header v-if="!question" class="sticky top-0 flex content-between w-full bg-gray-100">
      <div class="flex items-center justify-start w-full p-4 font-semibold">
        <font-awesome-icon :icon="['fa', 'bars-staggered']" />
        <span class="mx-4">ならべる</span>
      </div>
      <div v-show="name !== 'sc'" class="flex items-center justify-end w-full p-4 font-semibold">
        <img class="cursor-pointer shadow rounded-full h-10 w-10" :src="img" @click="logout">
        <span class="cursor-pointer mx-4" @click="logout">{{name}}</span>
      </div>
    </header>
    <main class="sticky overflow-y-auto">
      <transition name="fadein">
        <div v-show="question" class="font-semibold border rounded-lg m-4 p-4 min-h-[7.5rem]" v-html="question"></div>
      </transition>
      <transition-group name="fadein" tag="div" class="flex flex-col items-center mx-8 my-4">
        <div v-for="(user, i) in users" :key="'u' + i" class="relative flex items-center mt-4 mb-2 w-full">
          <img :class="{active: user.name === name}" class="mx-4 h-16 w-16" :src="user.img">
          <div :class="{active: user.name === name}" class="text-ellipsis overflow-hidden mr-4 min-w-[10vw] max-w-[140px]">{{user.name}}</div>
          <transition-group name="message" tag="div" class="flex items-center">
            <div v-for="(t, i) in user.text" :key="'t' + i" :class="{'text-xl': !visiblity}">{{hide(t)}}</div>
          </transition-group>
        </div>
      </transition-group>
    </main>
    <footer v-show="name !== 'sc'" class="fixed bottom-0 flex content-between w-full bg-gray-100">
      <div class="flex items-center justify-center w-full p-4 font-semibold">
        <input ref="text" v-model="text" class="appearance-none w-full rounded-lg border-none text-gray-700 mr-3 p-4 leading-tight focus:outline-none" type="text" placeholder="メッセージ" @keydown.enter="submit">
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
  img: string,
  name: string,
  text: string[],
}

export default Vue.extend({
  props: {
    propsName: {
      type: String,
      required: true,
    },
    propsImg: {
      type: String,
      required: true,
    },
  },
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
      name: this.$props.name,
      img: this.$props.Img,
      socket: io(this.$config?.apiURL, {
        transports: ['websocket'],
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
      if (question.toLowerCase().match(/\.(jpeg|jpg|png|bmp|gif)$/i)) {
        this.question = '<img src="' + question + '" />'
      }
      else {
        this.question = question.replace(/\n/g,'<br/>')
      }
    })
    this.socket.on('trash', () => {
      this.question = ''
      this.users.forEach((user: IUser) => {
        user.text = []
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
      if (!name || name === 'sc') return
      const target = this.users.filter((user: IUser) => user.name === name)
      if (target.length === 0) {
        const user: IUser = {
          img: this.$config.avatarURL + name + '.svg',
          name,
          text: text.split('')
        }
        this.users.push(user)
      } else {
        text.split('').forEach((t) => {
          target[0].text.push(t)
        })
      }
    },
    hide(text: string): string {
      if (this.visiblity) return text
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

img.active {
  background-color: #e76f51!important;
  color: #fff!important;
  border-radius: 50%;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, .4);
  padding-top: 5px;
}

div.active {
  font-weight: 700;
}
</style>

