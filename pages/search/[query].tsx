import type { NextPage, GetServerSideProps } from 'next'
import { Box, Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { dbProducts } from '../../database'
import { IProduct } from '../../interfaces'

interface Props {
  products: IProduct[]
  foundProduct: boolean
  query: string
}

const SearchPage: NextPage<Props> = ({ products, foundProduct, query }) => {
  return (
    <ShopLayout title={'Teslo-Shop - Search'} pageDescription={'Encuenta los mejores productos de Teslo aqui'}>
      <Typography variant='h1' component='h1'>Busqueda</Typography>
      {
        foundProduct
          ? <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>Termino de busqueda: { query }</Typography>
          : (
            <Box display='flex'>
              <Typography variant='h2' sx={{ mb: 1 }}>No se han encontrado productos.</Typography>
              <Typography variant='h2' sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>{ query }</Typography>
            </Box>
          )
      } 
      <ProductList products={ products }/>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const { query = '' } = params as { query:string }

  if(query.length === 0) return { redirect: { destination: '/', permanent: true } }

  let products = await dbProducts.getProductsByTerm(query)
  const foundProduct = products.length > 0
  
  if(!foundProduct) products = await dbProducts.getAllProducts(5)

  // TODO : retornar otros productos
  return {
    props: {
      products,
      foundProduct,
      query
    }
  }
}

export default SearchPage