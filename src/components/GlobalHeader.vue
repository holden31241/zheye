<template>
  <!-- nav bootstrap中的自定义组件 -->
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link class="navbar-brand" to="/">者也专栏</router-link>
    <ul v-if="!isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登陆</router-link></li>
      <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
    </ul>
    <ul v-else-if="isLogin && data" class="list-inline mb-0">
      <li class="list-inline-item">
        <!-- 设置两个子组件，dropdown和dropdown-item(！！！注意，两个组件通过slot实现了父子关系，只要组件中包裹了另一个组件，就为父子关系) -->
        <dropdown :title="`你好 ${data.nickName}`">
          <dropdown-item><router-link to="/create" class="dropdown-item">新建文章</router-link></dropdown-item>
          <dropdown-item><router-link :to="`/column/${data.column}`" class="dropdown-item">我的专栏</router-link></dropdown-item>
          <dropdown-item disabled><a href="#" class="dropdown-item">编辑资料</a></dropdown-item>
          <dropdown-item><a href="#" class="dropdown-item" @click.prevent="handleLogout">退出登陆</a></dropdown-item>
          <!-- @click.prevent prevent指阻止默认行为 -->
        </dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import { UserDataProps, useUserStore } from '../store/user'
import { useRouter } from 'vue-router'
import createMessage from '../components/createMessage'

export default defineComponent({
  name: 'GlobalHeader',
  components: {
    Dropdown,
    DropdownItem
  },
  props: {
    data: {
      type: [Object, null] as PropType<UserDataProps | null>,
      required: true
    },
    isLogin: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    const handleLogout = () => {
      userStore.logout()
      createMessage('退出登录成功，2秒后跳转到首页', 'success', 2000)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
    return {
      handleLogout
    }
  }
})
</script>
