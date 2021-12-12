import { Simulation } from './Simulator'
import { Moment } from 'moment'

interface SimulationReportProps {
  simulation: Simulation
}

function formatDate(date: Moment) {
  return date.format('DD/MM/YYYY')
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency'
  }).format(value)
}

function formatPercentage(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

interface EntryProps {
  label: string
  value: string | number
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
        value={`${formatPercentage(tax / 100)} ao ${period}`}
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
