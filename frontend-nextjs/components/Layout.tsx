import React from 'react'
import { FC } from 'react'
import Head from 'next/head'

type Props = {
  title: string
  children: React.ReactNode
}

export const Layout: FC<Props> = ({ title = 'Next.js', children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title>{title}</title>
      </Head>
      <main className="flex w-screen flex-1 flex-col items-center justify-center">
        {children}
      </main>
    </div>
  )
}

export default Layout
