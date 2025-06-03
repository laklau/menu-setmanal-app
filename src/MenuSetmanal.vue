<template>
<div class="min-h-screen bg-green-200" style="background-color: #b1f090;">
  <header class="p-4 text-center">
    <h1 class="text-4xl font-bold mb-4 font-fugaz">Menú setmanal</h1>
    <div class="flex justify-center space-x-4 mb-4">
      <button 
        @click="generarNouMenu" 
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Generar nou menú
      </button>
      <button 
        @click="mostrarLlistaCompra" 
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Veure llista de compra
      </button>
    </div>
  </header>

  <main class="container mx-auto p-4">
    <!-- Taula del menú setmanal -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-green-100">
            <th class="py-3 px-4 text-left font-fugaz uppercase">Dia</th>
            <th class="py-3 px-4 text-left font-fugaz uppercase">Dinar</th>
            <th class="py-3 px-4 text-left font-fugaz uppercase">Sopar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dia in diesSetmana" :key="dia" class="border-b border-gray-200 hover:bg-gray-50">
            <td class="py-4 px-4 font-fugaz uppercase">{{ dia }}</td>
            <td class="py-4 px-4">
              <div v-if="menuActual && getDiaMenu(dia)?.apats?.dinar" class="flex items-center">
                <div class="w-12 h-12 mr-3 flex-shrink-0">
                  <img 
                    :src="getIconaPlat(getDiaMenu(dia).apats.dinar)" 
                    :alt="getDiaMenu(dia).apats.dinar.nom"
                    class="w-full h-full object-contain"
                  >
                </div>
                <div class="flex-grow">
                  <p class="font-nunito">{{ getDiaMenu(dia).apats.dinar.nom }}</p>
                  <button 
                    @click="obrirDetallPlat(getDiaMenu(dia).apats.dinar)" 
                    class="text-sm text-blue-600 hover:underline mr-2"
                  >
                    Detalls
                  </button>
                  <button 
                    @click="obrirSubstitucioPlat(dia, 'dinar')" 
                    class="text-sm text-green-600 hover:underline"
                  >
                    Substituir
                  </button>
                </div>
              </div>
              <div v-else class="text-gray-400">
                Carregant...
              </div>
            </td>
            <td class="py-4 px-4">
              <div v-if="menuActual && getDiaMenu(dia)?.apats?.sopar" class="flex items-center">
                <div class="w-12 h-12 mr-3 flex-shrink-0">
                  <img 
                    :src="getIconaPlat(getDiaMenu(dia).apats.sopar)" 
                    :alt="getDiaMenu(dia).apats.sopar.nom"
                    class="w-full h-full object-contain"
                  >
                </div>
                <div class="flex-grow">
                  <p class="font-nunito">{{ getDiaMenu(dia).apats.sopar.nom }}</p>
                  <button 
                    @click="obrirDetallPlat(getDiaMenu(dia).apats.sopar)" 
                    class="text-sm text-blue-600 hover:underline mr-2"
                  >
                    Detalls
                  </button>
                  <button 
                    @click="obrirSubstitucioPlat(dia, 'sopar')" 
                    class="text-sm text-green-600 hover:underline"
                  >
                    Substituir
                  </button>
                </div>
              </div>
              <div v-else class="text-gray-400">
                Carregant...
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>

  <!-- Modal de detall del plat -->
  <div v-if="modalDetallObert" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold font-fugaz">{{ platDetall.nom }}</h2>
        <button @click="tancarDetallPlat" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold mb-2">Ingredients</h3>
          <ul class="list-disc pl-5">
            <li v-for="(ingredient, index) in platDetall.ingredients" :key="index" class="mb-1">
              {{ ingredient.nom }}
              <span v-if="ingredient.quantitat">
                ({{ ingredient.quantitat }} {{ ingredient.unitat }})
              </span>
            </li>
          </ul>
          
          <h3 class="text-lg font-semibold mt-4 mb-2">Instruccions</h3>
          <ol class="list-decimal pl-5">
            <li v-for="(instruccio, index) in platDetall.instruccions" :key="index" class="mb-1">
              {{ instruccio }}
            </li>
          </ol>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-2">Informació nutricional</h3>
          <div class="bg-gray-100 p-4 rounded-lg">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <p class="text-gray-600">Calories:</p>
                <p class="font-bold">{{ platDetall.valors_nutricionals.calories }} kcal</p>
              </div>
              <div>
                <p class="text-gray-600">Proteïnes:</p>
                <p class="font-bold">{{ platDetall.valors_nutricionals.proteines }} g</p>
              </div>
              <div>
                <p class="text-gray-600">Greixos:</p>
                <p class="font-bold">{{ platDetall.valors_nutricionals.greixos }} g</p>
              </div>
              <div>
                <p class="text-gray-600">Carbohidrats:</p>
                <p class="font-bold">{{ platDetall.valors_nutricionals.carbohidrats }} g</p>
              </div>
            </div>
          </div>
          
          <h3 class="text-lg font-semibold mt-4 mb-2">Etiquetes</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(etiqueta, index) in platDetall.etiquetes" 
              :key="index"
              class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
            >
              {{ etiqueta }}
            </span>
          </div>
          
          <div class="mt-4">
            <p class="text-gray-600">Categoria: <span class="font-semibold">{{ platDetall.categoria }}</span></p>
            <p class="text-gray-600">Temporada: <span class="font-semibold">{{ platDetall.temporada.join(', ') }}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de substitució de plat -->
  <div v-if="modalSubstitucioObert" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold font-fugaz">Substituir {{ tipusApatSubstitucio }} de {{ diaSubstitucio }}</h2>
        <button @click="tancarSubstitucioPlat" class="text-gray-500 hover:text-gray-700">
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
          class="border rounded-lg p-4 cursor-pointer hover:bg-green-50"
          @click="seleccionarSubstitut(plat)"
        >
          <div class="flex items-center">
            <div class="w-12 h-12 mr-3 flex-shrink-0">
              <img 
                :src="getIconaPlat(plat)" 
                :alt="plat.nom"
                class="w-full h-full object-contain"
              >
            </div>
            <div class="flex-grow">
              <p class="font-nunito font-semibold">{{ plat.nom }}</p>
              <div class="flex items-center text-sm text-gray-600">
                <span class="mr-2">{{ plat.valors_nutricionals.calories }} kcal</span>
                <span>{{ plat.valors_nutricionals.proteines }}g proteïna</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de llista de compra -->
  <div v-if="modalLlistaCompraObert" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold font-fugaz">Llista de la compra</h2>
        <button @click="tancarLlistaCompra" class="text-gray-500 hover:text-gray-700">
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
              >
              <label :for="'item-' + categoria + '-' + index" class="flex-grow">
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
        
        <div class="mt-6 flex justify-center">
          <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Imprimir llista
          </button>
        </div>
      </div>
      
      <div v-else class="text-center py-8">
        <p class="text-gray-500">Carregant llista de compra...</p>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { serveiPlats } from './servei_plats';

