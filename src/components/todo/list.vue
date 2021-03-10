<template>
  <header class="fx fx-jsb fx-aie mb-3">
    <h1 class="m-0">Todo List</h1>
    <span class="gray">{{todayDate}} {{todayDay}}</span>
  </header>
  <!-- Input -->
  <div class="mb-2">
    <input
      type="text"
      class="input"
      v-model.trim="inputText"
      placeholder="type your todo"
      @keyup.enter="addItem" />
    <button class="btn btn-primary bd-circle ml-1" @click="addItem">ADD</button>
  </div>
  <!-- List -->
  <ul class="" @drop="setDragItem" @dragover.prevent @dragenter.prevent>
    <li v-for="(item, idx) in list" :key="item.id"
      class="list-item fx fx-jsb fx-aic bd-bottom bd-gray p-1"
      draggable="true"
      @dragstart="getDragStartIndex(idx)"
      @dragover.prevent="getDragoverIndex(idx)">
      <div>
        <input type="checkbox" class="mr-1" @change="switchItemChecktodoState(item.id)" />
        <span v-if="!item.isEdit"
          class="pointer"
          :class="{done: item.isDone}"
          @click="switchEditItemText(item.id, 'on')">{{ item.text }}</span>
        <input v-else
          type="text"
          v-model="item.text"
          @blur="switchEditItemText(item.id, 'off')"
          @keyup.enter="switchEditItemText(item.id, 'off')" />
      </div>
      <div>
        <span>{{item.time}}</span>
        <button class="btn btn-error ml-1" @click="removeItem(item.id)">REMOVE</button>
      </div>
    </li>
  </ul>
</template>

<script>
import { reactive, computed, toRefs } from 'vue'
import Helper from '@/common/utils/helper.js'

export default {
  name: 'TodoList',
  setup () {
    // Declare
    const todayDate = computed(() => Helper.getDateString(new Date()))
    const todayDay = computed(() => new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(new Date()))
    const todoState = reactive({
      list: [],
      inputText: '',
      selectedTodoId: 0,
      currentTodoItem: computed(() => todoState.list.find(item => item.id === todoState.selectedTodoId))
    })
    const todoStateRefs = toRefs(todoState)
    // ADD
    const addItem = () => {
      const { list, inputText } = todoState
      if (!inputText) { return }
      todoState.list.unshift({
        id: list.length + 1,
        text: inputText,
        time: Helper.getDateString(new Date()),
        isDone: false,
        isEdit: false
      })
      todoState.inputText = ''
    }
    // SELECT
    const selectItem = (id) => {
      todoState.selectedTodoId = id
    }
    // UPDATE STATE
    const switchItemChecktodoState = (id) => {
      selectItem(id)
      todoState.currentTodoItem.isDone = !todoState.currentTodoItem.isDone
    }
    // UPDATE TEXT
    const switchEditItemText = (id, state) => {
      selectItem(id)
      todoState.currentTodoItem.isEdit = state === 'on'
    }
    // DELETE
    const removeItem = (id) => {
      todoState.list = todoState.list.filter(item => item.id !== id)
    }
    // DRAG
    const dragState = reactive({
      dragIdx: 0,
      targetIdx: 0
    })
    const getDragStartIndex = (idx) => {
      dragState.dragIdx = idx
    }
    const getDragoverIndex = (idx) => {
      dragState.targetIdx = idx
    }
    const setDragItem = () => {
      const dragItem = todoState.list.splice(dragState.dragIdx, 1)[0]
      todoState.list.splice(dragState.targetIdx, 0, dragItem)
    }

    const getLocalData = () => {
      let pureData = localStorage.getItem('todolist')
      todoState.list = JSON.parse(pureData)
    }
    getLocalData()
    const saveData = () => {
      const { list } = todoState
      localStorage.setItem('todolist', JSON.stringify(list))
    }
    window.addEventListener('beforeunload', saveData)

    // Hooks
    // onMounted(() => {
    //   console.log(`%conMounted`, 'background:#ffd56b;color:#f53b22')
    // })
    // onUpdated(() => {
    //   console.log(`%conUpdated`, 'background:#163970;color:#fff')
    // })
    // onUnmounted(() => {
    //   console.log(`%conUnmounted`, 'background:#f53b22;color:#fff')
    //   saveData()
    // })

    // 最後回傳出去使用
    return {
      todayDate,
      todayDay,
      ...todoStateRefs,
      addItem,
      switchItemChecktodoState,
      switchEditItemText,
      removeItem,
      getDragStartIndex,
      getDragoverIndex,
      setDragItem
    }
  }
} 
</script>

<style lang="scss" scoped>
.done {
  text-decoration: line-through;
  color: #ccc;
}
.list-item {
  transition: all ease 0.4s;
  &:hover {
    background-color: rgba(#73c2be, 0.3);
  }
}
</style>
