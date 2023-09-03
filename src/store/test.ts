import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'
import { ColumnProps, ResponseType } from '../store'

interface TestProps {
  data: ColumnProps[];
  total: number;
}
// 最好是用 use 开头

export const useTestStore = defineStore('test', {
  state: (): TestProps => {
    return {
      data: [],
      total: 0
    }
  },
  getters: {
    doubleTotal: (state) => {
      return state.total * 2
    },
    doublePlus(): number {
      return this.doubleTotal + 1
    },
    getDataById: (state) => {
      return (id: string) => state.data.find(column => column._id === id)
    }
  },
  actions: {
    increaseTotal() {
      this.total++
    },
    async fetchColumns(params: any = {}) {
      const { currentPage = 1, pageSize = 3 } = params
      const { data } = await axios.get<ResponseType<{ count: number; list: ColumnProps[] }>>(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`)
      const { count, list } = data.data
      this.$patch({
        total: count,
        data: list
      })
      return list
    }
  }
})

export const useTest2Store = defineStore('test2', () => {
  const total = ref(0)
  const data = ref<ColumnProps[]>([])
  const doubleTotal = computed(() => total.value * 2)
  const fetchColumns = async (params: any = {}) => {
    const { currentPage = 1, pageSize = 3 } = params
    const { data: rawData } = await axios.get<ResponseType<{ count: number; list: ColumnProps[] }>>(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`)
    const { count, list } = rawData.data
    total.value = count
    data.value = list
    return list
  }
  return {
    total,
    data,
    doubleTotal,
    fetchColumns
  }
})
