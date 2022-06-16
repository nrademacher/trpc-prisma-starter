import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { AppType } from 'next/dist/shared/lib/utils'
import type { AppRouter } from '@/server/routers/app-router'

import type { Maybe } from '@trpc/server'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { withTRPC } from '@trpc/next'
import { TRPCClientError } from '@trpc/client'

import { SessionProvider } from 'next-auth/react'
import { DefaultLayout } from '@/components'

import superjson from 'superjson'

import '@/styles/globals.css'

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const MyApp = (({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
    const getLayout =
        Component.getLayout ??
        (page => (
            <SessionProvider session={session}>
                <DefaultLayout>{page}</DefaultLayout>
            </SessionProvider>
        ))

    return getLayout(<Component {...pageProps} />)
}) as AppType

function getBaseUrl() {
    if (typeof window !== 'undefined') {
        return ''
    }
    // reference for vercel.com
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }
    // assume localhost
    return `http://localhost:${process.env.PORT ?? 3000}`
}

export default withTRPC<AppRouter>({
    config() {
        /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         */
        return {
            /**
             * @link https://trpc.io/docs/links
             */
            links: [
                // adds pretty logs to your console in development and logs errors in production
                loggerLink({
                    enabled: opts =>
                        process.env.NODE_ENV === 'development' ||
                        (opts.direction === 'down' && opts.result instanceof Error),
                }),
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                }),
            ],
            /**
             * @link https://trpc.io/docs/data-transformers
             */
            transformer: superjson,
        }
    },
    /**
     * @link https://trpc.io/docs/ssr
     */
    ssr: false,
})(MyApp)
