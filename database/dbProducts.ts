import { db } from "."
import { IProduct } from "../interfaces";
import { Product } from "../models"
import { parseObject } from "../utils/helpers";

export const getProductBySlug = async( slug:string ):Promise<IProduct | null> => {
  await db.connect()
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect()

  if( !product ) return null

  // TODO: procesamiento de las imagenes cuando las subamos
  product.images = product.images.map ( image => {
    return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
  })

  return parseObject(product)
}

interface ProductSlug {
  slug: string
}

export const getAllProductSlugs = async(): Promise<ProductSlug[]> => {
  await db.connect()
  const slugs = await Product.find().select('slug -_id').lean()
  await db.disconnect()
  return slugs
}

export const getProductsByTerm =async (term:string):Promise<IProduct[]> => {
  
  term = term.toString().toLowerCase()

  await db.connect();

  const products = await Product.find({
    $text: { $search: term }
  })
  .select('title images price inStock slug -_id')
  .lean()

  await db.disconnect();

  const updatedProducts = products.map( product => {
    product.images = product.images.map ( image => {
      return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
    })
    return product
  })

  return updatedProducts
}

export const getAllProducts = async (limit:number = 0):Promise<IProduct[]> => {
  await db.connect();

  const products = await Product.find()
    .limit(limit)
    .lean()

  await db.disconnect();

  const updatedProducts:IProduct[] = products.map( product => {
    product.images = product.images.map ( image => {
      return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
    })
    return product
  })

  return parseObject(updatedProducts)
}