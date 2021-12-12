import { Simulation } from './Simulator'
import { formatCurrency, formatDate, formatPercentage } from '../utils'
import { Period } from './PeriodInput'

interface SimulationReportProps {
  simulation: Simulation
}

interface EntryProps {
  label: string
  value: string | number
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
      <Entry
        label="Período da aplicação"
        value={`de ${formatDate(beginAt)} até ${formatDate(endAt)}`}
      />
      <Entry label="Rendimento líquido" value={formatCurrency(liquid)} />
      <Entry label="Imposto de renda" value={formatCurrency(ir)} />
    </div>
  )
}

export default SimulationReport
