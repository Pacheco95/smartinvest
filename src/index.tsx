import { StrictMode } from 'react'
import { render } from 'react-dom'
import 'tailwindcss/tailwind.css'
import App from './App'

import 'antd/dist/antd.css'
import ptBR from 'antd/lib/locale/pt_BR'
import './global.scss'

import { ConfigProvider } from 'antd'

render(
  <StrictMode>
    <ConfigProvider locale={ptBR}>
      <App />
    </ConfigProvider>
  </StrictMode>,
  document.getElementById('root')
)
