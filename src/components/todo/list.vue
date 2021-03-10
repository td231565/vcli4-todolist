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
    <div v-for="dateList in list" :key="dateList.date">
      <p v-if="dateList.date !== todayDate"
        class="gray mt-2 mb-0"
        >{{dateList.date}} {{getDayNameString(new Date(dateList.date))}}</p>
      <li v-for="(item, idx) in dateList.content" :key="item.id"
        class="list-item fx fx-jsb fx-aic bd-bottom bd-gray p-1"
        draggable="true"
        @dragstart="getDragStartIndex(idx, dateList)"
        @dragover.prevent="getDragoverIndex(idx, dateList)">
        <div>
          <input type="checkbox" class="mr-1" @change="switchItemChecktodoState(item.id)" :checked="item.isDone" />
          <span v-if="!item.isEdit"
            class="pointer"
            :class="{done: item.isDone}"
            @click="switchEditItemText(item.id, 'on')">{{item.text}}</span>
          <input v-else
            type="text"
            v-model="item.text"
            @blur="switchEditItemText(item.id, 'off')"
            @keyup.enter="switchEditItemText(item.id, 'off')" />
        </div>
        <button class="btn btn-error ml-1" @click="removeItem(dateList, idx)">REMOVE</button>
      </li>
    </div>
  </ul>
</template>

<script>
import { reactive, computed, toRefs } from 'vue'
import Helper from '@/common/utils/helper.js'

export default {
  name: 'TodoList',
  setup () {
    const todayDate = computed(() => Helper.getDateString(new Date()))
    const todayDay = computed(() => getDayNameString(new Date()))
    const getDayNameString = (date) => {
      return new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(date)
    }
    // Todo
    const todoState = reactive({
      list: [],
      inputText: '',
      selectedTodoId: 0,
      currentTodoItem: computed(() => {
        let target = null
        for (let datelist of todoState.list) {
          for (let item of datelist.content) {
            if (item.id === todoState.selectedTodoId) {
              target = item
              break
            }
          }
        }
        return target
      })
    })
    const todoStateRefs = toRefs(todoState)
    // ADD
    const addItem = () => {
      const { list, inputText } = todoState
      if (!inputText) { return }
      const todaysList = list.find(dateList => dateList.date === Helper.getDateString(new Date()))
      const newTodo = {
        id: new Date().valueOf(),
        text: inputText,
        isDone: false,
        isEdit: false
      }
      if (todaysList) {
        todaysList.content.unshift(newTodo)
      } else {
        todoState.list.unshift({
          date: Helper.getDateString(new Date()),
          content: [newTodo]
        })
      }
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
    const removeItem = (dateList, idx) => {
      dateList.content.splice(idx, 1)
    }
    // DRAG
    const dragState = reactive({
      dragIdx: 0,
      dragList: null,
      targetIdx: 0,
      targetList: null
    })
    const getDragStartIndex = (idx, dateList) => {
      dragState.dragIdx = idx
      dragState.dragList = dateList
    }
    const getDragoverIndex = (idx, dateList) => {
      dragState.targetIdx = idx
      dragState.targetList = dateList
    }
    const setDragItem = () => {
      const {dragIdx, dragList, targetIdx, targetList} = dragState
      const dragItem = dragList.content.splice(dragIdx, 1)[0]
      targetList.content.splice(targetIdx + 1, 0, dragItem)
    }

    const getLocalData = () => {
      let pureData = localStorage.getItem('todolist')
      if (pureData) {
        todoState.list = JSON.parse(pureData)
      }
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
      getDayNameString,
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
