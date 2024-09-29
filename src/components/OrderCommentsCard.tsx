import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormTextarea,
} from '@coreui/react-pro'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import { font } from '../assets/fonts/segoe-ui.font'
import { setTimeV2 } from '../helper/timeFormat'
import { useTypedSelector } from '../store'

interface OrderCommentsCardProps {
  comments: any[]
  orderId: string
}

const callAddFont = function (this: any) {
  this.addFileToVFS('segoe-ui-normal.ttf', font)
  this.addFont('segoe-ui-normal.ttf', 'segoe-ui', 'normal')
}
jsPDF.API.events.push(['addFonts', callAddFont])

const OrderCommentsCard: React.FC<OrderCommentsCardProps> = ({
  comments,
  orderId,
}) => {
  const componentRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const dataUser = useTypedSelector((state) => state.dataUser)
  const [dataComment, setDataComment] = useState<any>({
    text: '',
    orderId: orderId,
    userId: dataUser.id,
  })
  const [buttonStyle, setButtonStyle] = useState<any>({
    width: '180px',
    marginTop: '20px',
    backgroundColor: '#F1F4F7',
    color: '#414141',
    marginBottom: '20px',
  })

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDataComment({
      ...dataComment,
      text: e.target.value,
    })
    sendButtonStyle(e.target.value)
  }

  const sendButtonStyle = (value: string | null) => {
    if (value) {
      setButtonStyle({
        ...buttonStyle,
        backgroundColor: '#747DEA',
        color: '#fff',
      })
    } else {
      setButtonStyle({
        ...buttonStyle,
        backgroundColor: '#F1F4F7',
        color: '#414141',
      })
    }
  }

  // Функция для печати
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Комментарии к заявке №${orderId}`,
  })

  // Функция для скачивания PDF
  const handleDownload = () => {
    if (componentRef.current) {
      html2canvas(componentRef.current, { scale: 2 })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png')
          const pdf = new jsPDF('p', 'mm', 'a4')
          const imgWidth = 210
          const pageHeight = 297
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          let heightLeft = imgHeight
          let position = 0

          // Добавляем первую страницу
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight

          // Добавляем дополнительные страницы, если необходимо
          while (heightLeft > 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
          }
          pdf.setPage(1)
          pdf.setFont('segoe-ui', 'normal')
          pdf.setFontSize(9)
          pdf.setTextColor(44, 56, 74)
          // Добавляем "Фамилия______" слева
          pdf.text('Фамилия______________', 10, pageHeight - 10)

          // Добавляем "Подпись______" справа
          pdf.text('Подпись______________', imgWidth - 40, pageHeight - 10)

          pdf.save(`Заявка №${orderId}.pdf`)
        })
        .catch((error) => {
          console.error('Ошибка при создании PDF:', error)
        })
    }
  }

  return (
    <CCard className="mt-4 px-0">
      <CCardHeader>
        <div>Комментарии к заявке </div>
      </CCardHeader>
      <CCardBody style={{ padding: '4rem 4rem' }} ref={componentRef}>
        <div>
          <div
            className="avoid-break-inside"
            style={{
              margin: '0 auto',
              width: '250px',
              fontSize: '16px',
              color: 'black',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            <p style={{}}>Комментарии к заявке № {orderId}</p>
          </div>
        </div>
        <CForm>
          {comments.length > 0 && (
            <div>
              {comments.map((e, i) => {
                const { user, createdAt, text } = e
                const { surname, name, lastName } = user || {
                  surname: '',
                  name: '',
                  lastName: '',
                }

                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginBottom: '0.7rem',
                      justifyContent: 'space-between',
                    }}
                    className="auto-page-break-stop-recursive avoid-break-inside"
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '25%',
                      }}
                    >
                      <div style={{ marginBottom: '0.5rem', width: '590px' }}>
                        {surname} {name[0]}. {lastName[0]}.
                      </div>
                      <div
                        style={{
                          width: '300px',
                          color: 'GrayText',
                          fontSize: '12px',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {setTimeV2(createdAt)}
                      </div>
                    </div>
                    <div
                      style={{
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        width: '60%',
                      }}
                    >
                      {text}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                marginTop: '2rem',
              }}
            >
              <CFormTextarea
                id="comment"
                rows={3}
                placeholder="Введите: Класс прочности бетона; Материал; Тип грунта; и т.д."
                style={{ width: '60%' }}
                value={dataComment.text}
                onChange={handleCommentChange}
              />
            </div>
          </div>
          {/* Футер, отображающийся только при печати */}
          <div className="print-footer">
            <div className="print-footer-left">Фамилия______________</div>
            <div className="print-footer-right">Подпись______________</div>
          </div>
        </CForm>
      </CCardBody>
      {/* Кнопки Печать и Скачать */}
      <CCardBody
        style={{
          padding: '1rem 4rem',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <CButton
          color="primary"
          onClick={handlePrint}
          style={{ marginRight: '1rem' }}
        >
          Печать
        </CButton>
        <CButton color="secondary" onClick={handleDownload}>
          Скачать
        </CButton>
      </CCardBody>
    </CCard>
  )
}

export default OrderCommentsCard
