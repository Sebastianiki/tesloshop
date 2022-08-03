import { useContext } from 'react'
import { useRouter } from 'next/router'

import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from "@mui/material"
import { useForm } from 'react-hook-form'
import Cookies from 'js-cookie'

import { ShopLayout } from "../../components/layouts"
import { countries } from '../../utils'
import { IShippingAddress } from '../../interfaces'
import { CartContext } from '../../context'

const getAddressFromCookies = () => { return JSON.parse(Cookies.get('address') || '{}') }

const AddressPage = () => {

  const router = useRouter()
  const { updateAddress } = useContext(CartContext)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IShippingAddress>({
    defaultValues: getAddressFromCookies()
  });

  const onSubmit = (values:IShippingAddress) => {
    updateAddress(values)
    router.push('/checkout/summary')
  }

  return (
    <ShopLayout title={"Direccion"} pageDescription={"Confirmar direccion del destino"}>
      <form onSubmit={ handleSubmit(onSubmit) }>
        <Typography variant="h1" component='h1'>Direccion</Typography>

        <Grid container spacing={2} sx={{ mt: 5 }}>

          <Grid item xs={12} sm={6}>
            <TextField 
              label='Nombre/s'  
              variant="filled" 
              fullWidth
              { 
                ...register('firstName', {
                required: 'Este campo es obligatorio'
                }) 
              }
              error={ !!errors.firstName }
              helperText={ errors.firstName?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label='Apellido/s' 
              variant="filled" 
              fullWidth
              { 
                ...register('lastName', {
                required: 'Este campo es obligatorio'
                }) 
              }
              error={ !!errors.lastName }
              helperText={ errors.lastName?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label='Direccion' 
              variant="filled" 
              fullWidth
              { 
                ...register('address', {
                required: 'Este campo es obligatorio'
                }) 
              }
              error={ !!errors.address }
              helperText={ errors.address?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label='Direccion 2 (opcional)' 
              variant="filled" 
              fullWidth
              { 
                ...register('address2') 
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label='Codigo Postal' 
              variant="filled" 
              fullWidth
              { 
                ...register('zip', {
                required: 'Este campo es obligatorio'
                }) 
              }
              error={ !!errors.zip }
              helperText={ errors.zip?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                select 
                variant="filled" 
                label='Pais'
                defaultValue={countries[0].code}
                { 
                  ...register('country', {
                    required: 'Este campo es obligatorio'
                  }) 
                }
                error={ !!errors.country }
              >
                {
                  countries.map( country => (
                    <MenuItem value={country.code} key={country.code}>{country.name}</MenuItem>
                  ))
                }
              </TextField>
              {/* {
                errors.firstName?.message && <FormHelperText>{ errors.firstName?.message }</FormHelperText>
              } */}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label='Ciudad' 
              variant="filled" 
              fullWidth
              { 
                ...register('city', {
                required: 'Este campo es obligatorio'
                }) 
              }
              error={ !!errors.city }
              helperText={ errors.city?.message }
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField 
              label='Telefono' 
              variant="filled" 
              fullWidth 
              type='number'
              { 
                ...register('phone', {
                required: 'Este campo es obligatorio'
                }) 
              }
              error={ !!errors.phone }
              helperText={ errors.phone?.message }
            />
          </Grid>
          
        </Grid>

        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
          <Button 
            color="secondary" 
            className="circular-btn" 
            size="large"
            type='submit'
          >
            Revisar Pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  )
}

export default AddressPage