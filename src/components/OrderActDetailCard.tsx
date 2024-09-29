import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CDatePicker,
  CForm,
  CFormInput,
  CFormLabel,
  CTimePicker,
} from '@coreui/react-pro'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { FC, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { font } from '../assets/fonts/segoe-ui.font'

interface OrderActDetailCardProps {
  actDetail: any
  handleChangeActDetail: (key: string, value: any) => void
  isView: boolean
  getDate: (date: string, time?: boolean) => string
}

const callAddFont = function (this: any) {
  this.addFileToVFS('segoe-ui-normal.ttf', font)
  this.addFont('segoe-ui-normal.ttf', 'segoe-ui', 'normal')
}
jsPDF.API.events.push(['addFonts', callAddFont])

const OrderActDetailCard: FC<OrderActDetailCardProps> = ({
  actDetail,
  handleChangeActDetail,
  isView,
  getDate,
}) => {
  const componentRef = useRef<HTMLDivElement>(null)

  // Функция для печати
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Акт отбора проб №${actDetail.id}`,
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

          pdf.save(`Заявка №${actDetail.id}.pdf`)
        })
        .catch((error) => {
          console.error('Ошибка при создании PDF:', error)
        })
    }
  }

  return (
    <CCard className="mt-4 px-0">
      <CCardHeader>
        <div>Акт отбора проб № {actDetail.id}</div>
      </CCardHeader>
      <CCardBody style={{ padding: '4rem 4rem' }} ref={componentRef}>
        <CForm>
          {/* Заголовок при просмотре */}
          {isView && (
            <div
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: '2rem',
              }}
            >
              <p>Акт отбора проб № {actDetail.id}</p>
            </div>
          )}
          {/* Наименование организации */}
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <CFormLabel style={{ width: '40%' }}>
              Наименование организации:
            </CFormLabel>
            {isView ? (
              <span style={{ width: '60%' }}>
                {actDetail?.nameOfCompany || 'Не выбрано'}
              </span>
            ) : (
              <CFormInput
                type="text"
                placeholder='ООО "БТС-МОСТ"'
                style={{ width: '60%' }}
                value={actDetail?.nameOfCompany}
                onChange={(e) => {
                  handleChangeActDetail('nameOfCompany', e.target.value)
                }}
              />
            )}
          </div>

          {/* Наименование объекта */}
          <div
            style={{ display: 'flex', flexDirection: 'row', paddingTop: '2%' }}
          >
            <CFormLabel style={{ width: '40%' }}>
              Наименование объекта:
            </CFormLabel>
            {isView ? (
              <span style={{ width: '60%' }}>
                {actDetail?.researchObjects?.name || 'Не выбрано'}
              </span>
            ) : (
              <CFormInput
                type="text"
                placeholder="Введите наименование объекта"
                style={{ width: '60%' }}
                value={actDetail?.researchObjects?.name || 'Не выбрано'}
                onChange={(e) => {
                  handleChangeActDetail('researchObjects.name', e.target.value)
                }}
              />
            )}
          </div>

          {/* Место отбора проб */}
          <div
            style={{ display: 'flex', flexDirection: 'row', paddingTop: '2%' }}
          >
            <CFormLabel style={{ width: '40%' }}>Место отбора проб:</CFormLabel>
            {isView ? (
              <span style={{ width: '60%' }}>
                {actDetail?.samplingLocation || 'Не выбрано'}
              </span>
            ) : (
              <CFormInput
                type="text"
                placeholder="Введите место отбора проб"
                style={{ width: '60%' }}
                value={actDetail?.samplingLocation || 'Не выбрано'}
                onChange={(e) => {
                  handleChangeActDetail('samplingLocation', e.target.value)
                }}
              />
            )}
          </div>

          {/* Объект контроля */}
          <div
            style={{ display: 'flex', flexDirection: 'row', paddingTop: '2%' }}
          >
            <CFormLabel style={{ width: '40%' }}>Объект контроля:</CFormLabel>
            {isView ? (
              <span style={{ width: '60%' }}>
                {actDetail?.objectControl || 'Не выбрано'}
              </span>
            ) : (
              <CFormInput
                type="text"
                placeholder="Введите объект контроля"
                style={{ width: '60%' }}
                value={actDetail?.objectControl || 'Не выбрано'}
                onChange={(e) => {
                  handleChangeActDetail('objectControl', e.target.value)
                }}
              />
            )}
          </div>

          {/* Дата отбора проб */}
          <div
            style={{ display: 'flex', flexDirection: 'row', paddingTop: '2%' }}
          >
            <CFormLabel style={{ width: '40%' }}>Дата отбора проб:</CFormLabel>
            {isView ? (
              <span style={{ width: '60%' }}>
                {actDetail?.samplingDate
                  ? new Date(actDetail.samplingDate).toLocaleDateString(
                      'ru-RU',
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      },
                    )
                  : 'Не выбрано'}
              </span>
            ) : (
              <CDatePicker
                required
                placeholder="Выберите дату"
                style={{ width: '60%' }}
                locale="ru-RU"
                date={
                  actDetail?.samplingDate
                    ? new Date(actDetail.samplingDate)
                    : null
                }
                onDateChange={(date: Date | null) => {
                  handleChangeActDetail(
                    'samplingDate',
                    date ? date.toISOString() : null,
                  )
                }}
                weekdayFormat={1}
              />
            )}
          </div>

          {/* Время отбора проб */}
          <div
            style={{ display: 'flex', flexDirection: 'row', paddingTop: '2%' }}
          >
            <CFormLabel style={{ width: '40%' }}>Время отбора проб:</CFormLabel>
            {isView ? (
              <span style={{ width: '60%' }}>
                {actDetail?.samplingTime || 'Не выбрано'}
              </span>
            ) : (
              <CTimePicker
                seconds={false}
                placeholder="Выберите время"
                style={{ width: '60%' }}
                time={actDetail?.samplingTime ?? ''}
                locale="ru-RU"
                onTimeChange={(time: string | null) => {
                  handleChangeActDetail('samplingTime', time)
                }}
              />
            )}
          </div>

          {/* Наименование материала */}
          <div
            style={{ display: 'flex', flexDirection: 'row', paddingTop: '2%' }}
          >
            <CFormLabel style={{ width: '40%' }}>
              Наименование материала:
            </CFormLabel>
            {isView ? (
              <span style={{ width: '60%' }}>
                {actDetail?.materialName || 'Не выбрано'}
              </span>
            ) : (
              <CFormInput
                required
                type="text"
                placeholder="Введите наименование материала"
                style={{ width: '60%' }}
                value={actDetail?.materialName || ''}
                onChange={(e) => {
                  handleChangeActDetail('materialName', e.target.value)
                }}
              />
            )}
          </div>

          {/* Количество образцов */}
          <div
            style={{ display: 'flex', flexDirection: 'row', paddingTop: '2%' }}
          >
            <CFormLabel style={{ width: '40%' }}>
              Количество образцов:
            </CFormLabel>
            {isView ? (
              <span style={{ width: '60%' }}>
                {actDetail?.samplingQuantity || 'Не выбрано'}
              </span>
            ) : (
              <CFormInput
                type="text"
                placeholder="Введите количество образцов"
                style={{ width: '60%' }}
                value={actDetail?.samplingQuantity || ''}
                onChange={(e) => {
                  handleChangeActDetail('samplingQuantity', e.target.value)
                }}
              />
            )}
          </div>

          {/* Документ о качестве */}
          <div
            style={{ display: 'flex', flexDirection: 'row', paddingTop: '2%' }}
          >
            <CFormLabel style={{ width: '40%' }}>
              Документ о качестве:
            </CFormLabel>
            {isView ? (
              <span style={{ width: '60%' }}>
                {actDetail?.qualityDocument || 'Не выбрано'}
              </span>
            ) : (
              <CFormInput
                type="text"
                placeholder="Введите № документа о качестве"
                style={{ width: '60%' }}
                value={actDetail?.qualityDocument || ''}
                onChange={(e) => {
                  handleChangeActDetail('qualityDocument', e.target.value)
                }}
              />
            )}
          </div>

          {/* Ответственное лицо */}
          <div
            style={{ display: 'flex', flexDirection: 'row', paddingTop: '2%' }}
          >
            <CFormLabel style={{ width: '40%' }}>
              Ответственное лицо:
            </CFormLabel>
            {isView ? (
              <span style={{ width: '60%' }}>
                {actDetail?.respUser || 'Не выбрано'}
              </span>
            ) : (
              <CFormInput
                type="text"
                placeholder="Выберите ответственного сотрудника"
                style={{ width: '60%' }}
                value={actDetail?.respUser || ''}
                onChange={(e) => {
                  handleChangeActDetail('respUser', e.target.value)
                }}
              />
            )}
          </div>

          {/* Примечание */}
          <div
            style={{ display: 'flex', flexDirection: 'row', paddingTop: '2%' }}
          >
            <CFormLabel style={{ width: '40%' }}>Примечание:</CFormLabel>
            {isView ? (
              <span style={{ width: '60%' }}>
                {actDetail?.note || 'Не выбрано'}
              </span>
            ) : (
              <CFormInput
                type="text"
                placeholder="Введите примечания"
                style={{ width: '60%' }}
                value={actDetail?.note || ''}
                onChange={(e) => {
                  handleChangeActDetail('note', e.target.value)
                }}
              />
            )}
          </div>

          {/* Условия окружающей среды */}
          <div
            style={{ display: 'flex', flexDirection: 'row', paddingTop: '2%' }}
          >
            <CFormLabel style={{ width: '40%' }}>
              Условия окружающей среды:
            </CFormLabel>
            {isView ? (
              <span style={{ width: '60%', whiteSpace: 'normal' }}>
                {actDetail?.environmental || 'Не выбрано'}
              </span>
            ) : (
              <CFormInput
                type="text"
                placeholder="Введите условия окружающей среды"
                style={{ width: '60%' }}
                value={actDetail?.environmental || ''}
                onChange={(e) => {
                  handleChangeActDetail('environmental', e.target.value)
                }}
              />
            )}
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

export default OrderActDetailCard
