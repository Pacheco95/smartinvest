import React, { ReactNode } from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

interface TooltipLabelProps {
  label: ReactNode
  tip: ReactNode
}

const TooltipLabel = ({ label, tip }: TooltipLabelProps) => {
  return (
    <span className="flex gap-x-1 items-center">
      {label}
      <Tooltip title={tip} className="!text-gray-500">
        <QuestionCircleOutlined style={{ fontSize: '14px', cursor: 'help' }} />
      </Tooltip>
    </span>
  )
}

export default TooltipLabel
