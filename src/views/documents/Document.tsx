/* eslint-disable jsx-a11y/alt-text */
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
} from '@coreui/react-pro'
import { RenderPageProps, Viewer, Worker } from '@react-pdf-viewer/core'
import { printPlugin } from '@react-pdf-viewer/print'
import '@react-pdf-viewer/print/lib/styles/index.css'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import DocumentsApi from './Documents.Api'

interface CustomPageLayerProps {
  renderPageProps: RenderPageProps
}

// Компонент для кастомизации страницы PDF
const CustomPageLayer: React.FC<CustomPageLayerProps> = ({
  renderPageProps,
}) => {
  React.useEffect(() => {
    if (renderPageProps.canvasLayerRendered) {
      renderPageProps.markRendered(renderPageProps.pageIndex)
    }
  }, [renderPageProps.canvasLayerRendered, renderPageProps])

  return (
    <>
      {renderPageProps.canvasLayer.children}
      {renderPageProps.annotationLayer.children}
    </>
  )
}

// Функция для рендеринга страницы PDF
const renderPdfPage = (props: RenderPageProps) => (
  <CustomPageLayer renderPageProps={props} />
)

const Document = (): JSX.Element => {
  const navigate = useNavigate()
  const [showPicture, setShowPicture] = useState<any>({})
  const [titleName, setTitleName] = useState('')
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const docName = searchParams.get('name')

  // Получение документа по ID
  const getDocumentsShow = (id: any) => {
    DocumentsApi.getImageById(id).then((result: any) => {
      console.log(result)
      setShowPicture(result.data)
    })
  }

  useEffect(() => {
    if (id) {
      getDocumentsShow(id)
    }
  }, [id])

  const printPluginInstance = printPlugin()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // Обработчик для скачивания документа
  const handleDownload = () => {
    if (showPicture?.file?.url) {
      const link = document.createElement('a')
      link.href = showPicture.file.url
      link.download = docName || `Документ_${id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <CContainer>
      <CCard>
        <CCardHeader className="px-4">
          <div>{docName}</div>
        </CCardHeader>
        <CCardBody>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <p className="fs-1">{titleName}</p>
          </div>

          <div
            className="mt-2"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {showPicture?.file?.url ? (
              <>
                {showPicture.file.url.endsWith('.pdf') ? (
                  <div
                    className="pdf-viewer"
                    style={{
                      border: '1px solid rgba(0, 0, 0, 0.3)',
                      width: '100%',
                    }}
                  >
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.5.141/build/pdf.worker.min.js">
                      <Viewer
                        fileUrl={showPicture.file.url}
                        renderPage={renderPdfPage}
                        plugins={[printPluginInstance]}
                        withCredentials={true}
                      />
                    </Worker>
                  </div>
                ) : (
                  <div>
                    <img
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                      }}
                      src={showPicture.file.url}
                      alt={docName || 'Документ'}
                    />
                  </div>
                )}
              </>
            ) : (
              <p>Документ не найден.</p>
            )}
          </div>

          {/* Добавление кнопок "Печать" и "Скачать" */}
          <div
            style={{
              marginTop: '2rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            {showPicture?.file?.url.endsWith('.pdf') && (
              <CButton
                color="primary"
                onClick={() => printPluginInstance.print()}
              >
                Печать
              </CButton>
            )}
            <CButton color="secondary" onClick={handleDownload}>
              Скачать
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Document
