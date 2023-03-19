<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useProductStore } from "./store/ProductStore";
import { useCartStore } from './store/CartStore'
import AppButton from "./components/AppButton.vue";


//data always comes from api that will be stored in the pinia
const productStore = useProductStore()
const cartStore = useCartStore()
productStore.fill()

//subscribe the action
cartStore.$onAction(({
  name,
  store,
  args,
  after,
  onError
}) => {
  if (name === 'addItems') {
    after(() => {
      console.log(args)
    })
    onError((error) => {
      console.log("Hello error", error.message)
    })
  }
})

/* 
  const addToCart = (count, product) => {
  count = parseInt(count);
  //just one mutation
  cartStore.$patch(state => {
    for (let i = 0; i < count; i++) {
      state.items.push(product)
    }
  })
} */
</script>

<template>
  <div class="container">
    <TheHeader />
    <div class="mb-5 flex justify-end">
      <AppButton class="mr-4" @click="cartStore.redo">redo</AppButton>
      <AppButton @click="cartStore.undo">undo</AppButton>
    </div>

    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard v-for="product in productStore.products" :key="product.name" :product="product"
        @addToCart="cartStore.addItems($event, product)" />
    </ul>
  </div>
</template>
