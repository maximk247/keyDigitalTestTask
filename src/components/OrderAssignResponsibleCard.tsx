import {
  CCard,
  CCardBody,
  CCardHeader,
  CDatePicker,
  CForm,
  CFormLabel,
  CFormSelect,
} from '@coreui/react-pro'
import React from 'react'

interface OrderAssignResponsibleCardProps {
  status: string
  responsibleUserId: number | null
  employeesList: any[]
  testDate: string | null
  onChange: (value: number) => void
  onTestDateChange: (date: string | null) => void
}

const OrderAssignResponsibleCard: React.FC<OrderAssignResponsibleCardProps> = ({
  status,
  responsibleUserId,
  employeesList,
  testDate,
  onChange,
  onTestDateChange,
}) => {
  return (
    <div className="mt-4 p-0">
      <CCard className="px-0">
        <CCardHeader>
          <div>
            {!responsibleUserId ? 'Добавить в работу' : 'Добавить протокол'}
          </div>
        </CCardHeader>
        <CCardBody style={{ padding: '4rem 4rem' }}>
          <CForm>
            {/* Назначение ответственного */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '2%',
              }}
            >
              <CFormLabel style={{ width: '40%' }}>Ответственный:</CFormLabel>
              <CFormSelect
                aria-label="Ответственный"
                style={{ width: '60%' }}
                value={responsibleUserId || 'default'}
                onChange={(e) => onChange(Number(e.target.value))}
              >
                <option value="default">Назначить ответственного</option>
                {employeesList?.map((e: any) => (
                  <option key={e.id} value={e.id}>
                    {e.surname} {e.name} {e.lastName}
                  </option>
                ))}
              </CFormSelect>
            </div>

            {/* "Дата проведения испытаний" */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '2%',
              }}
            >
              <CFormLabel style={{ width: '40%' }}>
                Дата проведения испытаний:
              </CFormLabel>
              <CDatePicker
                placeholder="Выберите дату"
                style={{ width: '60%' }}
                locale="ru-RU"
                date={testDate ? new Date(testDate) : null}
                onDateChange={(date: Date | null) => {
                  onTestDateChange(date ? date.toISOString() : null)
                }}
                weekdayFormat={1}
              />
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default OrderAssignResponsibleCard
