import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link'

import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material'
import Cookies from 'js-cookie';

import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { CartContext } from '../../context'
import { countries } from '../../utils'
import { useRouter } from 'next/router';

const SummaryPage = () => {

  const router = useRouter()
  const { shippingAddress, orderSummary, createOrder } = useContext(CartContext)

  const [isPosting, setIsPosting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')


  useEffect(() => {
    if(!Cookies.get('address')) router.push('/checkout/address')
  }, [router])
  
  if(!shippingAddress) return <></>

  const { numberOfItems } = orderSummary
  const { firstName, lastName, address, city, country, zip, phone, address2  } = shippingAddress

  const onCreateOrder = async () => {
    setIsPosting(true)
    const { hasError, message } = await createOrder()

    if(hasError) {
      setIsPosting(false)
      setErrorMessage(message)
      return
    }

    router.replace(`/orders/${message}`)
  }

  return (
    <ShopLayout title='Resumen de compra' pageDescription='Resumen de la orden'>
      <Typography variant='h1' component='h1'>Resumen de la compra</Typography>
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12} sm={7}>
          <CartList/>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Resumen ({ numberOfItems } {numberOfItems > 1 ? 'producto' : 'producto'})</Typography>
              <Divider sx={{ my: 1 }}/>

              <Box display='flex' justifyContent='end'>
                <NextLink href={'/checkout/address'} passHref>
                  <Link underline='always'>
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <Typography variant='subtitle1'>Direccion de entrega</Typography>
              <Typography>{`${firstName} ${lastName}`}</Typography>
              <Typography>{ address }</Typography>
              {
                address2 && <Typography>{ address2 }</Typography>
              }
              <Typography>{ zip }</Typography>
              <Typography>{`${city}, ${countries.find( c => c.code === country)?.name}`}</Typography>
              <Typography>{ phone }</Typography>

              <Divider sx={{ my: 1 }}/>

              <Box display='flex' justifyContent='end'>
                <NextLink href={'/cart'} passHref>
                  <Link underline='always'>
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <OrderSummary/>

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Button 
                  disabled={ isPosting }
                  color='secondary' 
                  className='circular-btn' 
                  fullWidth
                  onClick={ onCreateOrder }
                >
                  Cofirmar pedido
                </Button>

                <Chip
                  color='error'
                  label={ errorMessage }
                  sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage