import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import router from './router'
import store from './store'
import { useGlobalStore } from './store/global'

import App from './App.vue'
import 'easymde/dist/easymde.min.css'

const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(store)
app.use(pinia)
const globalStore = useGlobalStore()
// 编辑路径前缀
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// axios拦截器
axios.interceptors.request.use(config => {
  // store.commit('setLoading', true)
  // store.commit('setError', { status: false, message: '' })
  // ---------------------------------------
  // get 请求，添加到 url 中
  config.params = { ...config.params, icode: '9E5838CB89AB560B' }
  if (config.data instanceof FormData) {
    config.data.append('icode', '9E5838CB89AB560B')
  } else {
    // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: '9E5838CB89AB560B' }
  }
  // -----------------------------------
  // 发送请求时设置loading为true
  globalStore.setLoading(true)
  // 发送请求前需要将全局变量error置空
  globalStore.setError({ status: false, message: '' })
  return config
})
axios.interceptors.response.use(config => {
  setTimeout(() => {
    // store.commit('setLoading', false)
    // 请求响应后，loading设置为false
    globalStore.loading = false
  }, 1000)
  return config
}, e => {
  // 错误拦截器
  const { error } = e.response.data
  globalStore.error = { status: true, message: error }
  // 错误拦截后，loading设置为false
  globalStore.loading = false
  // store.commit('setError', { status: true, message: error })
  // store.commit('setLoading', false)
  return Promise.reject(e.response.data)
})
app.mount('#app')
