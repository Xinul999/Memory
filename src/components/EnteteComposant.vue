<script setup>
defineProps({
  titre: {
    type: String,
    required: true
  }
})
</script>

<template>
  <header>
    <nav>
      <article>
        <div class="burger">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p class="big">EDUCAT</p>
      </article>
      <h1>{{titre}}</h1>
    </nav>
  </header>
</template>
<style>
:root{
  --menu-size: 240px;
}
</style>

<style scoped>

header{
  height: 150px;
}

nav{
  display: flex;
  align-items: center;
  height: 100%;
}

article{
  /*width: var(--menu-size);*/
  display: inline-flex;
  /*align-items: center;*/
}
.burger{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 32px;
  cursor: pointer;
  margin: 0 32px;
}

.burger span{
  display: block;
  width: 100%;
  height: 3px;
  background-color: black;
  margin: 3px 0;
}

.big{
  margin: 0;
  font-size: 32px;
  font-weight: 300;
}
h1{
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 38px;

}
</style>