<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTransactionStore } from '../stores/transactions'

const store = useTransactionStore()

const dashboard = computed(() => ({
  summary: store.summary,
  recentTransactions: store.transactions,
}))

onMounted(() => {
  store.fetchDashboard()
})

const nextStage = async (id: string) => {
  await store.nextStage(id)
}

const resetData = async () => {
  await store.reset()
}

const getStageClass = (stage: string) => {
  if (stage === 'completed') return 'badge badge-success'
  if (stage === 'earnest_money') return 'badge badge-warning'
  return 'badge badge-progress'
}

const formatMoney = (value: number | null | undefined) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value ?? 0)
}
</script>

<template>
  <div class="page">
    <div class="container">
      <header class="hero">
        <div>
          <p class="eyebrow">Estate Agency Operations</p>
          <h1>Transaction Management Dashboard</h1>
          <p class="subtitle">
            Track property sales and rentals, monitor transaction stages, and
            review commission distribution for agency and agents.
          </p>
        </div>

        <div class="hero-actions">
          <button class="reset-btn" @click="resetData">
            Restore Initial State
          </button>

          <div class="hero-card">
            <span class="status-dot"></span>
            <span>System Ready</span>
          </div>
        </div>
      </header>

      <section class="stats">
        <div class="stat-card">
          <p class="stat-label">Active Transactions</p>
          <h2>{{ dashboard?.summary?.activeTransactions ?? 0 }}</h2>
          <span class="stat-note">Open transactions in the pipeline</span>
        </div>

        <div class="stat-card">
          <p class="stat-label">Completed This Month</p>
          <h2>{{ dashboard?.summary?.completedThisMonth ?? 0 }}</h2>
          <span class="stat-note">Finalized transaction records</span>
        </div>

        <div class="stat-card">
          <p class="stat-label">Agency Revenue</p>
          <h2>{{ formatMoney(dashboard?.summary?.agencyRevenue) }}</h2>
          <span class="stat-note">Based on completed deals</span>
        </div>

        <div class="stat-card">
          <p class="stat-label">Agent Payouts</p>
          <h2>{{ formatMoney(dashboard?.summary?.agentPayouts) }}</h2>
          <span class="stat-note">Automatically distributed</span>
        </div>
      </section>

      <section class="panel-grid">
        <div class="panel">
          <div class="panel-header">
            <h3>Recent Transactions</h3>
            <button class="ghost-btn">View All</button>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Stage</th>
                <th>Total Fee</th>
              </tr>
            </thead>

            <tbody>
              <template
                v-for="item in dashboard?.recentTransactions"
                :key="item.id"
              >
                <tr>
                  <td>{{ item.property }}</td>

                  <td>
                    <div class="stage-cell">
                      <span :class="getStageClass(item.stage)">
                        {{ item.stage }}
                      </span>

                      <button
                        class="next-btn"
                        :disabled="item.stage === 'completed'"
                        @click="nextStage(item.id)"
                      >
                        {{ item.stage === 'completed' ? 'Done' : 'Next' }}
                      </button>
                    </div>
                  </td>

                  <td>{{ formatMoney(item.totalFee) }}</td>
                </tr>

                <tr v-if="item.financialBreakdown">
                  <td colspan="3">
                    <div class="breakdown-inline">
                      <div>
                        <span>Agency</span>
                        <strong>
                          {{ formatMoney(item.financialBreakdown?.agencyAmount || 0) }}
                        </strong>
                      </div>

                      <div>
                        <span>Listing Agent</span>
                        <strong>
                          {{ formatMoney(item.financialBreakdown?.listingAgentAmount || 0) }}
                        </strong>
                      </div>

                      <div>
                        <span>Selling Agent</span>
                        <strong>
                          {{ formatMoney(item.financialBreakdown?.sellingAgentAmount || 0) }}
                        </strong>
                      </div>
                    </div>

                    <p class="breakdown-reason">
                      {{ item.financialBreakdown?.reason || '' }}
                    </p>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>Commission Breakdown</h3>
          </div>

          <div class="breakdown-card">
            <p class="breakdown-title">Sample Completed Transaction</p>
            <div class="breakdown-row">
              <span>Agency Share</span>
              <strong>50%</strong>
            </div>
            <div class="breakdown-row">
              <span>Listing Agent</span>
              <strong>25%</strong>
            </div>
            <div class="breakdown-row">
              <span>Selling Agent</span>
              <strong>25%</strong>
            </div>
          </div>

          <div class="breakdown-card">
            <p class="breakdown-title">Single-Agent Scenario</p>
            <div class="breakdown-row">
              <span>Agency Share</span>
              <strong>50%</strong>
            </div>
            <div class="breakdown-row">
              <span>Same Agent Share</span>
              <strong>50%</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  background: #f4f7fb;
  color: #111827;
}

* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  padding: 32px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 24px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.1;
}

.subtitle {
  max-width: 760px;
  margin-top: 12px;
  color: #4b5563;
  font-size: 16px;
  line-height: 1.6;
}

.hero-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px 18px;
  white-space: nowrap;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.reset-btn {
  border: 1px solid #d1d5db;
  background: #111827;
  color: white;
  border-radius: 14px;
  padding: 14px 18px;
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: #1f2937;
  transform: translateY(-1px);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #22c55e;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card,
.panel {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.stat-card {
  padding: 20px;
}

.stat-label {
  margin: 0 0 10px;
  color: #6b7280;
  font-size: 14px;
}

.stat-card h2 {
  margin: 0;
  font-size: 30px;
}

.stat-note {
  display: inline-block;
  margin-top: 10px;
  color: #4b5563;
  font-size: 13px;
}

.panel-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 16px;
}

.panel {
  padding: 22px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.panel-header h3 {
  margin: 0;
  font-size: 20px;
}

.ghost-btn {
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 600;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  text-align: left;
  padding: 14px 10px;
  border-bottom: 1px solid #eef2f7;
  vertical-align: middle;
}

.table th {
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
}

.stage-cell {
  display: flex;
  align-items: center;
  gap: 14px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.badge-progress {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-warning {
  background: #fef3c7;
  color: #b45309;
}

.badge-success {
  background: #dcfce7;
  color: #15803d;
}

.next-btn {
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.next-btn:hover:not(:disabled) {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
}

.next-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.breakdown-inline {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 6px;
  padding: 14px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

.breakdown-inline div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.breakdown-inline span {
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
}

.breakdown-inline strong {
  color: #111827;
  font-size: 15px;
  font-weight: 800;
}

.breakdown-reason {
  margin: 10px 0 0;
  padding: 0 2px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
}

.breakdown-card {
  border: 1px solid #eef2f7;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 14px;
  background: #f9fbff;
}

.breakdown-title {
  margin: 0 0 14px;
  font-weight: 700;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: #374151;
}

@media (max-width: 960px) {
  .stats,
  .panel-grid,
  .breakdown-inline {
    grid-template-columns: 1fr;
  }

  .hero {
    flex-direction: column;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
}
</style>