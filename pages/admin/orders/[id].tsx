import { NextPage, GetServerSideProps } from 'next'

import { AdminLayout } from '../../../components/layouts'
import { IOrder } from '../../../interfaces'
import { getSession } from 'next-auth/react'
import { dbOrders } from '../../../database'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'
import { Grid, Card, CardContent, Typography, Divider, Box, Chip } from '@mui/material'
import { CartList, OrderSummary } from '../../../components/cart'
import { countries } from '../../../utils'

interface Props {
  order: IOrder
}

const OrderPage:NextPage<Props> = ({ order }) => {

  const { _id, isPaid, summary : { numberOfItems }, shippingAddress, orderItems, summary } = order
  const { firstName, lastName, address, zip, phone, city, country } = shippingAddress

  return (
    <AdminLayout 
      title={'Orden numero'} 
      subTitle={_id!}
    >
      <Grid container sx={{ mt: 2 }} className='fadeIn'>
        <Grid item xs={12} sm={7}>
          <CartList products={orderItems}/>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Resumen ({numberOfItems} { numberOfItems > 1 ? 'productos' : 'producto'})</Typography>

              <Divider sx={{ my: 1 }}/>

              <Typography variant='subtitle1'>Direccion de entrega</Typography>
              <Typography>{ `${firstName} ${lastName}` }</Typography>
              <Typography>{ address }</Typography>
              <Typography>{ zip }</Typography>
              <Typography>{`${city}, ${countries.find( c => c.code === country)?.name}`}</Typography>
              <Typography>{ `+${phone}` }</Typography>

              <Divider sx={{ my: 1 }}/>

              <OrderSummary summary={summary}/>

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                {
                  isPaid
                    ? (
                      <Chip 
                        sx={{ my: 2 }} 
                        label='Orden pagada' 
                        variant='outlined'
                        color='success'
                        icon={ <CreditScoreOutlined/> }
                      />
                    )
                    : (
                      <Chip 
                        sx={{ my: 2 }} 
                        label='Pendiente de pago' 
                        variant='outlined'
                        color='error'
                        icon={ <CreditCardOffOutlined/> }
                      />
                    )
                }
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  const { id = '' } = query
  const session:any = await getSession({req})

  const order = await dbOrders.getOrderById(id.toString())
  
  return {
    props: {
      order
    }
  }
}

export default OrderPage