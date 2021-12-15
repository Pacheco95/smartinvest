import { StrictMode } from 'react'
import { render } from 'react-dom'
import 'tailwindcss/tailwind.css'
import App from './App'

import 'antd/dist/antd.css'
import ptBR from 'antd/lib/locale/pt_BR'
import './global.scss'

import ReactGa from 'react-ga'

import { ConfigProvider } from 'antd'

ReactGa.initialize('G-CG7TTCQJK1', {
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
