import { test, expect } from '@playwright/test'
import { sum } from './sum'

test('sum', () => {
    expect(sum(1, 1)).toBe(2)
})
