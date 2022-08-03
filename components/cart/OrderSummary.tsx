import { Grid, Typography } from "@mui/material"
import { FC, useContext } from 'react';
import { CartContext } from "../../context";
import { IOrderSummary } from "../../interfaces";
import { currency } from "../../utils";

interface Props {
  summary? : IOrderSummary
}

export const OrderSummary:FC<Props> = ({ summary }) => {

  const { orderSummary } = useContext(CartContext)
  const desSummary = summary ? summary : orderSummary
  const { numberOfItems, subTotal, tax, total } = desSummary

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>Cantidad de productos</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{numberOfItems} { numberOfItems > 1 ? 'productos' : 'producto'}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ currency.formatUS(subTotal) }</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Taxes ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ currency.formatUS(tax) }</Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end' sx={{ mt: 2 }}>
        <Typography variant="subtitle1">{ currency.formatUS(total) }</Typography>
      </Grid>
    </Grid>
  )
}
