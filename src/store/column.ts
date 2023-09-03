import { defineStore } from 'pinia'
import axios from 'axios'
import { ResponseType, ImageProps, ListDictType, ListResType, ListReqType } from './utils'
import { arrToObj, objToArr } from '../helper'

export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}

export interface GlobalColumnsProps {
  data: ListDictType<ColumnProps>;
  currentPage: number;
  total: number;
}

export const useColumnStore = defineStore('column', {
  state: ():GlobalColumnsProps => {
    return {
      data: {},
      currentPage: 0,
      total: 0
    }
  },
  actions: {
    async fetchColumns(params: ListReqType = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      if (this.currentPage < currentPage) {
        const { data } = await axios.get<ListResType<ColumnProps>>(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`)
        const { count, list } = data.data
        this.$patch({
          currentPage,
          total: count,
          data: { ...this.data, ...arrToObj(list) }
        })
      }
    },
    async fetchColumn(cid: string) {
      const cIdArr = Object.keys(this.data)
      if (!cIdArr.includes(cid)) {
        const { data: rawData } = await axios.get<ResponseType<ColumnProps>>(`/columns/${cid}`)
        const { data } = rawData
        this.data[data._id] = data
      }
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.data)
    },
    getColumnById: (state) => (id: string) => {
      return state.data[id]
    }
  }
})
