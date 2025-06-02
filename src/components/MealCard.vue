<template>
  <div
    class="rounded-2xl p-2 shadow-md text-center text-sm"
    :style="{ backgroundColor: bgColor }"
  >
    <div
      class="w-16 h-16 mx-auto bg-no-repeat bg-center bg-contain"
      :style="{ backgroundImage: `url(${iconPath})` }"
    ></div>
    <div class="mt-2 font-semibold text-xs">{{ meal.nom }}</div>
  </div>
</template>

<script setup>
defineProps({
  meal: Object
})

const bgColors = {
  Carn: '#F26D6D',
  Peix: '#7DCFF2',
  Llegums: '#F5C36B',
  Ous: '#FFF07C',
  Verdures: '#A2D39C',
  Carbohidrats: '#F5E5B8',
  'Proteic vegetal': '#F7B7B7',
  Altres: '#DCDCDC'
}

const bgColor = bgColors[meal.categoria_1] || '#DCDCDC'
const iconPath = `/icons/${meal.nom_icona || 'sample_icon.png'}`
</script>
