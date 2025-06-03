<template>
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold font-fugaz">Substituir {{ tipusApat }} de {{ dia }}</h2>
      <button @click="$emit('tancar')" class="text-gray-500 hover:text-gray-700">
        <span class="text-2xl">&times;</span>
      </button>
    </div>
    
    <div class="mb-4">
      <p class="text-gray-600">Selecciona un plat alternatiu:</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="plat in platsSimilars" 
        :key="plat.id" 
        class="border rounded-lg p-4 cursor-pointer hover:bg-green-50 transition-colors"
        @click="seleccionarPlat(plat)"
      >
        <div class="flex items-center">
          <div class="w-12 h-12 mr-3 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center">
            <img 
              :src="getIconaPlat(plat)" 
              :alt="plat.nom"
              class="w-10 h-10 object-contain"
            >
          </div>
          <div class="flex-grow">
            <p class="font-nunito font-semibold">{{ plat.nom }}</p>
            <div class="flex items-center text-sm text-gray-600 mt-1">
              <span class="mr-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd" />
                </svg>
                {{ plat.valors_nutricionals.calories }} kcal
              </span>
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                {{ plat.valors_nutricionals.proteines }}g proteïna
              </span>
            </div>
            <div class="mt-2 flex flex-wrap gap-1">
              <span 
                v-for="(etiqueta, index ) in plat.etiquetes.slice(0, 3)" 
                :key="index"
                class="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs"
              >
                {{ etiqueta }}
              </span>
              <span v-if="plat.etiquetes.length > 3" class="text-xs text-gray-500">
                +{{ plat.etiquetes.length - 3 }} més
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="platsSimilars.length === 0" class="text-center py-8">
      <p class="text-gray-500">No s'han trobat plats similars disponibles.</p>
    </div>
  </div>
</div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
dia: {
  type: String,
  required: true
},
tipusApat: {
  type: String,
  required: true
},
platsSimilars: {
  type: Array,
  required: true
}
});

const emit = defineEmits(['tancar', 'seleccionar']);

// Mètodes
function getIconaPlat(plat) {
// Ruta a les icones dels plats
return `/assets/icons/${plat.icona || 'default.png'}`;
}

function seleccionarPlat(plat) {
emit('seleccionar', plat);
}
</script>

<style scoped>
/* Estils específics del component */
</style>
