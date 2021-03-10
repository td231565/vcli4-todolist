<template>
  <div class="w-80 m-auto mt-4 p-4 bg-white list shadow">
    <List />
  </div>
</template>

<script>
import List from '@/components/todo/list.vue'

export default {
  name: 'TodoList',
  components: {
    List
  }
}
</script>

<style lang="scss" scoped>
.list {
  min-height: 92vh;
  border-radius: 0 0 10px 10px;
  border-top: 10px solid #00918a;
}

.shadow {
  box-shadow: 0 8px 15px #818181;
}
</style>
