import { createRouter, createWebHashHistory } from 'vue-router'

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
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/Menu.vue')
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/Calendar.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory('/menu/'),
  routes
})

export default router 