<script setup>

defineProps({
  value: String,
  isFlipped: Boolean,
  isMatched: Boolean,
})

</script>

<template>

  <div class="card" :class="{ flipped: isFlipped, matched: isMatched }" @click="$emit('flip')">
    <div class="card-inner">
      <div class="card-back" v-show="!isFlipped"></div>
      <div class="card-front" v-show="(isFlipped && !isMatched) || (isFlipped && isMatched)">
        <Transition name="fade">
          <div v-if="isFlipped">{{ value }}</div>
        </Transition>

      </div>
    </div>
  </div>

</template>

<style scoped>
.card{
  transition: 0.5s ease-in;
}
.card.flipped{
  transform: rotateY(180deg) scale(1, -1);
}
.card .card-front{
  transform: rotateY(180deg) scale(1, -1);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 2.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>