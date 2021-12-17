import Simulator from '../components/Simulator'
import TaxConverter from '../components/TaxConverter'
import { Card } from 'antd'
import TooltipLabel from '../components/TooltipLabel'

export const HomePage = () => {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col gap-8 p-2 md:p-4 m-auto md:w-3/4 lg:w-3/5 xl:w-1/2">
        <Card
          title={
            <TooltipLabel
              label="Conversor de taxas"
              tip={
                <span>
                  A conversão está assumindo 1 mês como 30 dias e 1 ano como 365
                  dias.
                  <br />
                  <span className="underline">
                    Os cálculos podem apresentar pequenos erros de
                    arredondamento de até 5 casas decimais
                  </span>
                </span>
              }
            />
          }
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
