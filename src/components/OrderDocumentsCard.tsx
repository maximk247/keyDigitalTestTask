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
import setTime from '../helper/timeFormat'
import { getImagePlaceholderFromMime } from '../utils'

interface DocumentsCardProps {
  documents: any[]
  orderId: string
}

const OrderDocumentsCard: React.FC<DocumentsCardProps> = ({
  documents,
  orderId,
}) => {
  const navigate = useNavigate()

  const handleDocumentClick = (el: any) => {
    const file = el.file?.url
    if (file && /\.(pdf|jpg|jpeg|bmp|png)$/.test(file)) {
      navigate(`/orders/document/${el.id}/${orderId}?name=${el.name}`)
    }
  }

  return (
    <CCard className="mt-4 px-0">
      <CCardHeader>
        <div>Сопроводительные документы к заявке</div>
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
            {documents.map((el, i) => (
              <div
                key={i}
                style={{
                  flex: '0 0 33.33%',
                  display: 'flex',
                  padding: '1rem',
                  cursor: el.file ? 'pointer' : 'not-allowed',
                }}
                className="mt-2"
                onClick={() => handleDocumentClick(el)}
              >
                <CCard style={{ width: '288px', height: '100%' }}>
                  <CCardImage
                    style={{ height: '150px' }}
                    alt={el.name}
                    src={getImagePlaceholderFromMime(el.file?.url) ?? undefined}
                  />
                  <CCardBody>
                    <CCardTitle>{el.name}</CCardTitle>
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
  )
}

export default OrderDocumentsCard
