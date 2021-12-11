import { useEffect, useState } from 'react'
import { getSelicHistory, SelicTimeSeriesResponse } from './services'
import { EChartOption, ECharts } from 'echarts'
import * as echarts from 'echarts'
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
      smooth: false,
      symbol: 'none',
      areaStyle: {}
    }
  ]
}

export const SelicGraph = () => {
  const [chart, setChart] = useState<ECharts>()
  const [selicHistory, setSelicHistory] = useState<SelicTimeSeriesResponse[]>(
    []
  )

  useEffect(() => {
    getSelicHistory()
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
      const last15years = -12 * 15
      option.series![0].data = selicHistory.slice(last15years).map((x) => {
        const date = DateTime.fromFormat(x.data, 'dd/MM/yyyy').toMillis()
        const value = +x.valor
        return [date, value]
      })
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
