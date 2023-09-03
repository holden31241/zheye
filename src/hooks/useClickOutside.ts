import { ref, onMounted, onUnmounted, Ref } from 'vue'
// 将点击外部关闭下拉选项框的代码逻辑 抽象出hook函数
// 类型为Ref<null | HTMLElement>，需要联合类型，否则会类型判断为null
const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutside = ref(false)
  // MouseEvent 鼠标事件类型
  const handler = (e: MouseEvent) => {
    if (elementRef.value) {
      // e.target 事件触发对象，事件目标不一定为dom节点，需要类型断言
      // contains 父节点是否包含子节点，包括本身
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }
  onMounted(() => {
    // 给整个页面绑定事件
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isClickOutside
}

export default useClickOutside
