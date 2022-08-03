import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import { dbUsers } from '../../../database'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@correo.com' },
        password: { label: 'Contrasena', type: 'password', placeholder: 'Contrasena' },
      },
      async authorize(credentials) {
        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password )
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
    
  ],

  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  jwt: {
    
  },

  session: {
    maxAge: 2592000, // 30 dias
    strategy: 'jwt',
    updateAge: 86400 // cada dia
  },

  // Callbacks
  callbacks: {

    async jwt({ token, account, user}) {
      if(account) {
        token.accessToken = account.access_token

        switch (account.type) {
          case 'credentials':
            token.user = user
            break;
          case 'oauth':
            // verificar si crear usuario o si ya existe
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '')
            break;
        }
      }
      return token
    },

    async session({ session, token, user }) {
      session.accessToken = token.accessToken
      session.user = token.user as any
       
      return session
    }
  }
})