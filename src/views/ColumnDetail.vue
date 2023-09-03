<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
    <button class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block" @click="loadMorePage"
      v-if="!isLastPage">
      加载更多
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useColumnStore } from '../store/column'
import { usePostStore } from '../store/post'
import { useUserStore } from '../store/user'
import PostList from '../components/PostList.vue'
import { addColumnAvatar } from '../helper'
import useLoadMore from '../hooks/useLoadMore2'
import { PostProps } from '../store'
export default defineComponent({
  components: {
    PostList
  },
  setup() {
    const route = useRoute()
    const columnStore = useColumnStore()
    const userStore = useUserStore()
    const postStore = usePostStore()
    // 为了让 computed 响应对应的变化，添加响应式对象
    const currentId = ref(route.params.id as string)
    onMounted(() => {
      // store.dispatch('fetchColumn', currentId.value)
      columnStore.fetchColumn(currentId.value)
      postStore.fetchPosts({ cid: currentId.value })
      // store.dispatch('fetchPosts', currentId.value)
    })
    // 检测变化
    watch(() => route.params, (toParams) => {
      // 确保要变化的路径是进入到用户的专栏
      // 判断 跳转的 ID 是否存在
      const jumpId = toParams && toParams.id
      const column = userStore.data?.column
      if (jumpId && column && (jumpId === column)) {
        // 重新发送请求，在 store 中有对应的缓存设置
        columnStore.fetchColumn(jumpId)
        // store.dispatch('fetchColumn', jumpId)
        postStore.fetchPosts({ cid: jumpId })
        // store.dispatch('fetchPosts', { cid: jumpId })
        // 重新赋值，这样 computed 会变化
        currentId.value = toParams.id as string
      }
    })
    const column = computed(() => {
      const selectColumn = columnStore.getColumnById(currentId.value)
      if (selectColumn) {
        addColumnAvatar(selectColumn, 100, 100)
      }
      return selectColumn
    })
    // 用计算属性监视vuex中属性变化来实现依赖属性的更新
    const list = computed(() => postStore.getPostsByCid(currentId.value))
    const total = computed(() => postStore.getPostsCountByCid(currentId.value))
    const currentPage = computed(() => postStore.getPostsCurrentPageByCid(currentId.value))
    const { loadMorePage, isLastPage } = useLoadMore(postStore, 'fetchPosts', { currentPage, total, cid: currentId.value })
    return {
      column,
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
