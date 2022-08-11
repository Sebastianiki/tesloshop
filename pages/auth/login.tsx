import { useContext, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/router';
import { getSession, signIn, getProviders } from 'next-auth/react';

import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils';
import { AuthContext } from '../../context';

type FormData = {
  email   : string,
  password: string,
};

const LoginPage = () => {

  const router = useRouter()
  const { loginUser } = useContext( AuthContext );

  const destination = router.query.p?.toString() || '/'

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false)

  const [providers, setProviders] = useState<any>({})

  useEffect(() => {
    getProviders().then( prov => {
      setProviders(prov)
    })
  }, [])
  

  const onLogin = async ({email, password}:FormData) => {

    setShowError(false)

    const isLogin = await loginUser( email, password )

    if(!isLogin) {
      setShowError(true)
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
      <form onSubmit={ handleSubmit(onLogin) }>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>

            <Grid item xs={12} >
              <Typography variant='h1' component='h1'>Iniciar Sesion</Typography>
              <Chip 
                label='Correo y/o contrasena no validos'
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
                type='email'
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
                  minLength: { value:6, message: 'La contrasena debe de tener minimo 6 caracteres'}
                  
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
                type='submit'
                fullWidth
              >
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href={`/auth/register?p=${destination}`} passHref>
                <Link underline='always'>
                  No tienes cuenta?
                </Link>
              </NextLink>
            </Grid>

            <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
              <Divider sx={{ width: '100%', mb: 2 }}/>
              {
                Object.values(providers).map( (provider:any) => {

                  if( provider.id === 'credentials') return (<div key={provider.id}></div>)

                  return(
                    <Button
                      key={provider.id}
                      variant='outlined'
                      fullWidth
                      color='primary'
                      sx={{ mb:1 }}
                      onClick={() => signIn( provider.id )}
                    >
                      { provider.name }
                    </Button>
                  )
                })
              }
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

export default LoginPage