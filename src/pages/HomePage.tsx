import Simulator from '../components/Simulator'
import TaxConverter from '../components/TaxConverter'
import { Card } from 'antd'

export const HomePage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col gap-8 m-auto w-1/3">
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
