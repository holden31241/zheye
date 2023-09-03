import { defineStore } from 'pinia'

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

export interface GlobalStatusProps {
  error: GlobalErrorProps;
  loading: boolean;
}

export const useGlobalStore = defineStore('global', {
  state: () : GlobalStatusProps => {
    return {
      error: { status: false },
      loading: false
    }
  },
  actions: {
    setLoading(status: boolean) {
      this.loading = status
    },
    setError(e: GlobalErrorProps) {
      this.error = e
    }
  }
})
