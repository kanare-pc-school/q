<template>
  <div class="relative flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
      <div class="flex items-center justify-center align-center pt-8 sm:pt-0 font-semibold">
        <font-awesome-icon :icon="['fa', 'computer']" />
        <span class="mx-4">かなれパソコン教室</span>
      </div>
      <div class="mt-2 overflow-hidden sm:rounded-lg p-6">
        <form class="w-full max-w-sm" @submit.prevent="submit">
          <div class="flex items-center border-b border-teal-500 py-2">
            <input maxlength="20" v-model="$v.name.$model" class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="名前を入力してください" @keydown.enter="submit">
            <button class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button" @click="submit">
              決定
            </button>
          </div>
          <div v-if="!$v.name.maxLength" class="error">Name must have at most {{$v.name.$params.maxLength.max}} letters.</div>
        </form>
      </div>
      <div class="fixed bottom-8 right-8 opacity-30 cursor-pointer" @click="$router.push('/admin')"><font-awesome-icon :icon="['fa', 'user-tie']" /></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { required, maxLength } from 'vuelidate/lib/validators'

export default Vue.extend({
  data() {
    return {
      name: ''
    }
  },
  validations: {
    name: {
      required,
      maxLength: maxLength(20)
    },
  },
  methods: {
    submit() {
      if(this.$v.$invalid) return
      this.$router.push({path: '/user', query: {name: this.name}})
    },
  }
})
</script>

<style scoped>
.error {
  color: #f57f6c;
  font-size: .75rem;
  line-height: 1;
  margin-top: .5rem;
}
</style>
