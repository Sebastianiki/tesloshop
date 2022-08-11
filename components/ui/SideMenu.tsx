import { useContext, useState } from "react"
import { useRouter } from "next/router"

import { 
  Box, 
  Divider, 
  Drawer, 
  IconButton, 
  Input, 
  InputAdornment, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListSubheader 
} from "@mui/material"
import { 
  AccountCircleOutlined, 
  AdminPanelSettings, 
  CategoryOutlined, 
  ConfirmationNumberOutlined, 
  EscalatorWarningOutlined, 
  FemaleOutlined, 
  LoginOutlined, 
  MaleOutlined, 
  SearchOutlined, 
  VpnKeyOutlined,
  DashboardOutlined
} from "@mui/icons-material"

import { AuthContext, UiContext } from "../../context"


export const SideMenu = () => {

  const { isMenuOpen, toggleSideMenu } = useContext(UiContext)
  const { isLoggedIn, user, logout } = useContext(AuthContext)
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')

  const onSearhTerm = () => {
    if( searchTerm.trim().length === 0) return
    navigateTo(`/search/${searchTerm}`)
  }

  const navigateTo = (url:string) => {
    toggleSideMenu()
    router.push(url)
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
    <Drawer
      open={ isMenuOpen }
      anchor='right'
      sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
      onClose={toggleSideMenu}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              {...textFieldProps}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && onSearhTerm()}
              type='text'
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onSearhTerm}
                  >
                    <SearchOutlined/>
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          {
            isLoggedIn && (
              <>
                <ListItem button>
                  <ListItemIcon>
                    <AccountCircleOutlined/>
                  </ListItemIcon>
                  <ListItemText primary={'Perfil'} />
                </ListItem>

                <ListItem button onClick={() => navigateTo('/orders/history')}>
                  <ListItemIcon>
                    <ConfirmationNumberOutlined/>
                  </ListItemIcon>
                  <ListItemText primary={'Mis Ordenes'} />
                </ListItem>
              </>
            )
          }

          <ListItem 
            button 
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={ () => navigateTo('/category/men')}
          >
            <ListItemIcon>
              <MaleOutlined/>
            </ListItemIcon>
            <ListItemText primary={'Hombres'} />
          </ListItem>

          <ListItem 
            button 
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={ () => navigateTo('/category/women')}
          >
            <ListItemIcon>
              <FemaleOutlined/>
            </ListItemIcon>
            <ListItemText primary={'Mujeres'} />
          </ListItem>

          <ListItem 
            button 
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={ () => navigateTo('/category/kid')}
          >
            <ListItemIcon>
              <EscalatorWarningOutlined/>
            </ListItemIcon>
            <ListItemText primary={'Niños'} />
          </ListItem>

          {
            isLoggedIn
              ? (
                <ListItem button onClick={logout}>
                  <ListItemIcon>
                    <LoginOutlined/>
                  </ListItemIcon>
                  <ListItemText primary={'Salir'} />
                </ListItem>
              )
              : (
                <ListItem button onClick={ () => navigateTo(`/auth/login?p=${ router.asPath }`) }>
                  <ListItemIcon>
                    <VpnKeyOutlined/>
                  </ListItemIcon>
                  <ListItemText primary={'Ingresar'} />
                </ListItem>
              )
          }
          
          {/* Admin */}
          {
            user?.role === 'admin' && (
              <>
                <Divider />
                <ListSubheader>Admin Panel</ListSubheader>

                <ListItem button onClick={ () => navigateTo(`/admin`) }>
                  <ListItemIcon>
                    <DashboardOutlined/>
                  </ListItemIcon>
                  <ListItemText primary={'Dashboard'} />
                </ListItem>

                <ListItem button onClick={ () => navigateTo(`/admin/orders`) }>
                  <ListItemIcon>
                    <ConfirmationNumberOutlined/>
                  </ListItemIcon>
                  <ListItemText primary={'Ordenes'} />
                </ListItem>

                <ListItem button onClick={ () => navigateTo(`/admin/products`) }>
                  <ListItemIcon>
                    <CategoryOutlined/>
                  </ListItemIcon>
                  <ListItemText primary={'Productos'} />
                </ListItem>

                <ListItem button onClick={ () => navigateTo(`/admin/users`) }>
                  <ListItemIcon>
                    <AdminPanelSettings/>
                  </ListItemIcon>
                  <ListItemText primary={'Usuarios'} />
                </ListItem>
              </>
            )
          }

        </List>
      </Box>
    </Drawer>
  )
}
