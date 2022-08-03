import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import NextLink from 'next/link'
import { getSession, signIn } from 'next-auth/react';

import { Box, Grid, Typography, Link,  TextField, Button, Chip } from "@mui/material"
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils';
import { AuthContext } from '../../context';

type FormData = {
  name    : string
  email   : string
  password: string
};

const RegisterPage = () => {

  const router = useRouter()
  const destination = router.query.p?.toString() || '/'

  const { registerUser } = useContext(AuthContext)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const onRegister = async({ name, email, password }:FormData) => {

    setShowError(false)

    const { hasError, message } = await registerUser(name, email, password)

    if(hasError) {
      setShowError(true)
      setErrorMessage( message! )
      setTimeout(() => {
        setShowError(false)
      }, 3000);
      return
    }

    // router.replace(destination)
    await signIn('credentials', { email, password })

  }

  return (
    <AuthLayout title='ingresar'>
      <form onSubmit={ handleSubmit(onRegister) }>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>Registrarse</Typography>
              <Chip
                label={errorMessage}
                color='error'
                icon={ <ErrorOutline />}
                className='fadeIn'
                sx={{ 
                  display: showError ? 'flex' : 'none',
                  my: 1
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                label='Nombre' 
                variant='filled' 
                fullWidth
                { ...register('name', {
                  required: 'Este campo es obligatorio',
                  minLength: { value: 2, message: 'Debe ingresar al menos 2 caracteres'}
                }) }
                error={ !!errors.name }
                helperText={ errors.name?.message }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                label='Correo' 
                variant='filled' 
                fullWidth
                { ...register('email', {
                  required: 'Este campo es obligatorio',
                  validate: validations.isEmail
                }) }
                error={ !!errors.email }
                helperText={ errors.email?.message }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                label='Contrasena' 
                variant='filled' 
                fullWidth 
                type='password'
                { ...register('password', {
                  required: 'Este campo es obligatorio',
                  minLength: { value: 6, message: 'Debe ingresar al menos 6 caracteres'}
                })}
                error={ !!errors.password }
                helperText={ errors.password?.message }
              />
            </Grid>

            <Grid item xs={12}>
              <Button 
                color='secondary' 
                className='circular-btn' 
                size='large' 
                fullWidth
                type='submit'
              >
                Crear cuenta
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href={`/auth/login?p=${destination}`} passHref>
                <Link underline='always'>
                  Ya tienes una cuenta?
                </Link>
              </NextLink>
            </Grid>

          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  
  const { p = '/' } = query
  const session = await getSession({req})

  if( session ) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

export default RegisterPage