<template>
  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
    <div v-for="(dia, nomDia) in menuSetmanal" :key="nomDia" class="bg-white p-4 rounded-xl shadow">
      <h2 class="text-center font-semibold mb-2">{{ nomDia.toUpperCase() }}</h2>

      <div class="mb-2">
        <h3 class="text-sm font-bold">DINAR</h3>
        <p class="text-sm">{{ dia.dinar?.plat || 'No disponible' }}</p>
      </div>

      <div>
        <h3 class="text-sm font-bold">SOPAR</h3>
        <p class="text-sm">{{ dia.sopar?.plat || 'No disponible' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import plats from '../src/data/plats_app.json'

const menuSetmanal = ref({})

onMounted(() => {
  menuSetmanal.value = {
    dilluns: {
      dinar: plats[0],
      sopar: plats[1]
    },
    dimarts: {
      dinar: plats[2],
      sopar: plats[3]
    },
    dimecres: {
      dinar: plats[4],
      sopar: plats[5]
    },
    dijous: {
      dinar: plats[6],
      sopar: plats[7]
    },
    divendres: {
      dinar: plats[8],
      sopar: plats[9]
    },
    dissabte: {
      dinar: plats[10],
      sopar: plats[11]
    },
    diumenge: {
      dinar: plats[12],
      sopar: plats[13]
    }
  }
})
</script>
