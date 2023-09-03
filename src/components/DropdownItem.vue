<template>
  <li
    class="dropdown-option"
    :class="{'is-disabled': disabled}"
  >
  <!-- 绑定样式，可扩展性 -->
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style>
.dropdown-option.is-disabled * {
  color: #6c757d;
  /* 鼠标不能点击 */
  pointer-events: none;
  background-color: transparent;
}
</style>
