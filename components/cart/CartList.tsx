import { FC, useContext } from 'react';
import NextLink from 'next/link'
import { Grid, Link, Typography, CardActionArea, CardMedia, Box, Button } from '@mui/material';
import { ItemCounter } from '../ui';
import { CartContext } from '../../context';
import { ICartProduct, IOrderItem } from '../../interfaces';

interface Props {
  editable?: boolean;
  products?: IOrderItem[]
}

export const CartList:FC<Props> = ({ editable = false, products }) => {

  const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext)

  const onChangeQuantity = (product:ICartProduct, newQuantity:number) => {
    product.quantity = newQuantity;
    updateCartQuantity(product)
  }

  const productsToShow = products ? products : cart

  return (
    <>
      {
        productsToShow.map(product => {
          return (
            <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
              <Grid item xs={3}>
                <NextLink href={`/product/${ product.slug }`} passHref>
                  <Link>
                    <CardActionArea>
                      <CardMedia
                        image={`/products/${product.image}`}
                        component='img'
                        sx={{ borderRadius: '5px' }}
                      />
                    </CardActionArea>
                  </Link>
                </NextLink>
              </Grid>
              <Grid item xs={7}>
                <Box display='flex' flexDirection='column'>
                  <Typography variant='body1'>{ product.title }</Typography>
                  <Typography variant='body1'>Talla: <strong>{ product.size }</strong></Typography>
                  {
                    editable
                      ? (
                        <ItemCounter
                          currentValue={product.quantity}
                          maxValue={(product as ICartProduct).inStock}
                          updatedQuantity={(value) => onChangeQuantity(product as ICartProduct, value)}
                        />
                      )
                      : <Typography variant='h6'>{product.quantity} {product.quantity > 1 ? 'productos' : 'producto'}</Typography>
                  }
                </Box>
              </Grid>
              <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                <Typography variant='subtitle1'>{ `$${product.price}` }</Typography>
                {
                  editable && (
                    <Button 
                      variant='text' 
                      color='secondary'
                      onClick={() => removeCartProduct(product as ICartProduct)}
                    >
                      Quitar del carrito
                    </Button>
                  )
                }
              </Grid>
            </Grid>
          )
        })
      }
    </>
  )
}