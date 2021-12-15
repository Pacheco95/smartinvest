import { HomePage } from './pages/HomePage'
import { useEffect } from 'react'
import ReactGa from 'react-ga'

function App() {
  useEffect(() => {
    ReactGa.pageview(window.location.pathname)
  }, [])

  return <HomePage />
}

export default App
