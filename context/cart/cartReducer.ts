import { ICartProduct, IOrderSummary, IShippingAddress } from '../../interfaces';
import { CartState } from './';

type CartType =
 | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
 | { type: '[Cart] - LoadAddress from cookies', payload: IShippingAddress }
 | { type: '[Cart] - Update Address', payload: IShippingAddress }
 | { type: '[Cart] - Update Cart', payload: ICartProduct[] }
 | { type: '[Cart] - Update Cart Quantity', payload: ICartProduct }
 | { type: '[Cart] - Remove product in cart', payload: ICartProduct }
 | { type: '[Cart] - Order Summary', payload: IOrderSummary }
 | { type: '[Cart] - Order Complete'}

export const cartReducer = ( state: CartState, action:CartType ):CartState => {

  switch (action.type) {
    case '[Cart] - LoadCart from cookies | storage':
      return {
        ...state,
        cart: [...action.payload],
        isLoaded: true
      }
    case '[Cart] - Update Address':
    case '[Cart] - LoadAddress from cookies':
      return {
        ...state,
        shippingAddress: action.payload
      }
    case '[Cart] - Update Cart':
      return {
        ...state,
        cart: [...action.payload]
      }
    case '[Cart] - Update Cart Quantity':
      return {
        ...state,
        cart: state.cart.map( product => {
          if(product._id !== action.payload._id) return product
          if(product.size !== action.payload.size) return product
          return action.payload
        })
      }
    case '[Cart] - Remove product in cart':
      return {
        ...state,
        cart: state.cart.filter( product => product !== action.payload)
      }
    case '[Cart] - Order Summary':
      return {
        ...state,
        orderSummary: action.payload
      }
    case '[Cart] - Order Complete':
      return {
        ...state,
        cart: [],
        orderSummary: {
          numberOfItems: 0,
          subTotal: 0,
          tax: 0,
          total: 0
        }
      }
    default:
      return state;
  }
}