import { createContext } from 'react'
import { ICartProduct, IOrderSummary, IShippingAddress } from '../../interfaces';

interface ContextProps {
  cart: ICartProduct[];
  orderSummary: IOrderSummary; 
  isLoaded: boolean
  shippingAddress?: IShippingAddress

  // Methods
  addProductToCart: (product: ICartProduct) => void;
  createOrder: () => Promise<{ hasError: boolean; message: string}>
  removeCartProduct: (product: ICartProduct) => void;
  updateAddress: (address: IShippingAddress) => void
  updateCartQuantity: (product: ICartProduct) => void;
}

export const CartContext = createContext({} as ContextProps)