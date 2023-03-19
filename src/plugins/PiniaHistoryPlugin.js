import { ref, reactive } from "vue";
export function PiniaHistoryPlugin({ pinia, app, store, options }) {
  if (!options.enabledHistory) return
  const history = reactive([]);
  const future = reactive([])
  const doingHistory = ref(false)

  history.push(JSON.stringify(store.$state))

  const undo = () => {
    if (history.length === 1) return
    doingHistory.value = true
    //we need the poped element
    future.push(history.pop());
    store.$state = JSON.parse(history.at(-1))
    doingHistory.value = false
  }
  const redo = () => {
    const latestState = future.pop()
    if (!latestState) return
    doingHistory.value = true
    history.push(latestState)
    store.$state = JSON.parse(latestState)
    doingHistory.value = false
  }

  //subscribe the store
  store.$subscribe((mutation, state) => {
    if (!doingHistory.value) {
      history.push(JSON.stringify(state))
      //clear the future array
      future.splice(0, future.length)
    }
  })

  return {
    undo, redo
  }
}
