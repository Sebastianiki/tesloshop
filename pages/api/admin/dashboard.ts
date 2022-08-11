import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
  numberOfOrders: number;
  paidOrders: number; // isPaid true
  notPaidOrders: number;
  numberOfClients: number; // role: client
  numberOfProducts: number;
  productsWithNoInventory: number;  // 0
  productsWithLowInventory: number; // queda a critero 5 o menos
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  await db.connect()

  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    productsWithLowInventory,
  ] = await Promise.all([
    Order.count(),
    Order.find({ isPaid: true }).count(),
    User.find({ role: 'client' }).count(),
    Product.count(),
    Product.find({ inStock: 0 }).count(),
    Product.find({ inStock: { $lte: 5 }}).count()
  ])

  await db.disconnect()
  
  res.status(200).json({
    numberOfOrders,
    notPaidOrders: numberOfOrders - paidOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    productsWithLowInventory,
  })

}