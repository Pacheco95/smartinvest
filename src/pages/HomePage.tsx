import Simulator from '../components/Simulator'
import TaxConverter from '../components/TaxConverter'
import { Card } from 'antd'

export const HomePage = () => {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col gap-8 p-2 md:p-4 m-auto md:w-3/4 lg:w-3/5 xl:w-1/2">
        <Card
          title="Conversor de taxas"
          className="!rounded border-8 shadow-lg"
        >
          <TaxConverter />
        </Card>
        <Card
          title="Simulador de investimentos"
          className="!rounded border-8 shadow-lg"
        >
          <Simulator />
        </Card>
      </div>
    </div>
  )
}
