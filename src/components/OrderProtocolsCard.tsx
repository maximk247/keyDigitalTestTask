import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCardText,
  CCardTitle,
  CForm,
} from '@coreui/react-pro'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getImagePlaceholderFromMime } from '../utils'
import setTime from '../helper/timeFormat'

interface OrderProtocolsCardProps {
  protocols: any[]
  orderId: string
  isLabUser: boolean
}

const OrderProtocolsCard: React.FC<OrderProtocolsCardProps> = ({
  protocols,
  orderId,
  isLabUser,
}) => {
  const navigate = useNavigate()

  const handleProtocolClick = (el: any) => {
    const file = el.file?.url
    if (el.registered && file && /\.(pdf|jpg|jpeg|bmp|png)$/.test(file)) {
      navigate(`/protocol/${orderId}/${el.id}?name=${el.name}`)
    } else if (!el.registered && isLabUser && el.isCustom) {
      navigate(
        `/orders/${orderId}/custom-protocol/${el.id}?view=true&name=${el.number}`,
      )
    }
  }

  const registeredProtocols = protocols.filter((p) => p.registered)
  const unregisteredProtocols = protocols.filter((p) => !p.registered)

  return (
    <>
      {registeredProtocols.length > 0 && (
        <CCard className="mt-4 px-0">
          <CCardHeader>
            <div>Зарегистрированные протоколы заявки</div>
          </CCardHeader>
          <CCardBody style={{ padding: '4rem 4rem' }}>
            <CForm>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: '20px',
                }}
              >
                {registeredProtocols.map((el, i) => (
                  <div
                    key={i}
                    style={{
                      flex: '0 0 33.33%',
                      display: 'flex',
                      padding: '1rem',
                      cursor:
                        el.file || el.isCustom ? 'pointer' : 'not-allowed',
                    }}
                    className="mt-2 card-protocol"
                    onClick={() => handleProtocolClick(el)}
                  >
                    <CCard style={{ width: '288px', height: '100%' }}>
                      <CCardImage
                        style={{ height: '150px' }}
                        alt={el.name}
                        src={
                          getImagePlaceholderFromMime(el.file?.url) ?? undefined
                        }
                      />
                      <CCardBody>
                        <CCardTitle>
                          {el.isCustom ? `Протокол № ${el.number}` : el.name}
                        </CCardTitle>
                        {el.createdAt && (
                          <CCardText>{setTime(el.createdAt)}</CCardText>
                        )}
                      </CCardBody>
                    </CCard>
                  </div>
                ))}
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      )}
      {unregisteredProtocols.length > 0 && (
        <CCard className="mt-4 px-0">
          <CCardHeader>
            <div>Незарегистрированные протоколы заявки</div>
          </CCardHeader>
          <CCardBody style={{ padding: '4rem 4rem' }}>
            <CForm>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: '20px',
                }}
              >
                {unregisteredProtocols.map((el, i) => (
                  <div
                    key={i}
                    style={{
                      flex: '0 0 33.33%',
                      display: 'flex',
                      padding: '1rem',
                      cursor:
                        el.file || el.isCustom ? 'pointer' : 'not-allowed',
                    }}
                    className="mt-2 card-protocol"
                    onClick={() => handleProtocolClick(el)}
                  >
                    <CCard style={{ width: '288px', height: '100%' }}>
                      <CCardImage
                        style={{ height: '150px' }}
                        alt={el.name}
                        src={
                          getImagePlaceholderFromMime(el.file?.url) ?? undefined
                        }
                      />
                      <CCardBody>
                        <CCardTitle>Протокол</CCardTitle>
                        {el.createdAt && (
                          <CCardText>{setTime(el.createdAt)}</CCardText>
                        )}
                      </CCardBody>
                    </CCard>
                  </div>
                ))}
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      )}
    </>
  )
}

export default OrderProtocolsCard
