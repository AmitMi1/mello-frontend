import { createApp } from 'vue'
import { VueDragScroll } from 'vue-dragscroll/dist/vue-dragscroll'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import { focusDirective, clickOutside } from './directives'
import { dragscrollNext } from "vue-dragscroll";
// import { format } from 'date-fns'
import 'element-plus/dist/index.css'
import './styles/global.scss'



const app = createApp(App)

app.config.globalProperties.$filters = {

}

app.directive('focus', focusDirective)
app.directive('clickoutside', clickOutside)
app.directive('dragscroll', dragscrollNext);


app.use(router)
app.use(store)
app.use(ElementPlus)
// app.use(format)

app.mount('#app')

