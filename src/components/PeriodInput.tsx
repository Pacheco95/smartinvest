import React from 'react'
import { InputNumber, InputNumberProps, Select, SelectProps } from 'antd'

const { Option } = Select

export type Period = 'days' | 'months' | 'years'

const ranges = [
  {
    name: 'Dia',
    duration: 'days'
  },
  {
    name: 'Mês',
    duration: 'months'
  },
  {
    name: 'Ano',
    duration: 'years'
  }
]

type PeriodRangePickerProps = SelectProps<Period>

export const PeriodRangePicker = (props: PeriodRangePickerProps) => (
  <Select style={{ width: 70 }} {...props}>
    {ranges.map((range) => (
      <Option key={range.duration} value={range.duration}>
        {range.name}
      </Option>
    ))}
  </Select>
)

export interface PeriodInputValue {
  value?: number
  period?: Period
}

interface PeriodInputProps {
  value?: PeriodInputValue
  onChange?: (changes: PeriodInputValue) => void
  inputNumberProps?: Omit<InputNumberProps, 'value' | 'onChange' | 'addonAfter'>
  selectProps?: Omit<PeriodRangePickerProps, 'value' | 'onChange'>
}

const PeriodInput = ({
  value,
  onChange,
  inputNumberProps,
  selectProps
}: PeriodInputProps) => {
  const currentTaxPeriodPicker = (
    <PeriodRangePicker
      value={value?.period}
      onChange={(newPeriod) => onChange?.({ period: newPeriod })}
      {...selectProps}
    />
  )

  return (
    <InputNumber
      value={value?.value}
      onChange={(newValue) => onChange?.({ value: newValue as number })}
      addonAfter={currentTaxPeriodPicker}
      style={{ width: '100%' }}
      {...inputNumberProps}
      decimalSeparator=","
    />
  )
}

export default PeriodInput
