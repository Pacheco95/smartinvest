import {
  Button,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Form,
  InputNumber,
  Row
} from 'antd'
import { Moment } from 'moment'
import React, { useState } from 'react'
import { Period, PeriodRangePicker } from './PeriodInput'
import { calculateIncome, convertTax } from '../business/tax-converter'
import { Duration } from 'luxon'
import SimulationReport from './SimulationReport'
import { formatCurrency } from '../utils'
import { v4 as uuidv4 } from 'uuid'

const { Panel } = Collapse

interface FormValues {
  beginAt: Moment
  endAt: Moment
  value: number
  tax: number
  period: Period
  calculateIr?: boolean
}

function calculateIR(days: number) {
  if (days > 720) return 15.0

  if (days >= 361) return 17.5

  if (days >= 181) return 20.0

  return 22.5
}

interface FinalValue {
  liquid: number
  ir?: number
}

function calculateFinalValue({
  period,
  value,
  tax,
  beginAt,
  endAt,
  calculateIr
}: FormValues): FinalValue {
  const days = endAt.diff(beginAt, 'days')
  const oneDay = Duration.fromObject({ days: 1 })

  const taxPercentage = tax / 100

  const taxPerDay = convertTax(
    taxPercentage,
    Duration.fromObject({
      [period]: 1
    }),
    oneDay
  )

  const income = calculateIncome(value, taxPerDay, days)

  const irTax = calculateIR(days) / 100

  const ir = calculateIr ? (income - value) * irTax : undefined

  return {
    liquid: income - value,
    ir
  }
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
      <Form layout="vertical" form={form} preserve={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              rules={commonRules}
              name="beginAt"
              label="Data de início"
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              rules={commonRules}
              name="endAt"
              label="Data de vencimento"
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              rules={commonRules}
              name="value"
              label="Valor a ser investido"
            >
              <InputNumber
                decimalSeparator=","
                style={{ width: '100%' }}
                addonAfter="R$"
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              rules={commonRules}
              name="tax"
              label="Taxa"
              tooltip="Use o conversor de taxas acima para converter uma determinada taxa para a sua equivalente em outro período"
            >
              <InputNumber
                decimalSeparator=","
                style={{ width: '100%' }}
                addonAfter="%"
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item rules={commonRules} name="period" label="Período">
              <PeriodRangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col>
            <Form.Item
              name="calculateIr"
              label="Calcular imposto de renda?"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col>
            <Button type="dashed" onClick={resetFormValues}>
              Limpar formulário
            </Button>
          </Col>
          {!!simulations.length && (
            <Col>
              <Button type="dashed" onClick={clearSimulations}>
                Limpar simulações
              </Button>
            </Col>
          )}
          <Col className="flex-1" />
          <Col>
            <Button type="primary" onClick={submitForm}>
              Simular
            </Button>
          </Col>
        </Row>
      </Form>
      {!!simulations.length && (
        <Collapse className="!mt-4">
          {simulations.map((simulation) => (
            <Panel
              key={simulation.id}
              header={formatCurrency(simulation.liquid + simulation.value)}
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
