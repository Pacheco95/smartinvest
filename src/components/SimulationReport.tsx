import { Simulation } from './Simulator'
import { formatCurrency, formatDate, formatPercentage } from '../utils'
import { Period } from './PeriodInput'
import { ReactNode } from 'react'

interface SimulationReportProps {
  simulation: Simulation
}

interface EntryProps {
  label: string
  value: string | number | ReactNode
}

type PeriodTranslationMap = {
  [key in Period]: string
}

const translationMap: PeriodTranslationMap = {
  days: 'dia',
  months: 'mês',
  years: 'ano'
}

const Entry = ({ label, value }: EntryProps) => {
  return (
    <div className="flex justify-between">
      <span className="font-bold">{label}</span>
      <span>{value}</span>
    </div>
  )
}

const SimulationReport = ({ simulation }: SimulationReportProps) => {
  const { ir, period, value, endAt, tax, liquid, beginAt } = simulation
  return (
    <div>
      <Entry label="Valor investido" value={formatCurrency(value)} />
      <Entry
        label="Taxa"
        value={`${formatPercentage(tax / 100)} ao ${translationMap[period]}`}
      />
      <Entry label="Data da aplicação" value={formatDate(beginAt)} />
      <Entry label="Vencimento" value={formatDate(endAt)} />
      <Entry label="Rendimento líquido" value={formatCurrency(liquid)} />
      <Entry label="Imposto de renda" value={formatCurrency(ir)} />
      <Entry
        label="Valor final líquido"
        value={formatCurrency(liquid + value)}
      />
    </div>
  )
}

export default SimulationReport
