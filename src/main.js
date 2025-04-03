import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 导入 Vant
import vant from 'vant'
import 'vant/lib/index.css'

// 导入 v-calendar
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)
app.use(vant)
app.use(VCalendar)

// 挂载应用
app.mount('#app')
