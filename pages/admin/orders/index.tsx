import useSWR from 'swr';
import { Chip, Grid } from '@mui/material'
import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { AdminLayout } from '../../../components/layouts'
import { IOrder, IUser } from '../../../interfaces';

const columns:GridColDef[] = [
  { field: 'id', headerName: 'Orden ID', width: 250 },
  { field: 'email', headerName: 'Correo', width: 250 },
  { field: 'name', headerName: 'Nombre Completo', width: 250 },
  { field: 'total', headerName: 'Monto Total', width: 150 },
  { 
    field: 'isPaid', 
    headerName: 'Estado del pago',
    renderCell: ({ row }:GridValueGetterParams) => {
      return row.isPaid
        ? <Chip color="success" label='Pagada' variant="outlined"/>
        : <Chip color="error" label='No pagada' variant="outlined"/>
    },
    width: 150
  },
  { field: 'quantity', headerName: 'Cantidad de Productos', align: 'center', width: 200 },
  { 
    field: 'check', 
    headerName: 'Ver Orden',
    renderCell: ({ row }:GridValueGetterParams) => {
      return <a href={`/admin/orders/${ row.id }`} target='_blank' rel="noreferrer">Ver Orden</a>
    }
  },
  { field: 'createdAt', headerName: 'Fecha de pedido', width: 250 },
]

const OrdersPage = () => {

  const { data, error } = useSWR<IOrder[]>('/api/admin/orders')

  if( !data && !error) return <></>

  const rows = data!.map( order => ({
    id : order._id,
    email : (order.user as IUser).email,
    name : (order.user as IUser).name,
    total : order.summary.total,
    isPaid : order.isPaid,
    quantity : order.summary.numberOfItems,
    createdAt: order.createdAt
  }))

  return (
    <AdminLayout 
      title={'Ordenes'} 
      subTitle={'Mantenimiendo de ordenes'}
      icon={ <ConfirmationNumberOutlined/> }
    >
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid 
            rows={ rows }
            columns={ columns }
            pageSize={ 10 }
            rowsPerPageOptions={ [10] }
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default OrdersPage