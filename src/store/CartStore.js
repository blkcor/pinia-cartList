import { defineStore, acceptHMRUpdate } from "pinia";
import { groupBy } from 'lodash'
import { useLocalStorage } from '@vueuse/core'
export const useCartStore = defineStore("CartStore", {
  enabledHistory: true,
  //state 
  state: () => {
    return {
      items: useLocalStorage("cartItems", []),
    }
  },
  //actions use actions to avoid mutating directively
  actions: {
    addItems(count, item) {
      for (let i = 0; i < count; i++) {
        this.items.push({ ...item })
      }
    },
    removeItem(name) {
      this.items = this.items.filter((item) => item.name !== name)
    },
    updateItem(after, name) {
      if (after > this.count) {
        this.items.push(this.items.find(item => item.name === name))
      } else {
        this.items.splice(this.items.indexOf(item => item.name === name), 1)
      }
    }
  },
  //getters
  getters: {
    count: (state) => state.items.length,
    isEmpty: (state) => state.count === 0,
    grouped: (state) => groupBy(state.items, item => item.name),
    groupCount: (state) => (name) => state.grouped[name].length,
    total: (state) => state.items.reduce((p, c) => p + c.price, 0)
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}
