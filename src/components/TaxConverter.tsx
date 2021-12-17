import React, { useEffect, useState } from 'react'
import { Button, Form } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import { Duration } from 'luxon'
import PeriodInput, { Period, PeriodInputValue } from './PeriodInput'
import { calculateRelatedTax } from '../business/tax-converter'

interface FormFields {
  currentTaxPeriod: PeriodInputValue
  desiredTaxPeriod: PeriodInputValue
}

const initialFormValues: FormFields = {
  currentTaxPeriod: {
    period: 'years',
    value: 5
  },
  desiredTaxPeriod: {
    period: 'months'
  }
}

const TaxConverter = () => {
  const [lhsTax, setLhsTax] = useState(5)
  const [lhsPeriod, setLhsPeriod] = useState<Period | undefined>('years')

  const [rhsTax, setRhsTax] = useState(1)
  const [rhsPeriod, setRhsPeriod] = useState<Period | undefined>('months')

  const [shouldSwapValues, setShouldSwapValues] = useState(false)

  useEffect(() => {
    const actualTaxPeriodDuration = Duration.fromObject({ [lhsPeriod!]: 1 })

    const desiredTaxPeriodDuration = Duration.fromObject({ [rhsPeriod!]: 1 })

    const [, target] = calculateRelatedTax(
      actualTaxPeriodDuration,
      lhsTax! / 100,
      desiredTaxPeriodDuration
    )

    const convertedTax = Number((target.tax * 100).toFixed(6))

    setRhsTax(convertedTax)
  }, [lhsTax, lhsPeriod, rhsPeriod])

  useEffect(() => {
    if (!shouldSwapValues) {
      return
    }

    setShouldSwapValues(false)

    setLhsTax(rhsTax)
    setRhsTax(lhsTax)

    setLhsPeriod(rhsPeriod)
    setRhsPeriod(lhsPeriod)
  }, [lhsPeriod, lhsTax, rhsPeriod, rhsTax, shouldSwapValues])

  const swapTaxes = () => {
    setShouldSwapValues(true)
  }

  const handleCurrentTaxPeriodChange = ({
    period,
    value
  }: PeriodInputValue) => {
    if (period !== undefined) {
      if (period !== lhsPeriod) {
        setLhsPeriod(period)
      }
    }

    if (value !== undefined) {
      if (value !== lhsTax) {
        setLhsTax(value!)
      }
    }
  }

  const handleDesiredTaxPeriodChange = ({
    period,
    value
  }: PeriodInputValue) => {
    if (period !== undefined) {
      if (period !== rhsPeriod) {
        setRhsPeriod(period)
      }
    }

    if (value !== undefined) {
      if (value !== rhsTax) {
        setRhsTax(value)
      }
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={initialFormValues}
      className="md:flex gap-x-4 justify-center content-center"
    >
      <div className="flex justify-center items-center w-full">
        <Form.Item label="Taxa atual" className="w-full">
          <PeriodInput
            value={{
              value: lhsTax,
              period: lhsPeriod
            }}
            onChange={handleCurrentTaxPeriodChange}
            inputNumberProps={{ style: { width: '100%' }, min: 0 }}
          />
        </Form.Item>
      </div>
      <div className="flex md:flex-col justify-center mb-2 md:mb-0">
        <Button
          size="large"
          type="link"
          icon={
            <SwapOutlined className="text-3xl text-blue-700 rotate-90 md:rotate-0 cursor-pointer" />
          }
          onClick={swapTaxes}
        />
      </div>
      <div className="flex justify-center items-center w-full">
        <Form.Item
          label="Taxa equivalente"
          wrapperCol={{
            xs: 24
          }}
          className="w-full"
        >
          <PeriodInput
            value={{
              value: rhsTax,
              period: rhsPeriod
            }}
            onChange={handleDesiredTaxPeriodChange}
            inputNumberProps={{ style: { width: '100%' }, disabled: true }}
          />
        </Form.Item>
      </div>
    </Form>
  )
}

export default TaxConverter
