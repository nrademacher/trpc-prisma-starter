import Head from 'next/head'
import { ReactQueryDevtools } from 'react-query/devtools'

type DefaultLayoutProps = { children: React.ReactNode }

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    return (
        <>
            <Head>
                <meta lang="en" charSet="UTF-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content="A full-stack starter template powered by tRPC, Prisma, and Next.js" />
                <title>tRPC Prisma Starter</title>
            </Head>

            <div className="h-screen w-screen bg-neutral-50 p-8 text-neutral-900 subpixel-antialiased">{children}</div>

            {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
        </>
    )
}
