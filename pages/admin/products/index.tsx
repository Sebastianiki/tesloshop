import NextLink from 'next/link'

import useSWR from 'swr';
import { Box, Button, CardMedia, Grid, Link } from '@mui/material'
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { AdminLayout } from '../../../components/layouts';
import { IProduct } from '../../../interfaces';

const columns:GridColDef[] = [
  { 
    field: 'img', 
    headerName: 'Foto',
    renderCell: ({row}:GridValueGetterParams) => {
      return (
        <a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
          <CardMedia
            component='img'
            alt={ row.title }
            className='fadeIn'
            image={row.image}
          />
        </a>
      )
    }
  },
  { 
    field: 'title', 
    headerName: 'Nombre', 
    width: 250,
    renderCell: ({row}:GridValueGetterParams) => {
      return (
        <NextLink href={`/admin/products/${ row.slug }`} passHref>
          <Link underline='always'>{ row.title }</Link>
        </NextLink>
      )
    }
   },
  { field: 'gender', headerName: 'Genero', width: 100 },
  { field: 'type', headerName: 'Tipo', width: 150 },
  { field: 'inStock', headerName: 'Existencias', width: 100, align: 'center' },
  { field: 'price', headerName: 'Precio Venta', width: 100, align: 'center' },
  { field: 'sizes', headerName: 'Tallas', width: 150 },
]

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>('/api/admin/products')

  if( !data && !error) return <></>
  
  const rows = data!.map( ({ _id, images, title, gender, type, inStock, price, sizes, slug }) => ({
    id: _id,
    image: images[0],
    title,
    gender, 
    type,
    inStock, 
    price,
    sizes: sizes.join(', '),
    slug
  }))
  

  return (
    <AdminLayout
      title={`Productos (${data?.length})`} 
      subTitle={'Mantenimiendo de productos'}
      icon={ <CategoryOutlined/> }
    >
      <Box display='flex' justifyContent='end' sx={{ mb:2 }}>
        <Button
          startIcon={ <AddOutlined/> }
          color='secondary'
          href='/admin/products/new_product'
        >
          Crear Producto
        </Button>
      </Box>
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

export default ProductsPage