// Estat
const diesSetmana = ['dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte', 'diumenge'];
const menuActual = ref(null);
const llistaCompra = ref(null);

// Estat dels modals
const modalDetallObert = ref(false);
const platDetall = ref({});
const modalSubstitucioObert = ref(false);
const diaSubstitucio = ref('');
const tipusApatSubstitucio = ref('');
const platsSimilars = ref([]);
const modalLlistaCompraObert = ref(false);

// Inicialització
onMounted(async () => {
try {
  // Carregar plats
  await serveiPlats.carregarPlats();
  
  // Intentar carregar menú existent
  const menuExistent = serveiPlats.carregarMenuActual();
  
  if (menuExistent) {
    menuActual.value = menuExistent;
  } else {
    // Generar nou menú si no n'hi ha cap
    generarNouMenu();
  }
} catch (error) {
  console.error('Error en inicialitzar:', error);
}
});

// Mètodes
function generarNouMenu() {
try {
  menuActual.value = serveiPlats.generarNouMenu();
} catch (error) {
  console.error('Error en generar nou menú:', error);
}
}

function getDiaMenu(dia) {
if (!menuActual.value) return null;
return menuActual.value.dies.find(d => d.dia === dia) || null;
}

function getIconaPlat(plat) {
// Ruta a les icones dels plats
return `/assets/icons/${plat.icona || 'default.png'}`;
}

function obrirDetallPlat(plat) {
// Obtenir plat complet amb tots els detalls
const platComplet = serveiPlats.obtenirPlatPerId(plat.id);
if (platComplet) {
  platDetall.value = platComplet;
  modalDetallObert.value = true;
}
}

function tancarDetallPlat() {
modalDetallObert.value = false;
}

function obrirSubstitucioPlat(dia, tipusApat) {
diaSubstitucio.value = dia;
tipusApatSubstitucio.value = tipusApat;

// Obtenir plat actual
const diaMenu = getDiaMenu(dia);
if (diaMenu && diaMenu.apats[tipusApat]) {
  const platActual = serveiPlats.obtenirPlatPerId(diaMenu.apats[tipusApat].id);
  
  // Obtenir plats similars
  platsSimilars.value = serveiPlats.obtenirPlatsSimilars(platActual);
  modalSubstitucioObert.value = true;
}
}

function tancarSubstitucioPlat() {
modalSubstitucioObert.value = false;
}

function seleccionarSubstitut(plat) {
// Substituir el plat al menú
menuActual.value = serveiPlats.substituirPlat(
  diaSubstitucio.value, 
  tipusApatSubstitucio.value, 
  plat
);

// Tancar modal
tancarSubstitucioPlat();
}

function mostrarLlistaCompra() {
// Generar llista de compra
llistaCompra.value = serveiPlats.generarLlistaCompra();
modalLlistaCompraObert.value = true;
}

function tancarLlistaCompra() {
modalLlistaCompraObert.value = false;
}
</script>

<style>
/* Importar fonts */
@import url('https://fonts.googleapis.com/css2?family=Fugaz+One&family=Nunito:wght@400;600;700&display=swap' );

/* Estils personalitzats */
.font-fugaz {
font-family: 'Fugaz One', cursive;
}

.font-nunito {
font-family: 'Nunito', sans-serif;
}
</style>
