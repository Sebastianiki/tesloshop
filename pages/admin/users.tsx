import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import { Grid, MenuItem, Select } from '@mui/material';
import { PeopleOutline } from '@mui/icons-material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { AdminLayout } from '../../components/layouts'
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';

const UsersPage = () => {

  const {data, error} = useSWR<IUser[]>('/api/admin/users')

  const [users, setUsers] = useState<IUser[]>([])
  
  useEffect(() => {
    if(data) {
      setUsers(data)
    }
  }, [data])
  

  if( !data && !error ) return <></>

  const onRoleUpdated = async( userId:string, newRole:string ) => {

    const previousUsers:IUser[] = [...users]
    const updatedUsers:IUser[] = users.map( user => ({
      ...user,
      role: userId === user._id ? newRole : user.role
    }))

    setUsers(updatedUsers)

    try {
      await tesloApi.put('/admin/users', {userId, role: newRole })
    } catch (error) {
      setUsers(previousUsers)
      console.log(error)
      alert('No se pudo actualizar el error')
    } 
  }

  const columns:GridColDef[] = [
    { field: 'email', headerName:'Correo', width: 250 },
    { field: 'name', headerName:'Nombre', width: 250 },
    { 
      field: 'role', 
      headerName:'Rol', 
      width: 250 ,
      renderCell: ({row}:GridValueGetterParams) => {
        return (
          <Select
            value={ row.role }
            label='Role'
            onChange={({ target }) => onRoleUpdated(row.id, target.value)}
            sx={{ width: '250px' }}
          >
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='client'>Client</MenuItem>
          </Select>
        )
      }
    }
  ]

  const rows = users.map(({ _id, email, name, role }) => ({
    id: _id,
    email,
    name,
    role
  }))

  return (
    <AdminLayout 
      title={'Usuarios'} 
      subTitle={'Mantenimiento de Usuarios'}
      icon={ <PeopleOutline/> }
    >
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

export default UsersPage