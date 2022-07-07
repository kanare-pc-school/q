<template>
  <div class="relative">
    <header class="sticky top-0 flex content-between w-full bg-gray-100">
      <div class="flex items-center justify-start w-full p-4 font-semibold">
        <font-awesome-icon :icon="['fab', 'youtube']" style="color: #f00" />
        <span class="mx-4">YouTube Live</span>
      </div>
      <div
        v-show="name !== 'sc'"
        class="flex items-center justify-end w-full p-4 font-semibold"
      >
        <img
          class="cursor-pointer shadow rounded-full h-10 w-10"
          :src="img"
          @click="logout"
        />
        <span class="cursor-pointer mx-4" @click="logout">{{ name }}</span>
      </div>
    </header>
    <main>
      <iframe :src="'https://www.youtube.com/embed/' + mid"></iframe>
    </main>
    <footer
      v-show="name !== 'sc'"
      class="fixed bottom-0 flex content-between w-full bg-gray-100"
    >
      <div class="flex items-center justify-center p-4">
        <input
          v-model="mid"
          class="appearance-none rounded-lg border-none text-gray-700 mr-3 p-4 leading-tight focus:outline-none mid"
          type="text"
          placeholder="動画ＩＤ"
        />
      </div>
      <div class="flex items-center justify-center w-full p-4 font-semibold">
        <input
          ref="text"
          v-model="text"
          class="appearance-none w-full rounded-lg border-none text-gray-700 mr-3 p-4 leading-tight focus:outline-none"
          type="text"
          placeholder="メッセージ"
          @keydown.enter="submit"
        />
        <button
          class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 border-4 text-white px-6 py-2 rounded-lg"
          type="button"
          @click="submit"
        >
          送信
        </button>
      </div>
      <div class="flex items-center justify-end w-240 p-4 font-semibold">
        <div
          :class="{ active: selected === 'ア' }"
          class="flex items-center justify-center shadow rounded-full h-16 w-16 mr-4 cursor-pointer"
          @click="choice('ア')"
        >
          ア
        </div>
        <div
          :class="{ active: selected === 'イ' }"
          class="flex items-center justify-center shadow rounded-full h-16 w-16 mr-4 cursor-pointer"
          @click="choice('イ')"
        >
          イ
        </div>
        <div
          :class="{ active: selected === 'ウ' }"
          class="flex items-center justify-center shadow rounded-full h-16 w-16 mr-4 cursor-pointer"
          @click="choice('ウ')"
        >
          ウ
        </div>
        <div
          :class="{ active: selected === 'エ' }"
          class="flex items-center justify-center shadow rounded-full h-16 w-16 mr-4 cursor-pointer"
          @click="choice('エ')"
        >
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
  img: string
  name: string
  text: string[]
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
    name: string
    img: string
    socket: any
    text: string
    selected: string
    mid: string
  } {
    return {
      name: this.$props.name,
      img: this.$props.Img,
      socket: io(this.$config?.apiURL, {
        transports: ['websocket'],
      }),
      text: '',
      selected: '',
      mid: this.$config?.mId,
    }
  },
  mounted() {
    this.name = this.$route.query.name as string
    this.img = this.$config.avatarURL + this.name + '.svg'
    this.socket.on('message', (name: string, text: string) => {
      if (name === this.name) {
        this.$toast.success(text, {
          message: text,
          position: 'bottom-right',
        })
      } else if (name === null) {
        this.$toast.warning(text, {
          message: text,
          position: 'top-right',
        })
      } else {
        this.$toast.info(text, {
          message: text,
          position: 'bottom-left',
        })
      }
    })
    this.socket.on('trash', () => {
      this.selected = ''
      this.socket.emit('message', this.name, '')
    })
    const m = this.$refs.text as HTMLInputElement
    m.focus()
    this.selected = ''
    this.socket.emit('message', this.name, '')
    this.fullscreen()
  },
  methods: {
    submit() {
      this.socket.emit('message', this.name, this.text)
      this.text = ''
    },
    choice(char: string) {
      this.socket.emit('message', this.name, char)
      this.selected = char
    },
    logout() {
      this.$router.push('/')
    },
    fullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
    },
  },
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

main > iframe {
  height: 100%;
  width: 100%;
}

.active {
  background-color: #e76f51 !important;
  color: #fff !important;
}

.mid {
  width: 180px;
}
</style>
