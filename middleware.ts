import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';

export const middleware = async(req: NextRequest | any) => {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  if( !session ){
    const requestedPage = new URL(`${req.nextUrl.origin}/auth/login?p=${req.nextUrl.pathname}`)
    return NextResponse.redirect(requestedPage)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/checkout/:path*', '/orders/:path*']
}