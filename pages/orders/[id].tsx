import NextLink from "next/link"
import { GetServerSideProps, NextPage } from 'next'

import { Typography, Grid, Card, CardContent, Divider, Link, Box, Chip } from "@mui/material"
import { CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material"

import { CartList, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layouts"
import { getSession } from "next-auth/react"
import { dbOrders } from "../../database"
import { IOrder } from "../../interfaces"
import { countries } from "../../utils"

interface Props {
  order: IOrder
}

const OrderPage:NextPage<Props> = ({ order }) => {

  const { _id, isPaid, summary : { numberOfItems }, shippingAddress, orderItems, summary } = order
  const { firstName, lastName, address, zip, phone, city, country } = shippingAddress

  return (
    <ShopLayout title='Resumen de compra' pageDescription='Resumen de la orden'>
      <Typography variant='h1' component='h1'>Resumen de la compra</Typography>
      <Typography variant='h2' component='h2'>Orden: {_id}</Typography>

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

              <Box sx={{ mt: 3 }}>
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
                    : <Typography variant="h1" component='h1'>Pagar</Typography>
                }
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {

  const { id = '' } = query

  const session:any = await getSession({req})

  const order = await dbOrders.getOrderById(id.toString())

  if(!order || (order.user !== session?.user._id))  return { redirect: { destination: '/orders/history', permanent: false } }
  
  return {
    props: {
      order
    }
  }
}

export default OrderPage