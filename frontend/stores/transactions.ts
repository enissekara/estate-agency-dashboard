import { defineStore } from 'pinia'

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    summary: null as any,
    transactions: [] as any[],
    loading: false,
  }),

  actions: {
    async fetchDashboard() {
      this.loading = true
      try {
        const res = await fetch('http://localhost:3001')
        const data = await res.json()

        this.summary = data.summary
        this.transactions = data.recentTransactions
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async nextStage(id: string) {
      await fetch(`http://localhost:3001/transactions/${id}/next-stage`, {
        method: 'PATCH',
      })
      await this.fetchDashboard()
    },

    async reset() {
      await fetch('http://localhost:3001/reset', {
        method: 'POST',
      })
      await this.fetchDashboard()
    },
  },
})