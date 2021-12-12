import Simulator from '../components/Simulator'

export const HomePage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="m-auto w-1/3">
        <Simulator />
      </div>
    </div>
  )
}
