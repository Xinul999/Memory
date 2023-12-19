<script setup>
import {onMounted, ref} from "vue";

const interval = ref(undefined);
const timeElapsed = ref(0);

const start = () => {
  interval.value = setInterval(() => {
    timeElapsed.value++;
  },1000);
}

const pause = () => {
  clearInterval(interval.value);
  interval.value = undefined;
}

const reset = () => {
  timeElapsed.value = 0;
  pause();
}
const formateTime = (time) =>{
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor((time % 3600) / 60);
  const hours = Math.floor(time / 3600);
  return `${getDataTime(hours)}:${getDataTime(minutes)}:${getDataTime(seconds)}`;
}
const getDataTime = (data) => {
  return (data < 10) ? '0' + data : data;
}
const getElapsedTime = () => {
  return timeElapsed;
}

defineExpose({
  start,
  stop,
  reset,
  getElapsedTime
});

</script>

<template>
    <span>{{ formateTime(timeElapsed) }}</span>
</template>

<style scoped>

</style>