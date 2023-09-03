<template>
  <form class="validate-form-container">
    <!-- 默认插槽 -->
    <slot name="default"></slot>
    <!-- @click.prevent 阻止默认事件 -->
    <div class="submit-area" @click.prevent="submitForm">
      <!-- 具名插槽 -->
      <slot name="submit">
        <!-- 插槽默认内容 -->
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
// 类型别名，将() => boolean 函数别名为ValidateFunc
type ValidateFunc = () => boolean
// mitt传入的事件类型与名称需要一致
type Events = { 'form-item-created': ValidateFunc }
// mitt() 实现全局事件总线vue3版
export const emitter = mitt<Events>()
export default defineComponent({
  // emit事件
  emits: ['form-submit'],
  setup(props, context) {
    // ValidateFunc函数数组
    let funcArr: ValidateFunc[] = []
    // emit事件触发的函数
    const submitForm = () => {
      // 需要先map,every在遇到错误时会直接停止，map将数组中每一项转化为函数结果，再通过every判断是否每一项都为true
      const result = funcArr.map(func => func()).every(result => result)
      context.emit('form-submit', result)
    }
    // ?为可选链运算符，在func为null或者undefined时也不会报错，相当于func&&func:ValidateFunc
    const callback = (func: ValidateFunc) => {
      if (func) {
        funcArr.push(func)
      }
    }
    // 通过emitter.on接收消息，接收传来的validateInput函数
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      // 关闭emitter
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
</script>
