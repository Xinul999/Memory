<script setup>
import {onMounted, ref} from "vue";

const props = defineProps({
  value: String,
  isFlipped: Boolean,
  isMatched: Boolean,
})

const flipCard = () => {
  console.log("Emission");
}

onMounted(() => {

});


console.log("Value :" , ref(props.value));
console.log("Flip : ", ref(props.isFlipped));
console.log("Match : ", ref(props.isMatched));

</script>

<template>

  <div class="card" :class="{ flipped: isFlipped, matched: isMatched }" @click="$emit('flip')">
    <div class="card-inner">
      <div class="card-back" v-show="!isFlipped"></div>
      <div class="card-front" v-show="isFlipped && !isMatched">{{ value }}</div>
    </div>
  </div>

</template>

<style scoped>

</style>