import { defineStore } from 'pinia'
import axios from 'axios'
import { ResponseType, ListResType, ListDictType, ImageProps, ListReqType } from './utils'
import { arrToObj, objToArr } from '../helper'
import { UserDataProps } from './user'

export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string | UserDataProps;
  isHTML?: boolean;
}

export interface GlobalPostsProps {
  data: ListDictType<PostProps>;
  loadedColumns: ListDictType<{total: number; currentPage: number}>;
}

export const usePostStore = defineStore('post', {
  state: (): GlobalPostsProps => {
    return {
      data: {},
      loadedColumns: {}
    }
  },
  actions: {
    async fetchPosts(params: ListReqType = {}) {
      const { cid = '', currentPage = 1, pageSize = 5 } = params
      const { loadedColumns } = this
      // 1 没有加载过这个专栏的列表
      // 2 已经加载的页数要小于希望加载的页数
      const loadedCurrentPage = (loadedColumns[cid] && loadedColumns[cid].currentPage) || 0
      if (!Object.keys(loadedColumns).includes(cid) || loadedCurrentPage < currentPage) {
        const { data } = await axios.get<ListResType>(`/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`)
        const { count, list } = data.data
        this.data = { ...this.data, ...arrToObj(list) }
        this.loadedColumns[cid] = {
          total: count,
          currentPage
        }
      }
    },
    async fetchPost(id: string) {
      const certainPost = this.data[id]
      if (!certainPost || !certainPost.content) {
        const { data: rawData } = await axios.get<ResponseType<PostProps>>(`/posts/${id}`)
        const { data } = rawData
        this.data[data._id as string] = data
        return data
      } else {
        return certainPost
      }
    },
    async updatePost(id: string, payload: PostProps) {
      const { data: rawData } = await axios.patch<ResponseType<PostProps>>(`/posts/${id}`, payload)
      const { data } = rawData
      this.data[data._id as string] = data
    },
    async createPost(payload: PostProps) {
      const { data: rawData } = await axios.post<ResponseType<PostProps>>('/posts/', payload)
      const { data } = rawData
      this.data[data._id as string] = data
    },
    async deletePost(id: string) {
      const { data: rawData } = await axios.delete<ResponseType<PostProps>>(`/posts/${id}`)
      const { data } = rawData
      delete this.data[data._id as string]
      return data
    }
  },
  getters: {
    getCurrentPost: (state) => (id: string) => {
      return state.data[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.data).filter(post => post.column === cid).sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      })
    },
    getPostsCountByCid: (state) => (cid: string) => {
      if (state.loadedColumns[cid]) {
        return state.loadedColumns[cid].total
      } else {
        return 0
      }
    },
    getPostsCurrentPageByCid: (state) => (cid: string) => {
      if (state.loadedColumns[cid]) {
        return state.loadedColumns[cid].currentPage
      } else {
        return 0
      }
    }

  }
})
