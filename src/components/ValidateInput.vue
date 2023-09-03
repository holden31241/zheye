<template>
  <div class="validate-input-container pb-3">
    <!-- 绑定样式 -->
    <input
      v-if="tag !== 'textarea'"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
    >
    <!-- v-bind="$attrs":父组件传入的，不被props接收的数据，会作为HTML节点的属性，将这些属性通过$attrs接收，并绑定在input元素上  -->
    <!-- blur事件，dom元素失去焦点时触发 -->
    <textarea
      v-else
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
    >
    </textarea>
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted, computed } from 'vue'
// 导入emitter监听器
import { emitter } from './ValidateForm.vue'
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
interface RuleProp {
  type: 'required' | 'email' | 'custom';
  message: string;
  validator?: () => boolean;
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
  props: {
    // rules为一个RulesProp的数组类
    rules: Array as PropType<RulesProp>,
    // 父组件传来的v-modal值
    modelValue: String,
    // 确认输入框类型，标题或内容
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  // 父组件传来的节点属性会默认被组件的根节点接收，通过 inheritAttrs: false 来禁止此行为
  inheritAttrs: false,
  setup(props, context) {
    const inputRef = reactive({
      // 监测父组件传入的v-modal值
      // computed重构,调用setter
      val: computed({
        get: () => props.modelValue || '',
        set: val => {
          // vue3 自定义组件中v-modal写法，val为要更新到的新值，modelVal需要在props中定义
          context.emit('update:modelValue', val)
        }
      }),
      error: false,
      message: ''
    })
    // 实现规则
    const validateInput = () => {
      if (props.rules) {
        // every函数用来判断数组中每一项是否通过指定函数，该函数结果应该返回一个布尔值
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              // 正则表达式.test()方法，查看指定的字符串是否匹配
              break
              // 自定义规则
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    onMounted(() => {
      // 通过emitter.emit发送消息，将validateInput发送出去
      emitter.emit('form-item-created', validateInput)
    })
    return {
      inputRef,
      validateInput
    }
  }
})
</script>
