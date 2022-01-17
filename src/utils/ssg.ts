import { GetStaticPropsContext } from 'next'
import superjson from 'superjson'

import prisma from './prisma'

import { createSSGHelpers } from '@trpc/react/ssg'
import { appRouter } from 'server/routers/_app'

/**
 * Initialize static site rendering tRPC helpers.
 * Provides a method to prefetch tRPC-queries in a `getStaticProps`-function.
 * Automatically prefetches i18n based on the passed in `context`-object to prevent i18n-flickering.
 * Make sure to `return { props: { trpcState: ssr.dehydrate() } }` at the end.
 */
export async function ssgInit<TParams extends { locale?: string }>(opts: GetStaticPropsContext<TParams>) {
    const ssg = createSSGHelpers({
        router: appRouter,
        transformer: superjson,
        ctx: {
            prisma,
            session: null,
            user: null,
        },
    })

    return ssg
}
