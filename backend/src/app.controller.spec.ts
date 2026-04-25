import { describe, it, expect } from '@jest/globals'
import { calculateBreakdown, getNextStage } from './app.controller'

describe('calculateBreakdown', () => {

  it('should split evenly when listing and selling agents are the same', () => {
    const transaction = {
      totalFee: 10000,
      listingAgent: 'John Doe',
      sellingAgent: 'John Doe',
    }

    const result = calculateBreakdown(transaction as any)

    expect(result.agencyAmount).toBe(5000)
    expect(result.listingAgentAmount).toBe(5000)
    expect(result.sellingAgentAmount).toBe(0)
  })

  it('should split evenly between different agents', () => {
    const transaction = {
      totalFee: 12000,
      listingAgent: 'Alice',
      sellingAgent: 'Bob',
    }

    const result = calculateBreakdown(transaction as any)

    expect(result.agencyAmount).toBe(6000)
    expect(result.listingAgentAmount).toBe(3000)
    expect(result.sellingAgentAmount).toBe(3000)
  })

  it('should handle zero fee', () => {
    const transaction = {
      totalFee: 0,
      listingAgent: 'Alice',
      sellingAgent: 'Bob',
    }

    const result = calculateBreakdown(transaction as any)

    expect(result.agencyAmount).toBe(0)
    expect(result.listingAgentAmount).toBe(0)
    expect(result.sellingAgentAmount).toBe(0)
  })

})

describe('getNextStage', () => {

  it('should move from agreement to earnest_money', () => {
    expect(getNextStage('agreement')).toBe('earnest_money')
  })

  it('should move from earnest_money to title_deed', () => {
    expect(getNextStage('earnest_money')).toBe('title_deed')
  })

  it('should move from title_deed to completed', () => {
    expect(getNextStage('title_deed')).toBe('completed')
  })

  it('should stay at completed if already completed', () => {
    expect(getNextStage('completed')).toBe('completed')
  })

  it('should throw error for invalid stage', () => {
    expect(() => getNextStage('invalid' as any)).toThrow('Invalid stage')
  })

})