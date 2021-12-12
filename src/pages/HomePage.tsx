import Simulator from '../components/Simulator'
import TaxConverter from '../components/TaxConverter'
import { Card } from 'antd'

export const HomePage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col gap-8 p-2 md:p-4 m-auto md:w-3/4 lg:w-3/5 xl:w-1/2">
        <Card title="Conversor de taxas">
          <TaxConverter />
        </Card>
        <Card title="Simulador de investimento">
          <Simulator />
        </Card>
      </div>
    </div>
  )
}
