import axios from 'axios'

export interface SelicTimeSeriesResponse {
  data: string
  valor: string
}

const baseUrl = 'https://api.bcb.gov.br'
const url = baseUrl + '/dados/serie/bcdata.sgs.4189/dados?formato=json'
const dailyUrl = baseUrl + 'dados/serie/bcdata.sgs.11/dados?formato=json'

export const getSelicHistory = () => axios.get<SelicTimeSeriesResponse[]>(url)
export const getDailySelicHistory = () =>
  axios.get<SelicTimeSeriesResponse[]>(
    'https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json'
  )
