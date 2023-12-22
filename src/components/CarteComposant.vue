<script setup>
import {onMounted, ref} from "vue";

const props = defineProps({
  value: String,
  isFlipped: Boolean,
  isMatched: Boolean,
})

</script>

<template>

  <div class="card" :class="{ flipped: isFlipped, matched: isMatched }" @click="$emit('flip')">
    <div class="card-inner">
      <div class="card-back" v-show="!isFlipped"></div>
      <div class="card-front" v-show="(isFlipped && !isMatched) || (isFlipped && isMatched)">{{ value }}</div>
    </div>
  </div>

</template>

<style scoped>

</style>