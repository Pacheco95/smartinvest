import { HomePage } from './pages/HomePage'
import { useEffect } from 'react'
import ReactGA from 'react-ga'

function App() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])

  return <HomePage />
}

export default App
