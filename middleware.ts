import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';

export const middleware = async(req: NextRequest | any) => {

  const session:any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const originPath = req.nextUrl.origin
  const path = req.nextUrl.pathname
  
  
  if( !session ){
    const requestedPage = path.startsWith('/api/admin') ? new URL(`${originPath}/api/401`) : new URL(`${originPath}/auth/login?p=${req.nextUrl.pathname}`)
    return NextResponse.redirect(requestedPage)
  }

  if (path.startsWith('/admin')) {
    if( session.user.role !== 'admin') {
      const requestedPage = new URL(`${originPath}`)
      return NextResponse.redirect(requestedPage)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/checkout/:path*', '/orders/:path*', '/admin', '/admin/:path*', '/api/admin/:path*']
}