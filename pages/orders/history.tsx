import NextLink from 'next/link'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react';

import { Chip, Grid, Link, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { ShopLayout } from "../../components/layouts"
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

const columns:GridColDef[] = [
  { field: 'id', headerName: 'N Orden', width: 250},
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Muestra informacion sobre el estado del pago',
    width: 200,
    renderCell: (params:GridValueGetterParams) => {
      return (
        params.row.isPaid
          ? <Chip color="success" label='Pagada' variant="outlined"/>
          : <Chip color="error" label='No pagada' variant="outlined"/>
      )
    }
  },
  {
    field: 'orden',
    headerName: 'Ver Orden',
    width: 200,
    renderCell: (params:GridValueGetterParams) => (
      <NextLink href={`/orders/${ params.row._id }`} passHref>
        <Link underline='always'>
          Ver orden
        </Link>
      </NextLink>
    ),
    sortable: false
  }
]

// const rows = [
//   { id: 1, paid: true, fullName: 'Rafael Reyes' },
//   { id: 2, paid: false, fullName: 'Sebastian Reyes' },
//   { id: 3, paid: false, fullName: 'Benjamin Reyes' },
//   { id: 4, paid: true, fullName: 'Barbara Reyes' },
//   { id: 5, paid: false, fullName: 'Veronica Uribe' }
// ]

interface Props {
  orders : IOrder[]
}

const HistoryPage:NextPage<Props> = ({ orders }) => {

  const rows = orders.map(({_id, isPaid}, idx) => ({
    id: _id,
    isPaid,
    _id
  }))
  
  return (
    <ShopLayout title={"Historial de compras"} pageDescription={"Historial de ordenes del cliente"}>
      <Typography variant="h1" component='h1'>Historial de ordenes</Typography>

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
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ req }) => {

  const session:any = await getSession({req})

  const orders = await dbOrders.getOrdersByUserId(session.user._id)

  return {
    props: {
      orders
    }
  }
}

export default HistoryPage