import { IUser, ISize } from "./"

export interface IOrder {
  _id?            : string
  user?           : IUser | string
  orderItems      : IOrderItem[]
  shippingAddress : IShippingAddress
  paymentResult?  : string
  summary         : IOrderSummary
  isPaid          : boolean
  paidAt?         : string
  transactionId?  : string
  createdAt?      : string
}

export interface IOrderItem {
  _id       : string
  title     : string
  size      : ISize
  quantity  : number
  slug      : string
  image     : string
  price     : number
  gender    : 'men'|'women'|'kid'|'unisex'
}

export interface IShippingAddress { 
  firstName : string
  lastName  : string
  address   : string
  address2? : string
  zip       : string
  country   : string
  city      : string
  phone     : string
}

export interface IOrderSummary { 
  numberOfItems : number;
  subTotal      : number;
  tax           : number;
  total         : number;
}