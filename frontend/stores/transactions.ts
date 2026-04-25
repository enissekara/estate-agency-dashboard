import { defineStore } from 'pinia'

const API_BASE_URL = 'https://estate-agency-dashboard.onrender.com'

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    summary: {
      activeTransactions: 0,
      completedThisMonth: 0,
      agencyRevenue: 0,
      agentPayouts: 0,
    } as any,
    transactions: [] as any[],
    loading: false,
  }),

  actions: {
    async fetchDashboard() {
      this.loading = true

      try {
        const res = await fetch(`${API_BASE_URL}/summary`, {
          cache: 'no-store',
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch dashboard: ${res.status}`)
        }

        const data = await res.json()

        this.summary = data.summary ?? {
          activeTransactions: 0,
          completedThisMonth: 0,
          agencyRevenue: 0,
          agentPayouts: 0,
        }

        this.transactions = data.recentTransactions ?? []
      } catch (err) {
        console.error('Dashboard fetch error:', err)
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