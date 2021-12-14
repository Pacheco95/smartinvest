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
  const {
    ir,
    period,
    endAt,
    tax,
    beginAt,
    calculateIr,
    liquidTotal,
    liquidIncome,
    finalBruteValue,
    investedValue,
    irTaxPercentage
  } = simulation

  const irValue = ir ?? 0

  return (
    <div>
      <Entry label="Valor investido" value={formatCurrency(investedValue)} />
      <Entry
        label="Taxa"
        value={`${formatPercentage(tax / 100)} ao ${translationMap[period]}`}
      />
      <Entry label="Data da aplicação" value={formatDate(beginAt)} />
      <Entry label="Vencimento" value={formatDate(endAt)} />
      {calculateIr && (
        <>
          <Entry
            label="Rendimento líquido"
            value={formatCurrency(liquidIncome)}
          />
          <Entry
            label="Taxa do imposto de renda"
            value={formatPercentage(irTaxPercentage)}
          />
          <Entry label="Imposto de renda" value={formatCurrency(irValue)} />
          <Entry
            label={`Valor final bruto`}
            value={formatCurrency(finalBruteValue)}
          />
        </>
      )}
      <Entry
        label={`Valor final${ir !== undefined ? ' líquido' : ''}`}
        value={formatCurrency(liquidTotal)}
      />
    </div>
  )
}

export default SimulationReport
