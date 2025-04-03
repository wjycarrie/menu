<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <van-tabbar v-model="active" route>
      <van-tabbar-item name="what-to-eat" to="/what-to-eat" icon="home-o">吃什么</van-tabbar-item>
      <van-tabbar-item name="menu" to="/menu" icon="bars">菜单</van-tabbar-item>
      <van-tabbar-item name="calendar" to="/calendar" icon="calendar-o">日历</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref('what-to-eat')

// 监听路由变化
watch(() => route.path, (newPath) => {
  const pathMap = {
    '/what-to-eat': 'what-to-eat',
    '/menu': 'menu',
    '/calendar': 'calendar'
  }
  active.value = pathMap[newPath] || 'what-to-eat'
}, { immediate: true })
</script>

<style lang="scss">
.app {
  min-height: 100vh;
  background-color: #f7f8fa;
}
</style> 