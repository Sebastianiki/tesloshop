import { useContext, useState } from 'react';
import NextLink from "next/link"
import { useRouter } from "next/router"
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material"
import { CartContext, UiContext } from "../../context";

export const Navbar = () => {

  const { push, asPath } = useRouter()
  const { toggleSideMenu } = useContext(UiContext)
  const { orderSummary } = useContext(CartContext)

  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const onSearhTerm = () => {
    if( searchTerm.trim().length === 0) return
    push(`/search/${searchTerm}`)
  }

  // AutoFocus
  const textFieldInputFocus = (inputRef: any) => {
    if (inputRef && inputRef.node !== null) {
      setTimeout(() => {
        inputRef.focus()
      }, 100)
    }
    return inputRef
  }
  let textFieldProps = { inputRef: textFieldInputFocus }

  return (
    <AppBar>
      <Toolbar>
        <NextLink href='/' passHref>
          <Link display='flex' alignItems='center'>
            <Typography variant="h6">Teslo |</Typography>
            <Typography sx={{ ml : 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>

        <Box flex={1}/>

        <Box
          sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}
          className='fadeIn'
        >
          <NextLink href='/category/men' passHref>
            <Link>
              <Button color={ asPath === '/category/men' ? 'primary' : 'info' }>Hombres</Button>
            </Link>
          </NextLink>
          <NextLink href='/category/women' passHref>
            <Link>
              <Button color={ asPath === '/category/women' ? 'primary' : 'info' }>Mujeres</Button>
            </Link>
          </NextLink>
          <NextLink href='/category/kid' passHref>
            <Link>
              <Button color={ asPath === '/category/kid' ? 'primary' : 'info' }>Ninos</Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1}/> 

        {/* Desktop */}
        {
          isSearchVisible
            ? (
              <Input
                sx={{ display: { xs: 'none', sm: 'flex' } }}
                {...textFieldProps}
                className='fadeIn'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && onSearhTerm()}
                type='text'
                placeholder="Buscar..."
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setIsSearchVisible(false)}
                    >
                      <ClearOutlined/>
                    </IconButton>
                  </InputAdornment>
                }
              />
            )
            : (
              <IconButton
                sx={{ display: { xs: 'none', sm: 'flex'}}}
                className='fadeIn'
                onClick={() => setIsSearchVisible(true)}
              >
                <SearchOutlined/>
              </IconButton>
            )
        }
        

        {/* Mobile */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none'}}}
          onClick={ toggleSideMenu }
        >
          <SearchOutlined/>
        </IconButton>

        <NextLink href='/cart' passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={orderSummary.numberOfItems} color='secondary'>
                <ShoppingCartOutlined/>
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button
          onClick={toggleSideMenu}
        >
          Menu
        </Button>
      </Toolbar>
    </AppBar>
  )
}
