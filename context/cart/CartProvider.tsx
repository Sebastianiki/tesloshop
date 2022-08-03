import { FC, ReactNode, useEffect, useReducer } from 'react';

import Cookie from 'js-cookie';

import { CartContext, cartReducer } from './';
import { ICartProduct, IOrder, IOrderSummary, IShippingAddress } from '../../interfaces';
import { tesloApi } from '../../api';
import axios from 'axios';


export interface CartState {
  cart: ICartProduct[]
  orderSummary: IOrderSummary
  isLoaded: boolean
  shippingAddress?: IShippingAddress
}

const CART_INITIAL_STATE:CartState = {
  cart: [],
  orderSummary: {
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0
  },
  isLoaded: false,
  shippingAddress : undefined
}

interface Props {
  children? : ReactNode
}

export const CartProvider:FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

  useEffect(() => {
    if(Cookie.get('cart') && JSON.parse( Cookie.get('cart')! ).length > 0 ){
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: JSON.parse( Cookie.get('cart')! ) });
    }
  }, [])

  useEffect(() => {
    Cookie.set('cart', JSON.stringify( state.cart ))
  }, [state.cart])

  useEffect(() => {
    const numberOfItems = state.cart.reduce(( prev, current ) => current.quantity + prev, 0)
    const subTotal = state.cart.reduce(( prev, current ) => (current.price * current.quantity) + prev, 0)
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (1 + taxRate)
    }

    dispatch({ type: '[Cart] - Order Summary', payload: orderSummary })
    
  }, [state.cart])

  useEffect(() => {
    if(Cookie.get('address')) dispatch({ type: '[Cart] - LoadAddress from cookies', payload: JSON.parse(Cookie.get('address')!) })
  }, [])
  

  const addProductToCart = (product:ICartProduct) => {
    const productInCart = state.cart.some( p => p._id === product._id && p.size === product.size)
    if( !productInCart ) return dispatch({ type: '[Cart] - Update Cart', payload: [...state.cart, product] })

    // Acumular
    const updatedProducts = state.cart.map( p => {
      if ( p._id !== product._id ) return p
      if ( p.size !== product.size ) return p

      p.quantity += product.quantity
      return p
    })

    dispatch({ type: '[Cart] - Update Cart', payload: updatedProducts })
  }

  const updateCartQuantity = (product:ICartProduct) => {
    dispatch({ type: '[Cart] - Update Cart Quantity', payload: product })
  }
  
  const removeCartProduct = (product:ICartProduct) => {
    dispatch({ type: '[Cart] - Remove product in cart', payload: product})
  }

  const updateAddress = (address:IShippingAddress) => {
    Cookie.set('address', JSON.stringify(address))
    dispatch({ type:'[Cart] - Update Address', payload: address})
  }

  const createOrder = async ():Promise<{ hasError: boolean; message: string}> => {
    if( !state.shippingAddress ) throw new Error('No hay direccion de envio')

    const body:IOrder = {
      orderItems: state.cart.map( p => ({
        ...p,
        size: p.size!
      })),
      shippingAddress: state.shippingAddress,
      summary: state.orderSummary,
      isPaid: false,
    }

    try { 
      const { data } = await tesloApi.post<IOrder>('/orders', body)

      dispatch({ type: '[Cart] - Order Complete' })
      return {
        hasError: false,
        message: data._id!
      }
    } catch (error) {
      if(axios.isAxiosError(error)) { 
        const { message } = error.response?.data as { message : string }
        return { hasError: true, message } 
      }
      return {
        hasError: true,
        message: 'Error no controlado, hable con el administrador'
      }
    }
  }

  return (
    <CartContext.Provider value={{
      ...state,

      // Methods
      addProductToCart,
      createOrder,
      removeCartProduct,
      updateAddress,
      updateCartQuantity,
    }}>
      { children }
    </CartContext.Provider>
  )
}