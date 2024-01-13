<script setup>
import csv from "../assets/dico.csv";
import {onMounted, ref} from "vue";
import ChronoComponent from "@/components/ChronoComponent.vue";
import CardsComponent from "@/components/CardsComponent.vue";

const MARK = 20;
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
let reloadGame = ref(false);
let selectState = ref(false);
let timeMax = ref(0);
let score = ref(0);

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
      refCounter.value?.pause();
      computeScore();
      resetGame();

      // TODO animation ending game
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
  refCounter.value?.reset();
  if (!startGame.value) {
    startGame.value = true;
    refCounter.value?.start();
    selectState.value = true;
  }
  if(!reloadGame.value){
    nbCase();
    deck.value = generateCards();
    score.value = 0;
  }
}
const endGame = () => {
  const nbFlipped = deck.value.filter(f => f.isFlipped);
  return nbFlipped.length === deck.value.length;
}

const resetGame = () => {
  startGame.value = false;
  reloadGame.value = false;
  selectState.value = false;
  // score.value = 0;
}

const computeScore = () => {
  const time = refCounter.value?.getElapsedTime().value;
  const paires = (grid.value/2);
  score.value = MARK * (hit.value /  paires) * 0.7 + (paires / error.value) * 0.2 + (time / timeMax.value) * 0.3;
  score.value = Math.floor(score.value);
  console.log("Compute score : ", score.value);
  console.log("Chrono : ", time);
}
const selection = (event) => {
  reloadGame.value = true;
  difficulty.value = event.target.value;
  if(!startGame.value){
    nbCase();
    deck.value = generateCards();
  }

}

const nbCase = () => {
  switch (difficulty.value) {
    case "facile":
      grid.value = 16;
      timeMax.value = 300; // 5 minutes
      break;
    case "moyen":
      grid.value = 20;
      timeMax.value = 600; // 10 minutes
      break;
    case "difficile":
      grid.value = 24;
      timeMax.value = 900; // 15 minutes
      break
    default:
      grid.value = 20;
      timeMax.value = 300;
  }
}

</script>

<template>
  <div class="container">
    <div class="control">
      <!-- difficulty -->
      <div>
        <select name="difficulte" @change="selection($event)" :disabled="selectState">
          <option value="facile" selected>Facile</option>
          <option value="moyen">Moyen</option>
          <option value="difficile">Difficile</option>
        </select>
      </div>
      <button type="button" @click="playGame">{{ buttonPlay }}</button>
      <!-- Chronometer -->
      <chrono-component ref="refCounter"/>
      <!-- errors -->
      <span>Erreur : {{ error }}</span>
      <!-- hits -->
      <span>Coups : {{ hit }}</span>
    </div>

    <div v-bind:id="difficulty" class="grid">
      <!-- Generer la grille -->
      <CardsComponent
          v-for="(card, index) in deck"
          :key="index"
          v-model:value="card.value"
          v-model:isFlipped="card.isFlipped"
          v-model:isMatched="card.isMatched"
          @flip="flipCard(index)"
      />
    </div>
    <p>Score : {{score}}/20</p>
  </div>
</template>

<style scoped>

@font-face {
  font-family: "Perfect DOS VGA 437";
  src: url("../assets/fonts/pixel-ii.ttf") format("truetype");
}
.container {
  max-width: 1190px;
  margin: 0 auto;
  font-family: 'Perfect DOS VGA 437',serif;
  font-weight: bold;
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
select {
  font-family: "Perfect DOS VGA 437", serif;
  font-weight: bold;
}
button{
  font-family: "Perfect DOS VGA 437", serif;
  font-weight: bold;
}
span {
  background-color: #e8e2e2;
}

.grid {
  display: grid;
  justify-content: center;
  gap: 6px;
}
#difficile.grid{
  grid-template-columns: repeat(4, 220px);
  grid-template-rows: repeat(6, 80px);
}
#moyen.grid{
  grid-template-columns: repeat(4, 220px);
  grid-template-rows: repeat(5, 80px);
}
#facile.grid{
   grid-template-columns: repeat(4, 220px);
   grid-template-rows: repeat(4, 80px);
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

/*media query*/
@media screen and (max-width: 905px) {
   #difficile.grid, #moyen.grid, #facile.grid{
     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
     grid-template-rows: none;
     grid-auto-rows: 50px;
  }
  #difficile.grid, #moyen.grid, #facile.grid > .card{
    font-size: 16px;
  }
}

@media screen and (max-width: 810px) {
  #moyen.grid, #facile.grid{
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    grid-template-rows: none;
    grid-auto-rows: 50px;
  }
}
@media screen and (max-width: 768px) {
  #difficile.grid, #moyen.grid, #facile.grid{
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    grid-template-rows: none;
    grid-auto-rows: 40px;
  }
  #moyen.grid{
    grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
  }
  #facile.grid{
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  #difficile.grid > .card, #moyen.grid > .card, #facile.grid > .card{
    font-size: 14px;
  }
}

@media screen and (max-width: 576px) {
  .control > *, select{
    padding: 5px;
  }
  #moyen.grid{
    grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
  }
  #facile.grid{
    grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
  }
  #difficile.grid > .card, #moyen.grid > .card, #facile.grid > .card{
    font-size: 14px;
  }
}

@media screen and (max-width: 450px) {
  .control > *, select{
    padding: 5px;
  }
  #moyen.grid{
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  #facile.grid{
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  #moyen.grid > .card, #facile.grid > .card{
    font-size: 12px;
  }
}

</style>