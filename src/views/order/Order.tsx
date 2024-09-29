import { CRow } from '@coreui/react-pro'
import { FC, useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import OrderActDetailCard from '../../components/OrderActDetailCard'
import OrderAssignResponsibleCard from '../../components/OrderAssignResponsibleCard'
import OrderCommentsCard from '../../components/OrderCommentsCard'
import OrderDocumentsCard from '../../components/OrderDocumentsCard'
import OrderInfoCard from '../../components/OrderInfoCard'
import OrderLoadingSpinner from '../../components/OrderLoadingSpinner'
import OrderProtocolsCard from '../../components/OrderProtocolsCard'
import { useTypedSelector } from '../../store'
import { OrderStatus } from '../../typings'
import OrderApi from './order.api'

const OrderDetail: FC = () => {
  const params = useParams<{ id: string }>()
  const [data, setData] = useState<any>({
    id: 0,
    createdAt: '',
    user: {},
    responsibleUser: {},
    documents: [],
    comments: [],
    protocols: [],
    samplingAct: {},
    status: '',
    employeesList: [],
    labInfo: {},
    testDate: '',
    testTime: '',
    typeJob: '',
    researchObjects: { name: '' },
    objectControl: '',
    samplingLocation: '',
    name: '',
    description: '',
  })
  const [loading, setLoading] = useState(true)
  const [testDate, setTestDate] = useState<string | null>(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const dataUser = useTypedSelector((state) => state.dataUser)
  const isLabUser = useTypedSelector((state) => state.isLabRole)
  const isCompanyAdmin = useTypedSelector(
    (state) => state.dataUser.role === 'companyadmin',
  )
  const [searchParams] = useSearchParams()
  const companyGlobalState = useTypedSelector((state) => state.company)
  const isView = searchParams.get('view') === 'true'
  const isCompany = dataUser?.role?.includes('company')

  const [actDetail, setActDetail] = useState<any>({
    samplingDate: '',
    samplingTime: '',
    respCompUserId: null,
    materialName: '',
    user: '',
    note: '',
    samplingQuantity: '',
    qualityDocument: '',
    id: null,
    environmental: '',
    nameOfCompany: '',
    researchObjects: { name: '' },
    objectControl: '',
    samplingLocation: '',
  })

  const getData = useCallback(
    async (abortController: AbortController, id: string) => {
      setLoading(true)
      try {
        const response = await OrderApi.getOrderById(+id, abortController)
        // Перенаправление, если пользователь не имеет доступа
        if (
          (isLabUser && !isView && !response.data.isSelf) ||
          response.data.status === OrderStatus.DONE
        ) {
          navigate(`/orders/${params.id}?view=true`, { replace: true })
          return
        }

        setData(response.data)
        setTestDate(response.data.testDate)

        const samplingAct = response.data.samplingAct

        if (samplingAct) {
          setActDetail({
            ...samplingAct,
            nameOfCompany: response.data.user?.company?.name || 'Не выбрано',
            researchObjects: response.data.researchObjects || {
              name: 'Не выбрано',
            },
            objectControl: response.data.objectControl || 'Не выбрано',
            samplingLocation: response.data.samplingLocation || 'Не выбрано',
          })
        } else {
          setActDetail({
            nameOfCompany: response.data.user?.company?.name || 'Не выбрано',
            researchObjects: response.data.researchObjects || {
              name: 'Не выбрано',
            },
            objectControl: response.data.objectControl || 'Не выбрано',
            samplingLocation: response.data.samplingLocation || 'Не выбрано',
          })
        }
      } catch (error) {
        dispatch({
          type: 'toast',
          toast: {
            message: 'Ошибка загрузки данных заказа.',
            status: 'danger',
          },
        })
      } finally {
        setLoading(false)
      }
    },
    [isLabUser, isView, navigate, params.id, dispatch],
  )

  useEffect(() => {
    const abortController = new AbortController()
    const id = params?.id

    if (!id || Number.isNaN(Number.parseInt(id))) {
      navigate(`/orders`, { replace: true })
      return
    }

    dispatch({ type: 'set', order: `${id}` })
    getData(abortController, id)

    return () => {
      abortController.abort()
    }
  }, [params.id, getData, dispatch, navigate])

  // Функция для обработки изменений в actDetail
  const handleChangeActDetail = (key: string, value: any) => {
    setActDetail((prevActDetail: any) => ({
      ...prevActDetail,
      [key]: value,
    }))
  }

  if (loading) {
    return <OrderLoadingSpinner />
  }

  return (
    <CRow>
      <OrderInfoCard
        data={data}
        isView={isView}
        getDate={(date, time) =>
          time
            ? new Date(date).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : new Date(date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
        }
      />
      <OrderActDetailCard
        actDetail={actDetail}
        handleChangeActDetail={handleChangeActDetail}
        isView={isView}
        getDate={(date, time) =>
          time
            ? new Date(date).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : new Date(date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
        }
      />
      <OrderDocumentsCard documents={data.documents} orderId={params.id!} />
      <OrderCommentsCard comments={data.comments} orderId={params.id!} />
      <OrderProtocolsCard
        protocols={data.protocols}
        orderId={params.id!}
        isLabUser={isLabUser}
      />
      {!isCompany &&
        (data.status === OrderStatus.NEW ||
          data.status === OrderStatus.WIP) && (
          <OrderAssignResponsibleCard
            status={data.status}
            responsibleUserId={data.responsibleUserId}
            employeesList={data.employeesList}
            onChange={(value) => {
              setData({ ...data, responsibleUserId: value })
            }}
            testDate={testDate}
            onTestDateChange={(date: string | null) => setTestDate(date)}
          />
        )}
    </CRow>
  )
}

export default OrderDetail
