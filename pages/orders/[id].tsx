import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from "next-auth/react"
import { useRouter } from 'next/router';

import { Typography, Grid, Card, CardContent, Divider, Box, Chip, CircularProgress } from "@mui/material"
import { CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material"

import { PayPalButtons } from "@paypal/react-paypal-js";


import { CartList, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layouts"
import { dbOrders } from "../../database"
import { IOrder } from "../../interfaces"
import { countries } from "../../utils"
import { tesloApi } from '../../api';

export type OrderResponseBody = {
  id: string;
  status:
      | "COMPLETED"
      | "SAVED"
      | "APPROVED"
      | "VOIDED"
      | "PAYER_ACTION_REQUIRED";
};

interface Props {
  order: IOrder
}

const OrderPage:NextPage<Props> = ({ order }) => {

  const router = useRouter()

  const { _id, isPaid, summary : { numberOfItems }, shippingAddress, orderItems, summary } = order
  const { firstName, lastName, address, zip, phone, city, country } = shippingAddress

  const [isPaying, setIsPaying] = useState(false)

  const onOrderCompleted = async (details:OrderResponseBody) => {

    if(details.status !== 'COMPLETED') {return alert('No hay pago en Paypal')}

    setIsPaying(true)

    try {
      const { data } = await tesloApi.post(`/orders/pay`, {
        transaction_id: details.id,
        order_id: _id
      })

      router.reload()
    } catch (error) {
      console.log(error);
      alert('Error')
      setIsPaying(false)
    }
  }

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

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>

                {
                  isPaying
                  ? (
                      <Box display='flex' justifyContent='center' className='fadeIn'>
                        <CircularProgress/>
                      </Box>
                    )
                  : (
                    <Box>
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
                            <PayPalButtons
                              createOrder={(data, actions) => {
                                return actions.order.create({
                                  purchase_units: [
                                    {
                                      amount: {
                                        value: order.summary.total.toString(),
                                      },
                                    },
                                  ],
                                });
                              }}
                              onApprove={(data, actions) => {
                                return actions.order.capture().then((details) => { onOrderCompleted(details) });
                              }}
                            />
                          )
                      }
                    </Box>
                  )
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