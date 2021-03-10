import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/todolist',
    name: 'TodoList',
    component: () => import(/* webpackChunkName: "List" */ '@/views/TodoList.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
