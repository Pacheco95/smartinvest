import {
  Button,
  Checkbox,
  Collapse,
  DatePicker,
  Form,
  InputNumber,
  message
} from 'antd'
import { Moment } from 'moment'
import React, { useState } from 'react'
import { Period, PeriodRangePicker } from './PeriodInput'
import { calculateIncome, convertTax } from '../business/tax-converter'
import { Duration } from 'luxon'
import SimulationReport from './SimulationReport'
import { formatCurrency } from '../utils'
import { v4 as uuidv4 } from 'uuid'

import * as _ from 'lodash'

const { Panel } = Collapse

interface FormValues {
  beginAt: Moment
  endAt: Moment
  value: number
  pmt: number
  tax: number
  period: Period
  calculateIr?: boolean
}

function calculateIrTax(days: number) {
  if (days > 720) return 15.0

  if (days >= 361) return 17.5

  if (days >= 181) return 20.0

  return 22.5
}

interface FinalValue {
  liquidTotal: number
  liquidIncome: number
  ir?: number
  investedValue: number
  finalBruteValue: number
  irTaxPercentage: number
}

function calculateFinalValue({
  period,
  value,
  pmt,
  tax,
  beginAt,
  endAt,
  calculateIr
}: FormValues): FinalValue {
  const investedMonths = endAt.diff(beginAt, 'months')
  const oneMonth = Duration.fromObject({ months: 1 })

  const taxPercentage = tax / 100

  const currentTaxPeriod = Duration.fromObject({ [period]: 1 })

  const taxPerMonth = convertTax(taxPercentage, currentTaxPeriod, oneMonth)

  const finalBruteValue = calculateIncome(
    value,
    taxPerMonth,
    investedMonths,
    pmt
  )

  let ir: number | undefined = undefined

  let irTaxPercentage = 0

  let liquidTotal = finalBruteValue

  const investedValue = value + pmt * investedMonths

  const liquidIncome = finalBruteValue - investedValue

  const bruteGain = finalBruteValue - investedValue

  if (calculateIr) {
    const investedDays = endAt.diff(beginAt, 'days')
    irTaxPercentage = calculateIrTax(investedDays) / 100
    ir = irTaxPercentage * bruteGain
    liquidTotal = finalBruteValue - ir
  }

  return {
    liquidTotal,
    liquidIncome,
    ir,
    investedValue,
    finalBruteValue,
    irTaxPercentage
  }
}

const initialFormValues: Partial<FormValues> = {
  pmt: 0,
  calculateIr: true
}

export interface Simulation extends FormValues, FinalValue {
  id: string
}

const Simulator = () => {
  const [simulations, setSimulations] = useState<Simulation[]>([])
  const [form] = Form.useForm<FormValues>()

  const commonRules = [{ required: true, message: 'Campo obrigatório!' }]

  const submitForm = () => {
    form.validateFields().then((values) => {
      const finalValue = calculateFinalValue(values)
      const simulation = { ...values, ...finalValue, id: uuidv4() }
      const lasSimulation = simulations.at(-1)
      const wasPreviousCalculated = _.isEqual(
        _.omit(lasSimulation, 'id'),
        _.omit(simulation, 'id')
      )
      if (wasPreviousCalculated) {
        void message.info('Sem alterações desde a sua última simulação')
        return
      }
      setSimulations((prevSimulations) => [simulation, ...prevSimulations])
    })
  }

  const resetFormValues = () => {
    form.resetFields()
  }

  const clearSimulations = () => {
    setSimulations([])
  }

  return (
    <div>
      <Form
        layout="vertical"
        form={form}
        preserve={false}
        initialValues={initialFormValues}
      >
        <div className="sm:flex gap-x-4 w-full">
          <Form.Item
            rules={commonRules}
            name="beginAt"
            label="Data de início"
            className="w-full"
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            rules={commonRules}
            name="endAt"
            label="Data de vencimento"
            className="w-full"
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
        </div>
        <div className="sm:flex gap-x-4 w-full">
          <Form.Item
            rules={commonRules}
            name="value"
            label="Valor inicial a ser investido"
            className="w-full"
          >
            <InputNumber
              decimalSeparator=","
              style={{ width: '100%' }}
              addonAfter="R$"
            />
          </Form.Item>
          <Form.Item
            rules={commonRules}
            name="pmt"
            label="Valor dos aportes mensais"
            className="w-full"
          >
            <InputNumber
              decimalSeparator=","
              style={{ width: '100%' }}
              addonAfter="R$"
            />
          </Form.Item>
        </div>
        <div className="flex gap-x-4 w-full">
          <Form.Item
            rules={commonRules}
            name="tax"
            label="Taxa"
            tooltip="Use o conversor de taxas acima para converter uma determinada taxa para a sua equivalente em outro período"
            className="!block w-3/5"
          >
            <InputNumber
              min={0}
              decimalSeparator=","
              style={{ width: '100%' }}
              addonAfter="%"
            />
          </Form.Item>
          <Form.Item
            rules={commonRules}
            name="period"
            label="Período"
            className="!block w-2/5"
          >
            <PeriodRangePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <Form.Item name="calculateIr" valuePropName="checked">
          <Checkbox>Calcular imposto de renda?</Checkbox>
        </Form.Item>
        <div className="flex gap-x-4">
          <Button type="dashed" onClick={resetFormValues}>
            Limpar formulário
          </Button>
          {!!simulations.length && (
            <Button type="dashed" onClick={clearSimulations}>
              Limpar simulações
            </Button>
          )}
          <div className="flex-1" />
          <Button type="primary" onClick={submitForm}>
            Simular
          </Button>
        </div>
      </Form>
      {!!simulations.length && (
        <Collapse className="!mt-4">
          {simulations.map((simulation) => (
            <Panel
              key={simulation.id}
              header={formatCurrency(simulation.liquidTotal)}
            >
              <SimulationReport simulation={simulation} />
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  )
}

export default Simulator
