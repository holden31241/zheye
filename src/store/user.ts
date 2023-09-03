import { defineStore } from 'pinia'
import axios from 'axios'
import { ImageProps, ResponseType } from './utils'

export interface UserDataProps {
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}

export interface UserProps {
  token: string;
  isLogin: boolean;
  data: UserDataProps | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserProps => {
    return {
      token: localStorage.getItem('token') || '',
      isLogin: false,
      data: null
    }
  },
  actions: {
    async login(email: string, password: string) {
      const payload = {
        email,
        password
      }
      const { data } = await axios.post<ResponseType>('/user/login', payload)
      const { token } = data.data
      this.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout() {
      this.token = ''
      this.isLogin = false
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },
    async fetchCurrentUser() {
      const { data } = await axios.get<ResponseType>('/user/current')
      this.isLogin = true
      this.data = { ...data.data }
    }
  }
})
