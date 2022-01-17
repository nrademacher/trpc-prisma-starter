import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FieldValues, useForm } from 'react-hook-form'
import { trpc } from '../utils/trpc'

export default function SignUp() {
    const { register, handleSubmit } = useForm()
    const [password, setPassword] = useState('')

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
            // refetches users after a post is added
            await utils.invalidateQueries(['user.all'])
            await utils.invalidateQueries(['user.byId'])
            await signIn('credentials', { email, password, callbackUrl: '/' })
        },
    })

    if (status !== 'unauthenticated') return null

    return (
        <main className="grid place-content-center">
            <h2 className="mb-8 text-3xl font-bold text-center">Signup</h2>
            <form
                className="flex flex-col space-y-8"
                onSubmit={handleSubmit(async (data: FieldValues) => {
                    setPassword(data.password)
                    await createUser.mutateAsync({ name: data.username, password: data.password, email: data.email })
                })}
            >
                <div className="flex flex-col space-y-4">
                    <input type="email" {...register('email')} placeholder="Email" className="border-gray-400" />
                    <input type="text" {...register('username')} placeholder="User name" className="border-gray-400" />
                    <input
                        type="password"
                        {...register('password')}
                        placeholder="Password"
                        className="border-gray-400"
                    />
                </div>
                <button
                    className="py-3 px-7 font-semibold text-white bg-gray-900 rounded hover:bg-gray-600"
                    type="submit"
                >
                    Sign Up
                </button>
            </form>
        </main>
    )
}
