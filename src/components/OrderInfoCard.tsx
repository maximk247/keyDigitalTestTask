import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CDatePicker,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CTimePicker,
} from '@coreui/react-pro'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { FC, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { font } from '../assets/fonts/segoe-ui.font'
import { phoneNumber } from '../utils'

interface LabInfo {
  legalForm: string
  name: string
  owner?: {
    surname: string
    name: string
    lastName: string
  }
}

interface User {
  surname: string
  name: string
  lastName?: string
  phone: string
  company?: {
    legalForm: string
    name: string
  }
}

interface OrderInfoCardProps {
  data: {
    id: number
    createdAt: string
    user?: User
    responsibleUser?: User
    labInfo?: LabInfo
    testDate?: string
    testTime?: string
    typeJob?: string
    researchObjects?: {
      name: string
    }
    objectControl?: string
    samplingLocation?: string
    name?: string
    description?: string
    samplingAct?: {
      id?: number
    }
  }
  isView: boolean
  getDate: (date: string, time?: boolean) => string
}

const callAddFont = function (this: any) {
  this.addFileToVFS('segoe-ui-normal.ttf', font)
  this.addFont('segoe-ui-normal.ttf', 'segoe-ui', 'normal')
}
jsPDF.API.events.push(['addFonts', callAddFont])

const OrderInfoCard: FC<OrderInfoCardProps> = ({ data, isView, getDate }) => {
  const componentRef = useRef<HTMLDivElement>(null)
  // Функция для печати
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Заявка №${data.id}`,
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
          pdf.text('Фамилия______________', 10, pageHeight - 10) // x=20 мм, y=287 мм

          // Добавляем "Подпись______" справа
          pdf.text('Подпись______________', imgWidth - 40, pageHeight - 10) // x=160 мм, y=287 мм

          pdf.save(`Заявка №${data.id}.pdf`)
        })
        .catch((error) => {
          console.error('Ошибка при создании PDF:', error)
        })
    }
  }

  const user = data.user
  const userResponsible = data.responsibleUser
  const labInfo = data.labInfo

  return (
    <CCard className="px-0">
      <CCardHeader>
        <div>
          Заявка №{data.id} от {getDate(data.createdAt)}г.
        </div>
      </CCardHeader>
      <CCardBody style={{ padding: '6rem 4rem' }} ref={componentRef}>
        <CForm>
          {/* Контрагент и Основная Информация */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 2 }}>
              {/* Контрагент */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingTop: '2px',
                }}
              >
                <CFormLabel style={{ flex: 1 }}>Контрагент:</CFormLabel>
                <CFormLabel
                  style={{ flex: 2, color: 'black', fontWeight: 'bold' }}
                >
                  {user?.company
                    ? `${user.company.legalForm} «${user.company.name}»`
                    : '-'}
                </CFormLabel>
              </div>

              {/* Заявку составил */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingTop: '2px',
                }}
              >
                <CFormLabel style={{ flex: 1 }}>Заявку составил:</CFormLabel>
                <CFormLabel
                  style={{ flex: 2, color: 'black', fontWeight: 'bold' }}
                >
                  {user
                    ? `${user.surname} ${user.name.charAt(0)}.${
                        user.lastName ? `${user.lastName.charAt(0)}.` : ''
                      }`
                    : ''}
                </CFormLabel>
              </div>

              {/* Телефон составителя */}
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <CFormLabel style={{ flex: 1 }}>
                  Телефон составителя:
                </CFormLabel>
                <CFormLabel
                  style={{ flex: 2, color: 'black', fontWeight: 'bold' }}
                >
                  {user?.phone.startsWith('8') ||
                  user?.phone.startsWith('+') ||
                  user?.phone.startsWith('2') ||
                  user?.phone === ''
                    ? user.phone
                    : `+${user?.phone}`}
                </CFormLabel>
              </div>

              {/* Ответственный */}
              <div style={{ display: 'flex', paddingTop: '2px' }}>
                <CFormLabel style={{ flex: 1 }}>Ответственный:</CFormLabel>
                <CFormLabel
                  style={{ flex: 2, color: 'black', fontWeight: 'bold' }}
                >
                  {userResponsible?.name
                    ? `${userResponsible.surname} ${userResponsible.name.charAt(
                        0,
                      )}.${userResponsible.lastName?.charAt(0)}.`
                    : 'Не заполнено'}
                </CFormLabel>
              </div>

              {/* Телефон исполнителя */}
              <div style={{ display: 'flex', paddingTop: '2px' }}>
                <CFormLabel style={{ flex: 1 }}>
                  Телефон исполнителя:
                </CFormLabel>
                <CFormLabel
                  style={{ flex: 2, color: 'black', fontWeight: 'bold' }}
                >
                  {userResponsible?.phone
                    ? phoneNumber(userResponsible.phone)
                    : 'Не заполнено'}
                </CFormLabel>
              </div>
            </div>

            {/* Информация о генеральном директоре */}
            <div
              style={{
                fontSize: '16px',
                color: 'black',
                textAlign: 'end',
                flex: 1,
              }}
            >
              <p>
                Генеральному директору
                <br />
                {labInfo?.legalForm && labInfo.name
                  ? `${labInfo.legalForm} ${labInfo.name}`
                  : 'Не указано'}
                <br />
                {labInfo?.owner?.surname &&
                labInfo.owner.name &&
                labInfo.owner.lastName
                  ? `${labInfo.owner.surname} ${labInfo.owner.name.charAt(
                      0,
                    )}. ${labInfo.owner.lastName.charAt(0)}.`
                  : 'Не указано'}
              </p>
            </div>
          </div>

          {/* Дополнительная информация при просмотре */}
          {isView && (
            <div className="avoid-break-inside">
              <div
                style={{
                  margin: '0 auto',
                  width: '360px',
                  fontSize: '16px',
                  color: 'black',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                <p>
                  Заявка № {data.id} от {getDate(data.createdAt)}г.
                </p>
              </div>
            </div>
          )}

          {/* Прошу провести испытания по ниже указанным параметрам: */}
          <div
            style={{
              paddingTop: '40px',
              paddingBottom: '40px',
            }}
          >
            <p>Прошу провести испытания по ниже указанным параметрам:</p>
          </div>

          {/* Поля испытаний */}
          <div>
            {/* Дата проведения испытаний */}
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
              {isView ? (
                <span style={{ width: '60%' }}>
                  {data.testDate
                    ? new Date(data.testDate).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'Не выбрано'}
                </span>
              ) : (
                <CDatePicker
                  placeholder="Выберите дату"
                  style={{ width: '60%' }}
                  locale="ru-RU"
                  date={data.testDate ? new Date(data.testDate) : null}
                  weekdayFormat={1}
                />
              )}
            </div>

            {/* Время проведения испытаний */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '2%',
              }}
            >
              <CFormLabel style={{ width: '40%' }}>
                Время проведения испытаний:
              </CFormLabel>
              {isView ? (
                <span style={{ width: '60%' }}>
                  {data.testTime || 'Не выбрано'}
                </span>
              ) : (
                <CTimePicker
                  seconds={false}
                  placeholder="Выберите время"
                  style={{ width: '60%' }}
                  time={data.testTime ?? ''}
                  locale="ru-RU"
                />
              )}
            </div>

            {/* Виды работ */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '2%',
              }}
            >
              <CFormLabel style={{ width: '40%' }}>Виды работ:</CFormLabel>
              {isView ? (
                <span style={{ width: '60%' }}>
                  {data.typeJob || 'Не выбрано'}
                </span>
              ) : (
                <CFormInput
                  type="text"
                  placeholder="Введите виды работ"
                  style={{ width: '60%' }}
                  value={data.typeJob || ''}
                />
              )}
            </div>

            {/* Объект строительства */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '2%',
              }}
            >
              <CFormLabel style={{ width: '40%' }}>
                Объект строительства:
              </CFormLabel>
              {isView ? (
                <span style={{ width: '60%' }}>
                  {data.researchObjects?.name || 'Не выбрано'}
                </span>
              ) : (
                <CFormInput
                  type="text"
                  placeholder="Введите объект строительства"
                  style={{ width: '60%' }}
                  value={data.researchObjects?.name || ''}
                />
              )}
            </div>

            {/* Объект контроля */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '2%',
              }}
            >
              <CFormLabel style={{ width: '40%' }}>Объект контроля:</CFormLabel>
              {isView ? (
                <span style={{ width: '60%' }}>
                  {data.objectControl || 'Не выбрано'}
                </span>
              ) : (
                <CFormInput
                  type="text"
                  placeholder="Введите объект контроля"
                  style={{ width: '60%' }}
                  value={data.objectControl || ''}
                />
              )}
            </div>

            {/* Место отбора проб */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '2%',
              }}
            >
              <CFormLabel style={{ width: '40%' }}>
                Место отбора проб:
              </CFormLabel>
              {isView ? (
                <span style={{ width: '60%' }}>
                  {data.samplingLocation || 'Не выбрано'}
                </span>
              ) : (
                <CFormInput
                  type="text"
                  placeholder="Введите место отбора проб"
                  style={{ width: '60%' }}
                  value={data.samplingLocation || ''}
                />
              )}
            </div>

            {/* Проект */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '2%',
              }}
            >
              <CFormLabel style={{ width: '40%' }}>Проект:</CFormLabel>
              {isView ? (
                <span style={{ width: '60%' }}>
                  {data.name || 'Не выбрано'}
                </span>
              ) : (
                <CFormInput
                  type="text"
                  placeholder="Введите наименование проекта"
                  style={{ width: '60%' }}
                  value={data.name || ''}
                />
              )}
            </div>

            {/* Краткая информация */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '2%',
              }}
            >
              <CFormLabel style={{ width: '40%' }}>
                Краткая информация:
              </CFormLabel>
              {isView ? (
                <span style={{ width: '60%', whiteSpace: 'pre-wrap' }}>
                  {data.description || 'Не выбрано'}
                </span>
              ) : (
                <CFormTextarea
                  placeholder="Введите краткую информацию"
                  style={{ width: '60%' }}
                  value={data.description || ''}
                />
              )}
            </div>

            {/* Приложение */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '2%',
              }}
            >
              <CFormLabel style={{ width: '200px', fontWeight: 'bold' }}>
                Приложение:
              </CFormLabel>
              {isView ? (
                <span
                  style={{ width: '300px', color: 'black', fontWeight: 'bold' }}
                >
                  {data.samplingAct?.id
                    ? `Акт отбора проб № ${data.samplingAct.id}`
                    : 'Не выбрано'}
                </span>
              ) : (
                <span
                  style={{ width: '60%', color: 'black', fontWeight: 'bold' }}
                >
                  {data.samplingAct?.id
                    ? `Акт отбора проб № ${data.samplingAct.id}`
                    : 'Не выбрано'}
                </span>
              )}
            </div>
          </div>

          {/* Футер, отображающийся только при печати PDF */}
          <div className={`print-footer`}>
            <div className="footer-left">Фамилия______________</div>
            <div className="footer-right">Подпись______________</div>
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

export default OrderInfoCard
