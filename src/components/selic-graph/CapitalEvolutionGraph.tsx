import { useEffect, useState } from 'react'
import { getDailySelicHistory, SelicTimeSeriesResponse } from './services'
import * as echarts from 'echarts'
import { EChartOption, ECharts } from 'echarts'
import { DateTime } from 'luxon'

const option: EChartOption = {
  tooltip: {
    trigger: 'axis',
    position(pt) {
      return [pt[0], '10%']
    }
  },
  title: {
    left: 'center',
    text: 'Histórico taxa SELIC'
  },
  xAxis: {
    type: 'time',
    boundaryGap: false
  },
  yAxis: {
    type: 'value'
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100
    },
    {
      start: 0,
      end: 100
    }
  ],
  series: [
    {
      name: 'Taxa SELIC',
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle: {}
    },
    {
      name: 'Valor aplicado',
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle: {}
    }
  ]
}

const ddMMYyyy = 'dd/MM/yyyy'

interface Aporte {
  data: DateTime
  valor: number
}

function* generateAportes(): Generator<Aporte> {
  let startDate = DateTime.fromFormat('09/01/1995', ddMMYyyy)
  const finalDate = DateTime.now().plus({ year: 1 })
  for (let i = 0; startDate <= finalDate; i++) {
    yield {
      data: startDate,
      valor: 100
    }
    startDate = startDate.plus({ year: 1 })
  }
}

const aportes = Array.from(generateAportes())

function calculateRentability(selicHistory: SelicTimeSeriesResponse[]) {
  let sum = 0
  let index = 0

  let investido = 0

  const rendimentos = []
  const valorInvestido = []

  for (let i = 0; i < selicHistory.length; i++) {
    const selic = selicHistory[i]

    const selicData = DateTime.fromFormat(selic.data, ddMMYyyy)
    const selicValor = +selic.valor / 100

    if (index < aportes.length) {
      if (selicData >= aportes[index].data) {
        sum += aportes[index].valor
        investido += aportes[index].valor
        valorInvestido.push([aportes[index].data.toMillis(), investido])
        index++
      }
    }

    const crescimento = sum * selicValor

    sum += crescimento

    rendimentos.push([selicData.toMillis(), sum])
  }

  return [rendimentos, valorInvestido]
}

export const CapitalEvolutionGraph = () => {
  const [chart, setChart] = useState<ECharts>()
  const [selicHistory, setSelicHistory] = useState<SelicTimeSeriesResponse[]>(
    []
  )

  useEffect(() => {
    getDailySelicHistory()
      .then((response) => response.data)
      .then(setSelicHistory)
  }, [])

  useEffect(() => {
    if (selicHistory) {
      const chartDom = document.getElementById('selic-chart')

      const selicChart = echarts.init(chartDom!)

      setChart(selicChart)
    }
  }, [selicHistory])

  useEffect(() => {
    if (chart) {
      const [rentabilidade, valorAplicado] = Array.from(
        calculateRentability(selicHistory)
      )

      option.series![0].data = rentabilidade
      option.series![1].data = valorAplicado

      chart.setOption(option)
    }
  }, [chart, selicHistory])

  return (
    <div
      id="selic-chart"
      style={{ width: 800, height: 600 }}
      className="m-8 shadow-lg"
    />
  )
}
