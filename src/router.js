import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => {
        if (WEBUI) {
          return import('@/components/receive.vue')
        }
        return import('@/components/landing.vue')
      }
    },
    {
      path: '/send',
      component: () => import('@/components/send.vue')
    },
    {
      path: '/receive',
      component: () => import('@/components/receive.vue')
    }
  ]
})

export default router
