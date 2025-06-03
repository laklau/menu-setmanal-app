<template>
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold font-fugaz">Llista de la compra</h2>
      <button @click="$emit('tancar')" class="text-gray-500 hover:text-gray-700">
        <span class="text-2xl">&times;</span>
      </button>
    </div>
    
    <div v-if="llistaCompra">
      <div v-for="(items, categoria) in llistaCompra" :key="categoria" class="mb-6">
        <h3 class="text-lg font-semibold mb-2 capitalize">{{ categoria }}</h3>
        <ul class="bg-gray-50 rounded-lg p-4">
          <li 
            v-for="(item, index) in items" 
            :key="index"
            class="flex items-center py-2 border-b last:border-0"
          >
            <input 
              type="checkbox" 
              :id="'item-' + categoria + '-' + index"
              class="mr-3 h-5 w-5 text-green-600"
              :checked="esItemComprat(categoria, index)"
              @change="marcarItem(categoria, index, $event.target.checked)"
            >
            <label 
              :for="'item-' + categoria + '-' + index" 
              class="flex-grow"
              :class="{'line-through text-gray-400': esItemComprat(categoria, index)}"
            >
              {{ item.nom }}
              <span v-if="item.quantitat && item.unitat">
                ({{ item.quantitat }} {{ item.unitat }})
              </span>
              <span v-else-if="item.comptador > 1" class="text-gray-500 text-sm">
                ({{ item.comptador }} plats)
              </span>
            </label>
          </li>
        </ul>
      </div>
      
      <div class="mt-6 flex justify-center space-x-4">
        <button 
          @click="compartirLlista" 
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Compartir llista
        </button>
        <button 
          @click="reiniciarLlista" 
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
          Reiniciar llista
        </button>
      </div>
    </div>
    
    <div v-else class="text-center py-8">
      <p class="text-gray-500">Carregant llista de compra...</p>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { serveiLlistaCompra } from './servei_llista_compra';

const props = defineProps({
llistaCompra: {
  type: Object,
  required: true
}
} );

const emit = defineEmits(['tancar', 'actualitzar']);

// Mètodes
function esItemComprat(categoria, index) {
return serveiLlistaCompra.esItemComprat(categoria, index);
}

function marcarItem(categoria, index, comprat) {
serveiLlistaCompra.marcarItem(categoria, index, comprat);
emit('actualitzar');
}

function compartirLlista() {
serveiLlistaCompra.compartirLlistaCompra();
}

function reiniciarLlista() {
if (confirm('Estàs segur que vols reiniciar la llista de compra?')) {
  serveiLlistaCompra.reiniciarItemsComprats();
  emit('actualitzar');
}
}
</script>

<style scoped>
/* Estils específics del component */
</style>
