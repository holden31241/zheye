import { ComputedRef, computed } from 'vue'
import { Store } from 'pinia'

interface LoadOptions {
  currentPage: ComputedRef<number>;
  total: ComputedRef<number>;
  pageSize?: number;
  [key: string]: any;
}
const useLoadMore = (store: Store<string, any>, actionName: string, options: LoadOptions) => {
  const { currentPage, total, pageSize = 5, ...restOptions } = options
  const requestParams = computed(() => {
    return {
      ...restOptions,
      currentPage: currentPage.value + 1,
      pageSize
    }
  })
  const loadMorePage = () => {
    store[actionName](requestParams.value)
  }
  const isLastPage = computed(() => {
    return Math.ceil(total.value / pageSize) === currentPage.value
  })
  return {
    currentPage,
    loadMorePage,
    isLastPage
  }
}

export default useLoadMore
