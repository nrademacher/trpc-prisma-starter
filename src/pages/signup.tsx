import { FieldValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserInput } from '@/server/routers/user/user-inputs'
import { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { trpc } from '@/lib/trpc'

export default function SignUp() {
    const { status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/')
        }
    }, [status, router])

    const utils = trpc.useContext()
    const createUser = trpc.useMutation(['user.create'], {
        async onSuccess({ email }) {
            // refetches users after a user is added
            await utils.invalidateQueries(['user.all'])
            await signIn('credentials', { email, password, callbackUrl: '/' })
        },
    })

    const { register, handleSubmit, watch } = useForm({ resolver: zodResolver(UserInput), mode: 'onSubmit' })
    const password = watch('password')

    if (status !== 'unauthenticated') return null

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <div>
                <h2 className="mb-6 text-center text-3xl font-bold">Sign Up</h2>
                <form
                    className="flex w-[20rem] flex-col space-y-8 rounded border p-4"
                    onSubmit={handleSubmit(async (data: FieldValues) => {
                        await createUser.mutateAsync({
                            name: data.name,
                            password: data.password,
                            email: data.email,
                        })
                    })}
                >
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label className="mb-1 text-sm" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                {...register('name')}
                                className="rounded border border-gray-300"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 text-sm" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                className="rounded border border-gray-300"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 text-sm" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password')}
                                className="rounded border border-gray-300"
                            />
                        </div>
                    </div>
                    <button
                        className="rounded bg-gray-900 py-3 px-7 font-semibold text-white hover:bg-gray-600"
                        type="submit"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </main>
    )
}
