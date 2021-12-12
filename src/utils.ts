import { Moment } from 'moment'

export function formatDate(date: Moment) {
  return date.format('DD/MM/YYYY')
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency'
  }).format(value)
}

export function formatPercentage(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
