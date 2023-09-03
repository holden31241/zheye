<template>
  <div class="row">
    <!-- bootstrap -->
    <div v-for="column in columnList" :key="column._id" class="col-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border border-light my-3" >
          <h5 class="card-title">{{column.title}}</h5>
          <p class="card-text text-left">{{column.description}}</p>
          <router-link :to="`/column/${column._id}`" class="btn btn-outline-primary">进入专栏</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent, PropType, computed } from 'vue'
import { ColumnProps } from '../store'
import { addColumnAvatar } from '../helper'

export default defineComponent({
  name: 'ColumnList',
  // interface需要写在外面
  props: {
    list: {
      // PropType<T> 用于类型推论，使用 vue 默认的 Array 构造函数 ，只能确定list是一个数组类型，
      // 但是如果使用  PropType<ColumnProps[]> 这个时候，list 就变成一个 ColumnProps 的数组，
      type: Array as PropType<ColumnProps[]>,
      required: true
    }
  },
  setup(props) {
    const columnList = computed(() => {
      return props.list.map(column => {
        addColumnAvatar(column, 50, 50)
        return column
      })
    })
    return {
      columnList
    }
  }
})
</script>
<style scoped>
.card-body img {
  width: 50px;
  height: 50px;
}
</style>
