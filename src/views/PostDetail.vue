<template>
  <div class="post-detail-page">
    <modal title="删除文章" :visible="modalIsVisible"
      @modal-on-close="modalIsVisible = false"
      @modal-on-confirm="hideAndDelete"
    >
      <p>确定要删除这篇文章吗？</p>
    </modal>
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
      <img :src="currentImageUrl" alt="currentPost.title" class="rounded-lg img-fluid my-4" v-if="currentImageUrl">
      <h2 class="mb-4">{{currentPost.title}}</h2>
      <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
        <div class="col">
          <user-profile :user="currentPost.author" v-if="typeof currentPost.author === 'object'"></user-profile>
        </div>
        <span class="text-muted col text-right font-italic">发表于：{{currentPost.createdAt}}</span>
      </div>
      <!-- v-html 标签，用于解析设置带有html标签的文本 -->
      <div v-html="currentHTML"></div>
      <div v-if="showEditArea" class="btn-group mt-5">
        <!-- 如果编辑文章,需要将用户id传递 -->
        <router-link
          type="button"
          class="btn btn-success"
          :to="{name: 'create', query: { id: currentPost._id}}"
        >
          编辑
        </router-link>
        <button type="button" class="btn btn-danger" @click.prevent="modalIsVisible = true">删除</button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue'
import { marked } from 'marked'
import { useRoute, useRouter } from 'vue-router'
// import { GlobalDataProps, PostProps, ImageProps, UserProps, ResponseType } from '../store'
import { usePostStore } from '../store/post'
import { useUserStore, UserDataProps } from '../store/user'
import { ImageProps } from '../store/utils'
import UserProfile from '../components/UserProfile.vue'
import Modal from '../components/Modal.vue'
import createMessage from '../components/createMessage'

export default defineComponent({
  name: 'post-detail',
  components: {
    UserProfile,
    Modal
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const postStore = usePostStore()
    const userStore = useUserStore()
    const modalIsVisible = ref(false)
    const currentId = route.params.id as string
    onMounted(() => {
      postStore.fetchPost(currentId)
      // store.dispatch('fetchPost', currentId)
    })
    const currentPost = computed(() => postStore.getCurrentPost(currentId))
    const currentHTML = computed(() => {
      if (currentPost.value && currentPost.value.content) {
        const { isHTML, content } = currentPost.value
        // 将markdown语法转换为html语法
        return isHTML ? content : marked.parse(content)
      } else {
        return ''
      }
    })
    const showEditArea = computed(() => {
      if (currentPost.value && currentPost.value.author && userStore.isLogin) {
        // 检查授权：文章作者id是否与登陆用户id一致
        const postAuthor = currentPost.value.author as UserDataProps
        return postAuthor._id === userStore.data?._id
      } else {
        return false
      }
    })
    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })
    const hideAndDelete = () => {
      modalIsVisible.value = false
      postStore.deletePost(currentId).then((data) => {
        createMessage('删除成功，2秒后跳转到专栏首页', 'success', 2000)
        setTimeout(() => {
          router.push({ name: 'column', params: { id: data.column } })
        }, 2000)
      })
    }
    return {
      currentPost,
      currentImageUrl,
      currentHTML,
      showEditArea,
      modalIsVisible,
      hideAndDelete
    }
  }
})
</script>
