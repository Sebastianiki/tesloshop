import React, { useState } from 'react'

import { Grid, Typography } from '@mui/material'
import { AccessTimeOutlined, AttachMoneyOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, Inventory2Outlined, InventoryOutlined, ProductionQuantityLimitsOutlined, RemoveShoppingCartOutlined } from '@mui/icons-material'

import { AdminLayout } from '../../components/layouts'
import { SummaryTile } from '../../components/admin'
import useSWR from 'swr';
import { DashboardSummaryResponse } from '../../interfaces'
import { useEffect } from 'react';

const DashboardPage = () => {

  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', { refreshInterval: 60 * 1000 })

  const [refreshIn, setRefreshIn] = useState(60)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn -1 : 60) 
    }, 1000)
  
    return () => clearInterval(interval)
  }, [])
  

  if( !error && !data ) return <></>

  if( error ){
    console.log(error);
    return <Typography>Error al cargar la informacion</Typography>
  }

  const { 
    numberOfOrders,
    notPaidOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    productsWithLowInventory,
  } = data!

  return (
    <AdminLayout
      title='Dashboard'
      subTitle='Estadisticas generales'
      icon={ <DashboardOutlined/> }
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subTitle='Ordenes Totales'
          icon={ <CreditCardOutlined color='secondary' sx={{ fontSize: 60 }} />}
        />
        <SummaryTile
          title={paidOrders}
          subTitle='Ordenes Pagadas'
          icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 60 }} />}
        />
        <SummaryTile
          title={notPaidOrders}
          subTitle='Ordenes Pendientes'
          icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 60 }} />}
        />
        <SummaryTile
          title={numberOfClients}
          subTitle='Clientes'
          icon={ <GroupOutlined color='primary' sx={{ fontSize: 60 }} />}
        />
        <SummaryTile
          title={numberOfProducts}
          subTitle='Productos'
          icon={ <Inventory2Outlined color='warning' sx={{ fontSize: 60 }} />}
        />
        <SummaryTile
          title={productsWithNoInventory}
          subTitle='Productos sin existencias'
          icon={ <RemoveShoppingCartOutlined color='error' sx={{ fontSize: 60 }} />}
        />
        <SummaryTile
          title={productsWithLowInventory}
          subTitle='Productos con bajo inventario'
          icon={ <ProductionQuantityLimitsOutlined  color='warning' sx={{ fontSize: 60 }} />}
        />
        <SummaryTile
          title={refreshIn}
          subTitle='Actualizacion en:'
          icon={ <AccessTimeOutlined  color='secondary' sx={{ fontSize: 60 }} />}
        />
      </Grid>
    </AdminLayout>
  )
}

export default DashboardPage