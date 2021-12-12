import axios from 'axios'

export interface SelicTimeSeriesData {
  data: string
  valor: string
}

const url =
  'https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados?formato=json'

const getSelicTaxHistory = () => axios.get<SelicTimeSeriesData[]>(url)

export default getSelicTaxHistory
