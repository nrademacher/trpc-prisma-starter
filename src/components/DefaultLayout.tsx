import Head from 'next/head'
import { ReactQueryDevtools } from 'react-query/devtools'

type DefaultLayoutProps = { children: React.ReactNode }

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
    return (
        <>
            <Head>
                <meta lang="en" charSet="UTF-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>Prisma Starter</title>
            </Head>

            <div className="p-8 subpixel-antialiased h-screen w-screen">{children}</div>

            {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
        </>
    )
}
