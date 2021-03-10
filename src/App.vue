<template>
  <div class="decorate-background"></div>
  <router-view/>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  setup () {
    const router = useRouter()
    router.push('/todolist')
  }
}
</script>

<style lang="scss">
@import "@/assets/css/index.scss";

.decorate-background {
  width: 95%;
  height: 80vh;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: $primary;
  border-radius: 100%;
  z-index: -9;
}
</style>
