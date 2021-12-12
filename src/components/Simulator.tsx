import { Button, Checkbox, Col, DatePicker, Form, InputNumber, Row } from 'antd'
import { Moment } from 'moment'
import React, { useState } from 'react'
import { Period, PeriodRangePicker } from './PeriodInput'
import { calculateIncome, convertTax } from '../business/tax-converter'
import { Duration } from 'luxon'
import SimulationReport from './SimulationReport'

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
  ir: number
}

function calculateFinalValue({
  period,
  value,
  tax,
  beginAt,
  endAt
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

  const ir = income * irTax

  return {
    liquid: income,
    ir
  }
}

export interface Simulation extends FormValues, FinalValue {}

const Simulator = () => {
  const [simulations, setSimulations] = useState<Simulation[]>([])
  const [form] = Form.useForm<FormValues>()

  const commonRules = [{ required: true, message: 'Campo obrigatório!' }]

  const submitForm = () => {
    form.validateFields().then((values) => {
      const finalValue = calculateFinalValue(values)
      const simulation = { ...values, ...finalValue }
      setSimulations((prevSimulations) => [...prevSimulations, simulation])
    })
  }

  const resetFormValues = () => {
    form.resetFields()
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
              <InputNumber style={{ width: '100%' }} addonAfter="R$" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              rules={commonRules}
              name="tax"
              label="Taxa"
              tooltip="Use o conversor de taxas acima para converter uma determinada taxa para a sua equivalente em outro período"
            >
              <InputNumber style={{ width: '100%' }} addonAfter="%" />
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
              Limpar
            </Button>
          </Col>
          <Col>
            <Button type="primary" onClick={submitForm}>
              Calcular
            </Button>
          </Col>
        </Row>
      </Form>
      <ul>
        {simulations.map((simulation, index) => (
          <li key={index} className="my-4">
            <SimulationReport simulation={simulation} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Simulator