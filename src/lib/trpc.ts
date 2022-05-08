import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'
import type { AppRouter } from '@/server/routers/app-router'
import { createReactQueryHooks } from '@trpc/react'

export type inferQueryOutput<TRouteKey extends keyof AppRouter['_def']['queries']> = inferProcedureOutput<
    AppRouter['_def']['queries'][TRouteKey]
>

export type inferQueryInput<TRouteKey extends keyof AppRouter['_def']['queries']> = inferProcedureInput<
    AppRouter['_def']['queries'][TRouteKey]
>

export type inferMutationOutput<TRouteKey extends keyof AppRouter['_def']['mutations']> = inferProcedureOutput<
    AppRouter['_def']['mutations'][TRouteKey]
>

export type inferMutationInput<TRouteKey extends keyof AppRouter['_def']['mutations']> = inferProcedureInput<
    AppRouter['_def']['mutations'][TRouteKey]
>

export const trpc = createReactQueryHooks<AppRouter>()
