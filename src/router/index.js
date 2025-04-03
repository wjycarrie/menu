import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/what-to-eat'
  },
  {
    path: '/what-to-eat',
    name: 'WhatToEat',
    component: () => import('../views/WhatToEat.vue')
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/Calendar.vue')
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/Menu.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 