import { isValidObjectId } from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL || '');


type Data =
  | { message: string }
  | IProduct[]
  | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  
  switch ( req.method ) {
    case 'GET':
      return getProducts(req, res)
    case 'POST':
      return createProduct(req, res)
    case 'PUT':
      return updateProduct(req, res)
    default:
      res.status(400).json({ message: 'Bad Request' })
  }
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  
  await db.connect()
  const products = await Product.find().sort({ title: 'asc'}).lean()
  await db.disconnect()

  // TODO : actualizar las imagenes
  const updatedProducts:IProduct[] = products.map( product => {
    product.images = product.images.map ( image => {
      return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
    })
    return product
  })

  return res.status(200).json( products )
}

const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { images = [], slug = '' } = req.body as IProduct
  if( images.length < 2 ) return res.status(400).json({ message: 'Es necesario al menos 2 imagenes' })
  try {
    await db.connect()
    // if(slug === 'new_product') return res.status(400).json({ message: 'Slug utilizado para uso interno' })
    const productBySlug = await Product.findOne({ slug })
    if(productBySlug) {
      await db.disconnect()
      return res.status(400).json({ message: 'Ya existe un producto con ese slug' }) 
    }
    const product = new Product(req.body)
    await product.save()
    await db.disconnect()
    return res.status(200).json(product)
  } catch (error) {
    console.log(error)
    await db.disconnect()
    return res.status(400).json({ message: 'Revisar logs del servidor' })
  }

}

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  
  const { _id = '', images = [] } = req.body as IProduct

  if( !isValidObjectId(_id) ) return res.status(400).json({ message: 'No es un id valido' })
  if( images.length < 2 ) return res.status(400).json({ message: 'Es necesario al menos 2 imagenes' })

  try {
    await db.connect()
    const product = await Product.findById(_id)
    if(!product) return res.status(400).json({ message: 'No existe un producto con ese id' })
    // TODO: eliminar fotos en Cloudinary / Nube
    // https://res.cloudinary.com/sebastianiki/image/upload/v1660158728/ihmbdsfikdmr9ykscbhv.webp
    product.images.forEach( async(image) => {
      if( !images.includes(image)){
        const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1).split('.')
        await cloudinary.uploader.destroy(fileId)
      }
    })
    await product.updateOne( req.body )
    await db.disconnect()

    return res.status(200).json( product )
  } catch (error) {
    console.log(error)
    await db.disconnect()
    return res.status(400).json({ message: 'Revisar logs del servidor' })
  }
}

