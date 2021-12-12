import * as echarts from 'echarts'
import { EChartOption, ECharts } from 'echarts'
import { DateTime } from 'luxon'
import { useCallback, useEffect, useState } from 'react'
import getSelicTaxHistory from '../../services/get-selic-history'

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

type TimeSeriesData = [number, number]

const SelicChart = () => {
  const [chart, setChart] = useState<ECharts | null>(null)
  const [selicData, setSelicData] = useState<TimeSeriesData[]>([])

  const fetchSelicData = useCallback(() => {
    getSelicTaxHistory()
      .then((response) => response.data)
      .then((selicHistory) => {
        const last15years = -12 * 15
        const newData: TimeSeriesData[] = selicHistory
          .slice(last15years)
          .map((x) => {
            const date = DateTime.fromFormat(x.data, 'dd/MM/yyyy').toMillis()
            const value = +x.valor
            return [date, value]
          })
        setSelicData(newData)
      })
  }, [chart])

  useEffect(() => {
    if (selicData && chart) {
      option.series![0].data = selicData
      chart.setOption(option)
    }
  }, [selicData, chart])

  useEffect(() => {
    const chartDom = document.getElementById('main')

    const selicChart = echarts.init(chartDom!, { locale: 'PTBR' })

    setChart(selicChart)

    fetchSelicData()
  }, [])

  return <div id="main" style={{ width: 800, height: 600 }} />
}

export default SelicChart
