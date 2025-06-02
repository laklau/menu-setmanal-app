<template>
<div class="p-4 max-w-4xl mx-auto">
  <h1 class="text-3xl font-fugaz mb-6 text-center">Menú setmanal</h1>
  <div v-for="(day, index) in daysOfWeek" :key="index" class="mb-8">
    <h2 class="text-xl font-semibold uppercase mb-4">{{ day }}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Dinar Card -->
      <div
        class="rounded-2xl p-4 flex items-center gap-4 bg-white"
        :style="{ backgroundColor: getColor(mealsByDay[index]?.dinar?.categoria_1) }"
      >
        <img
          src="/icons/sample_icon.png"
          alt="icona plat"
          class="w-16 h-16 object-contain"
        />
        <div class="text-nunito text-black">
          <strong>Dinar:</strong>
          <span class="ml-2">
            {{ mealsByDay[index]?.dinar?.plat || 'No disponible' }}
          </span>
        </div>
      </div>

      <!-- Sopar Card -->
      <div
        class="rounded-2xl p-4 flex items-center gap-4 bg-white"
        :style="{ backgroundColor: getColor(mealsByDay[index]?.sopar?.categoria_1) }"
      >
        <img
          src="/icons/sample_icon.png"
          alt="icona plat"
          class="w-16 h-16 object-contain"
        />
        <div class="text-nunito text-black">
          <strong>Sopar:</strong>
          <span class="ml-2">
            {{ mealsByDay[index]?.sopar?.plat || 'No disponible' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import plats from '../data/plats_app.json'

const daysOfWeek = [
  'DILLUNS', 'DIMARTS', 'DIMECRES',
  'DIJOUS', 'DIVENDRES', 'DISSABTE', 'DIUMENGE'
]
const mealsByDay = ref([])

// Color mapping function
function getColor(category) {
  const colors = {
    'Carn blanca': '#F7D9D9',
    'Peix': '#D9EAF7',
    'Llegums': '#F7E8D9',
    'Ous': '#F7F7D9',
    'Verdures': '#DFF7D9',
    'Cereals i tubercles': '#F7F2D9',
    'Proteic vegetal': '#F7D9E8',
    'Piscolabis': '#E8E8E8'
  }
  return colors[category] || '#FFFFFF'
}

// Funció per determinar l'estació de l'any
function getEstacioActual(date = new Date()) {
  const mes = date.getMonth() + 1 // Gener = 1
  if (mes >= 3 && mes <= 5) return 'Primavera'
  if (mes >= 6 && mes <= 8) return 'Estiu'
  if (mes >= 9 && mes <= 11) return 'Tardor'
  return 'Hivern'
}

// Filtra plats per estació actual o "Tot l'any"
function filtraPlatsPerEstacio(estacio) {
  return plats.filter(p =>
    p["Estació preferent"] &&
    (
      p["Estació preferent"].toLowerCase().includes(estacio.toLowerCase()) ||
      p["Estació preferent"].toLowerCase().includes("tot l'any")
    )
  )
}

// Generar menú setmanal
function generarMenu() {
  const estacio = getEstacioActual()
  const platsFiltrats = filtraPlatsPerEstacio(estacio)

  const diners = platsFiltrats.filter(p => p.apat?.toLowerCase() === 'dinar')
  const sopars = platsFiltrats.filter(p => p.apat?.toLowerCase() === 'sopar')

  mealsByDay.value = []
  for (let i = 0; i < daysOfWeek.length; i++) {
    const dinar = diners[i % diners.length]
    const sopar = sopars.find(s => s.categoria_1 !== dinar.categoria_1) || sopars[i % sopars.length]
    mealsByDay.value.push({ dinar, sopar })
  }

  console.log(`Menú generat per a l'estació: ${estacio}`)
}

onMounted(() => {
  generarMenu()
})
</script>

<style scoped>
.font-fugaz {
  font-family: 'Fugaz One', cursive;
}
.text-nunito {
  font-family: 'Nunito', sans-serif;
}
</style>