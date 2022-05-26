<template>
  <div>
    <transition name="slide-fade">
      <Nuxt />
    </transition>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LayoutPage',
})
</script>
