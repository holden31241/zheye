<template>
  <!-- teleport 可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去-->
<teleport to="#back">
  <div
    class="d-flex justify-content-center align-items-center h-100 w-100 loading-container"
    :style="{backgroundColor: background || ''}"
  >
    <div class="loading-content">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ text || 'loading'}}</span>
      </div>
      <p v-if="text" class="text-primary small">{{text}}</p>
    </div>
  </div>
</teleport>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    }
  },
  setup() {
    // 创建id为back的新节点，作为挂载loader teleport的节点
    const node = document.createElement('div')
    node.id = 'back'
    document.body.appendChild(node)
    onUnmounted(() => {
      // 卸载node节点
      document.body.removeChild(node)
    })
  }
})
</script>

<style>
.loading-container {
  background: rgba(255, 255, 255, .5);
  /* 层叠等级 */
  z-index: 100;
  /* 固定定位，元素根据浏览器可视区定位 */
  position: fixed;
  top: 0;
  left: 0;
}
.loading-container {
  text-align: center;
}
</style>
