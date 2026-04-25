import { defineStore } from 'pinia'

const API_BASE_URL = 'https://estate-agency-dashboard.onrender.com'

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
        const res = await fetch(`${API_BASE_URL}/summary`)
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
      await fetch(`${API_BASE_URL}/transactions/${id}/next-stage`, {
        method: 'PATCH',
      })

      await this.fetchDashboard()
    },

    async reset() {
      await fetch(`${API_BASE_URL}/reset`, {
        method: 'POST',
      })

      await this.fetchDashboard()
    },
  },
})