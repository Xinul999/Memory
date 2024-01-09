<script setup>
import csv from "../assets/dico.csv";
import {onMounted, ref} from "vue";
import ChronoComponent from "@/components/ChronoComposant.vue";
import CarteComposant from "@/components/CarteComposant.vue";

const refCounter = ref(ChronoComponent);
const error = ref(0);
const hit = ref(0);
const difficulty = ref('facile');
const grid = ref(16);
const map = ref(new Map());
const deck = ref([]);
let stackFlip = ref([]);
let isFliping = ref(false);
let startGame = ref(false);
let buttonPlay = ref("Jouer");

onMounted(() => {
  for (const val in csv) {
    map.value.set(Number(val), csv[val]?.head);
  }
  deck.value = generateCards();
});

const generateDeck = (difficultyLevel) => {
  const tab = [];
  while (tab.length < (difficultyLevel / 2)) {
    const idx = Math.floor(Math.random() * map.value.size);
    const mot = map.value.get(idx);
    if (!tab.includes(mot)) {
      tab.push(mot);
    }
  }
  return tab;
}

const generateCards = () => {
  let cards = [];
  for (const value of generateDeck(grid.value)) {
    cards.push({value, isFlipped: false, isMatched: false});
    cards.push({value, isFlipped: false, isMatched: false});
  }
  cards = shuffle(cards);
  return cards;
}
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
const flipCard = (index) => {
  console.log("Enter flip card emit ", new Date());
  if(startGame.value){
    if (isFliping.value) return;
    if (deck.value[index].isFlipped === false && stackFlip.value.length < 2) {
      deck.value[index].isFlipped = true;
      stackFlip.value.push(index);
    }
    if (stackFlip.value.length === 2) {
      isFliping.value = true;
      setTimeout(() => {
        matchCards();
      }, 2000);
    }
    if (endGame()) {
      buttonPlay.value = "Rejouer";
      computeScore();
      resetGame();
      console.log("welldone");
    }
  }


}

const matchCards = () => {
  const cart1 = deck.value[stackFlip.value[0]];
  const cart2 = deck.value[stackFlip.value[1]];

  if (cart1?.value === cart2?.value) {
    cart1.isMatched = true
    cart2.isMatched = true;
    cart1.isFlipped = true;
    cart2.isFlipped = true;
    hit.value++;
  } else {
    cart1.isMatched = false;
    cart2.isMatched = false;
    cart1.isFlipped = false;
    cart2.isFlipped = false;
    error.value++;
  }
  stackFlip.value.splice(0, stackFlip.value.length);
  isFliping.value = false;
}
const playGame = () => {
  if (!startGame.value) {
    startGame.value = true;
    refCounter.value?.start();
    nbCase();
    deck.value = generateCards();
  }
}
const endGame = () => {
  const nbFlipped = deck.value.filter(f => f.isFlipped);
  return nbFlipped.length === deck.value.length;
}

const resetGame = () => {
  startGame.value = false;
  refCounter.value?.reset();
}

const computeScore = () => {
  const time = refCounter.value?.getElapsedTime().value;
  console.log("Compute score : ");
  console.log("Chrono : ", time);
}
const selection = (event) => {
  difficulty.value = event.target.value;
}

const nbCase = () => {
  switch (difficulty.value) {
    case "facile":
      grid.value = 16;
      break;
    case "moyen":
      grid.value = 20;
      break;
    case "difficile":
      grid.value = 28;
      break
    default:
      grid.value = 20;
  }
}

</script>

<template>
  <div class="container">
    <div class="control">
      <!-- liste deroulante -->
      <div>
        <select name="difficulte" @change="selection($event)">
          <option value="facile" selected>Facile</option>
          <option value="moyen">Moyen</option>
          <option value="difficile">Difficile</option>
        </select>
      </div>
      <button type="button" @click="playGame">{{ buttonPlay }}</button>
      <!-- Chronometre -->
      <chrono-component ref="refCounter"/>
      <!-- Nombre d'erreur -->
      <span>Erreur : {{ error }}</span>
      <!-- Nombre de coups -->
      <span>Coups : {{ hit }}</span>
    </div>

    <div class="grid" v-bind:style="{
      gridTemplateColumns: 'repeat(' + grid/4 + ', 220px)',
      gridTemplateRows: 'repeat(' + (grid/2 - 1) + ', 80px)'
      }">
      <!-- Generer la grille -->
      <CarteComposant
          v-for="(card, index) in deck"
          :key="index"
          v-model:value="card.value"
          v-model:isFlipped="card.isFlipped"
          v-model:isMatched="card.isMatched"
          @flip="flipCard(index)"
      />
    </div>
  </div>
</template>

<style scoped>

.container {
  width: 1190px;
  margin: 0 auto;
}

.control {
  display: flex;
  height: 60px;
  background-color: lightblue;
  align-items: center;
  padding: 0 12px;
  justify-content: space-between;
  border-radius: 12px;
}

.control > div:first-child {
  padding: 0;
}

.control > *, select {
  padding: 10px;
}

span {
  background-color: #e8e2e2;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 180px);
  grid-template-rows: repeat(4, 100px);
  justify-content: center;
  gap: 6px;
}

.card {
  background-color: lightblue;
  border: 1px solid black;
  cursor: pointer;
}


.grid > .card {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-weight: bold;
  font-size: 20px;
}

.control + .grid {
  margin: 1em 0;
}

</style>