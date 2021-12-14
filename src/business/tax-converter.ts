import { Duration } from 'luxon'
import { BigNum } from '../types'

export const convertTax = (
  currentTax: BigNum,
  currentTimeInterval: Duration,
  desiredTimeInterval: Duration
) => {
  const des = desiredTimeInterval.as('days')
  const curr = currentTimeInterval.as('days')
  return (1 + currentTax) ** (des / curr) - 1
}

export const calculateIncome = (
  initialCapital: BigNum,
  tax: BigNum,
  period: BigNum,
  pmt: BigNum
) => {
  const power = (1 + tax) ** period

  let pmtSum: number

  if (tax > 0) {
    pmtSum = (pmt * (1 + tax) * (power - 1)) / tax
  } else {
    pmtSum = pmt * period
  }

  return initialCapital * power + pmtSum
}

export interface TimeBasedTax {
  tax: BigNum
  timeInterval: Duration
}

export const calculateIncomeTimeBased = (
  initialCapital: BigNum,
  timeBasedTax: TimeBasedTax,
  howMuchTime: Duration,
  pmt: BigNum
) => {
  const equivalentTaxValueOneDay = convertTax(
    timeBasedTax.tax,
    timeBasedTax.timeInterval,
    Duration.fromDurationLike({ day: 1 })
  )

  return calculateIncome(
    initialCapital,
    equivalentTaxValueOneDay,
    howMuchTime.as('days'),
    pmt
  )
}

export const calculateRelatedTax = (
  actualTaxPeriod: Duration,
  actualTax: BigNum,
  desiredTaxPeriod: Duration
) => {
  const targetTax = convertTax(actualTax, actualTaxPeriod, desiredTaxPeriod)

  const current: TimeBasedTax = {
    tax: actualTax,
    timeInterval: actualTaxPeriod
  }

  const target: TimeBasedTax = {
    tax: targetTax,
    timeInterval: desiredTaxPeriod
  }

  return [current, target]
}
