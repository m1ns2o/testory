import { createMemoryHistory, createRouter } from 'vue-router'
import Test from '@renderer/views/Test.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Test,
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
