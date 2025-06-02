<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-6 w-96 relative shadow-lg overflow-y-auto max-h-[90vh]">
      <button class="absolute top-2 right-2" @click="$emit('close')">✕</button>
      <h2 class="text-xl font-bold mb-4">{{ meal.nom }}</h2>
      <div v-if="meal.ingredientes">
        <h3 class="font-semibold mb-1">Ingredients:</h3>
        <ul class="list-disc list-inside mb-3">
          <li v-for="(ingredient, index) in meal.ingredientes.split('\n')" :key="index">{{ ingredient }}</li>
        </ul>
      </div>
      <div v-if="meal.instruccions">
        <h3 class="font-semibold mb-1">Instruccions:</h3>
        <p class="mb-3 whitespace-pre-line">{{ meal.instruccions }}</p>
      </div>
      <div v-if="meal.calories || meal.proteines">
        <h3 class="font-semibold mb-1">Informació nutricional:</h3>
        <p>Calories: {{ meal.calories || '–' }}</p>
        <p>Proteïnes: {{ meal.proteines || '–' }}g</p>
        <p>Greixos: {{ meal.greixos || '–' }}g</p>
        <p>Carbohidrats: {{ meal.carbohidrats || '–' }}g</p>
        <p>Fibra: {{ meal.fibra || '–' }}g</p>
      </div>
      <div v-if="meal.tags">
        <h3 class="font-semibold mt-4 mb-1">Etiquetes:</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in meal.tags.split(',')" :key="tag" class="bg-gray-200 px-2 py-1 rounded-full text-xs">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  meal: Object
})
</script>
