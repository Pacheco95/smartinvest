import { StrictMode } from 'react'
import { render } from 'react-dom'
import 'tailwindcss/tailwind.css'
import 'antd/dist/antd.css'
import ReactGA from 'react-ga'
import ptBR from 'antd/lib/locale/pt_BR'
import './global.scss'

import App from './App'

import { ConfigProvider } from 'antd'

ReactGA.initialize('G-CG7TTCQJK1', {
  debug: import.meta.env.DEV
})

render(
  <StrictMode>
    <ConfigProvider locale={ptBR}>
      <App />
    </ConfigProvider>
  </StrictMode>,
  document.getElementById('root')
)
