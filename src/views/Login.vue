<template>
  <div class="login-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">登录到者也</h5>
    <!-- 触发子组件emit事件 -->
    <validate-form @form-submit="onFormSubmit">
      <!-- 默认插槽 -->
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <!-- placeholder:文本框默认内容；type:规定input输入内容类型 -->
        <validate-input
          :rules="emailRules" v-model="emailVal"
          placeholder="请输入邮箱地址"
          type="text"
          ref="inputRef"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="passwordVal"
        />
      </div>
      <!-- 具名插槽，#submit 相当于 v-slot='submit' -->
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">登录</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import createMessage from '../components/createMessage'
import { useUserStore } from '../store/user'

export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup() {
    const emailVal = ref('')
    const router = useRouter()
    const store = useStore()
    const userStore = useUserStore()
    // 定义判断规则
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const passwordVal = ref('')
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    // emit事件返回结果
    const onFormSubmit = async (result: boolean) => {
      if (result) {
        // const payload = {
        //   email: emailVal.value,
        //   password: passwordVal.value
        // }
        // store.dispatch('loginAndFetch', payload).then(data => {
        //   createMessage('登录成功 2秒后跳转首页', 'success', 2000)
        //   setTimeout(() => {
        //     router.push('/')
        //   }, 2000)
        // }).catch(e => {
        //   console.log(e)
        // })
        try {
          await userStore.login(emailVal.value, passwordVal.value)
          await userStore.fetchCurrentUser()
          createMessage('登录成功 2秒后跳转首页', 'success', 2000)
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } catch (error) {
          console.log(error)
        }
      }
    }
    return {
      emailRules,
      emailVal,
      passwordVal,
      passwordRules,
      onFormSubmit
    }
  }
})
</script>
