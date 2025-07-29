import './assets/main.css'
import ui from '@nuxt/ui/vue-plugin'
import './assets/main.css'
import router from './router'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(ui).use(router).mount('#app')
