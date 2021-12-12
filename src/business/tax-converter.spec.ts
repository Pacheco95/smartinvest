import { Duration } from 'luxon'
import {
  calculateIncome,
  calculateIncomeTimeBased,
  calculateRelatedTax,
  convertTax
} from './tax-converter'
import { BigNum } from '../types'

describe('Tax converter', () => {
  const oneYearPeriod = Duration.fromDurationLike({ years: 1 })
  const oneDayPeriod = Duration.fromDurationLike({ days: 1 })
  const fiveYearsPeriod = Duration.fromDurationLike({ years: 5 })
  const fiveYearsInDays = oneYearPeriod.as('days') * 5
  const correspondingTruncatedDailyTaxToYearly15percentTax = 0.000382982750339
  const decimalPrecision = 15

  it('should fail', () => {
    const dailyTax = convertTax(0.15, oneYearPeriod, oneDayPeriod)

    const expectedTax = correspondingTruncatedDailyTaxToYearly15percentTax
    const truncatedDailyTax = dailyTax.toFixed(decimalPrecision)
    const truncatedExpectedTax = expectedTax.toFixed(decimalPrecision)

    expect(truncatedDailyTax).toBe(truncatedExpectedTax)
  })

  it('should result in same FV', () => {
    const initialCapital: BigNum = 100
    const taxPerYear: BigNum = 0.15

    const fiveYears = 5

    const taxPerDay = convertTax(taxPerYear, oneYearPeriod, oneDayPeriod)

    const fv1 = calculateIncome(initialCapital, taxPerYear, fiveYears)
    const fv2 = calculateIncome(initialCapital, taxPerDay, fiveYearsInDays)

    const diff = Math.abs(fv1 - fv2)

    expect(diff).toBeLessThan(1e-10)
  })

  it('should result in same FV', () => {
    const initialCapital: BigNum = 100
    const taxPerYear: BigNum = 0.15

    const taxPerDay = convertTax(taxPerYear, oneYearPeriod, oneDayPeriod)

    const fv1 = calculateIncomeTimeBased(
      initialCapital,
      { tax: taxPerYear, timeInterval: oneYearPeriod },
      fiveYearsPeriod
    )

    const fv2 = calculateIncomeTimeBased(
      initialCapital,
      { tax: taxPerDay, timeInterval: oneDayPeriod },
      fiveYearsPeriod
    )

    const diff = Math.abs(fv1 - fv2)

    expect(diff).toBeLessThan(1e-10)
  })

  it('should calculate the correct corresponding tax', () => {
    const [yearlyTax, dailyTax] = calculateRelatedTax(
      oneYearPeriod,
      0.15,
      oneDayPeriod
    )

    expect(yearlyTax.timeInterval).toBe(oneYearPeriod)
    expect(yearlyTax.tax).toBe(0.15)

    expect(dailyTax.timeInterval).toBe(oneDayPeriod)

    const correspondingTax = dailyTax.tax.toFixed(decimalPrecision)
    const expectedTax = correspondingTruncatedDailyTaxToYearly15percentTax

    expect(correspondingTax).toBe(String(expectedTax))
  })
})

export {}
