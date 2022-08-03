import { useState, useContext } from 'react';
import { NextPage, GetStaticPaths, GetStaticProps } from "next"
import { Box, Button, Chip, Grid, Typography } from "@mui/material"

import { ShopLayout } from "../../components/layouts"
import { SizeSelector, SlideShow } from "../../components/products"
import { ItemCounter } from "../../components/ui"

import { getProductBySlug, getAllProductSlugs } from '../../database/dbProducts';
import { IProduct, ICartProduct, ISize } from "../../interfaces"
import { CartContext } from '../../context';

interface Props {
  product: IProduct
}

const ProductPage:NextPage<Props> = ({ product }) => {

  const { addProductToCart } = useContext(CartContext)

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    inStock: product.inStock,
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1
  })

  const changeSize = (size:ISize) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      size
    }))
  }

  const onUpdatedQuantity = (quantity:number) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      quantity
    }))
  }

  const addToCart = () => {
    if(!tempCartProduct.size) return

    addProductToCart(tempCartProduct)
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        
        <Grid item xs={12} sm={7}>
          {/* SlideShow */}
          <SlideShow images={ product.images }/>
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            {/* titulos */}
            <Typography variant="h1" component='h1'>{ product.title }</Typography>
            <Typography variant="subtitle1" component='h2'>{ `$${product.price}` }</Typography>

            {/* cantidad */}
            <Box sx={{ my: 2}}>
              <Typography variant="subtitle2">Cantidad</Typography>
              {/* ItemCounter */}
              <ItemCounter
                currentValue={ tempCartProduct.quantity }
                maxValue={ tempCartProduct.inStock }
                updatedQuantity= { onUpdatedQuantity }
              />
              <SizeSelector
                sizes={product.sizes} 
                selectedSize={ tempCartProduct.size }
                onSelectedSize={ changeSize }
              />
            </Box>

            {/* Agregar al carrito */}
            {
              product.inStock === 0 
                ? ( <Chip label='Sin Stock' color='error' variant="outlined"/> )
                : (
                  <Button 
                    color="secondary" 
                    className="circular-btn"
                    onClick={addToCart}
                  >
                    {
                      tempCartProduct.size
                        ? 'Agregar al carrito'
                        : 'Seleccione una talla'
                    }
                  </Button>
                )
            }

            {/* Descripcion */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" component='h2'>Descripcion</Typography>
              <Typography variant="body2" component='h2'>{ product.description }</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs:string[] = (await getAllProductSlugs()).map( ({slug}) => slug)
   
  return {
    paths: slugs.map( slug => ({ params: {slug} }) ),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  
  const { slug = ''} = params as { slug: string}
  const product = await getProductBySlug(slug) 

  if (!product) return { redirect: { destination: '/', permanent: false } }

  return {
    props: {
      product
    },
    revalidate: 86400
  }
}

export default ProductPage