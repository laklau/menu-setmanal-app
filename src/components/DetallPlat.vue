<template>
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold font-fugaz">{{ plat.nom }}</h2>
      <button @click="$emit('tancar')" class="text-gray-500 hover:text-gray-700">
        <span class="text-2xl">&times;</span>
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div class="flex items-center mb-4">
          <div class="w-16 h-16 mr-4 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center">
            <img 
              :src="getIconaPlat(plat)" 
              :alt="plat.nom"
              class="w-12 h-12 object-contain"
            >
          </div>
          <div>
            <p class="text-sm text-gray-600">
              <span class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full mr-2">{{ plat.categoria }}</span>
              <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{{ plat.tipus_plat }}</span>
            </p>
          </div>
        </div>
        
        <h3 class="text-lg font-semibold mb-2">Ingredients</h3>
        <ul class="list-disc pl-5 mb-4">
          <li v-for="(ingredient, index) in plat.ingredients" :key="index" class="mb-1">
            {{ ingredient.nom }}
            <span v-if="ingredient.quantitat">
              ({{ ingredient.quantitat }} {{ ingredient.unitat }})
            </span>
          </li>
        </ul>
        
        <h3 class="text-lg font-semibold mt-4 mb-2">Instruccions</h3>
        <ol class="list-decimal pl-5">
          <li v-for="(instruccio, index) in plat.instruccions" :key="index" class="mb-2">
            {{ instruccio }}
          </li>
        </ol>
      </div>
      
      <div>
        <h3 class="text-lg font-semibold mb-2">Informació nutricional</h3>
        <div class="bg-gray-100 p-4 rounded-lg mb-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white p-3 rounded-lg shadow-sm">
              <p class="text-gray-600 text-sm">Calories:</p>
              <p class="font-bold text-xl">{{ plat.valors_nutricionals.calories }} <span class="text-sm">kcal</span></p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm">
              <p class="text-gray-600 text-sm">Proteïnes:</p>
              <p class="font-bold text-xl">{{ plat.valors_nutricionals.proteines }} <span class="text-sm">g</span></p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm">
              <p class="text-gray-600 text-sm">Greixos:</p>
              <p class="font-bold text-xl">{{ plat.valors_nutricionals.greixos }} <span class="text-sm">g</span></p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm">
              <p class="text-gray-600 text-sm">Carbohidrats:</p>
              <p class="font-bold text-xl">{{ plat.valors_nutricionals.carbohidrats }} <span class="text-sm">g</span></p>
            </div>
          </div>
        </div>
        
        <h3 class="text-lg font-semibold mt-4 mb-2">Etiquetes</h3>
        <div class="flex flex-wrap gap-2 mb-4">
          <span 
            v-for="(etiqueta, index) in plat.etiquetes" 
            :key="index"
            class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
          >
            {{ etiqueta }}
          </span>
        </div>
        
        <div class="mt-4 bg-blue-50 p-4 rounded-lg">
          <h4 class="font-semibold mb-2">Informació addicional</h4>
          <p class="text-gray-600 mb-1">Temporada: <span class="font-semibold">{{ plat.temporada.join(', ') }}</span></p>
          <p class="text-gray-600">Tipus d'àpat: <span class="font-semibold">{{ plat.tipus_apat.join(', ') }}</span></p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
plat: {
  type: Object,
  required: true
}
});

const emit = defineEmits(['tancar']);

// Mètodes
function getIconaPlat(plat) {
// Ruta a les icones dels plats
return `/assets/icons/${plat.icona || 'default.png'}`;
}
</script>

<style scoped>
/* Estils específics del component */
</style>
