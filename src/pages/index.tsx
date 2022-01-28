import type { NextPageWithLayout } from './_app'
import { signOut, useSession } from 'next-auth/react'
import { trpc } from '@/lib/trpc'
import { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import Link from 'next/link'

const IndexPage: NextPageWithLayout = () => {
    const { data: session } = useSession()

    const utils = trpc.useContext()

    const postsQuery = trpc.useQuery(['post.all'])

    // prefetch all posts for instant navigation
    useEffect(() => {
        for (const { id } of postsQuery.data ?? []) {
            utils.prefetchQuery(['post.byId', { id }])
        }
    }, [postsQuery.data, utils])

    const addPost = trpc.useMutation('post.add', {
        async onSuccess() {
            // refetches posts after a post is added
            await utils.invalidateQueries(['post.all'])
        },
    })

    const { register, handleSubmit, reset } = useForm()

    return (
        <div className="">
            <header className="mb-12 flex items-start justify-between">
                <div>
                    <h1 className="mb-4 text-6xl">Welcome to your tRPC starter!</h1>
                    <p>
                        Check <a href="https://trpc.io/docs">the docs</a> whenever you get stuck, or ping{' '}
                        <a
                            className="cursor-pointer text-blue-500 hover:underline"
                            href="https://twitter.com/alexdotjs"
                        >
                            @alexdotjs
                        </a>{' '}
                        on Twitter.
                    </p>
                </div>
                {session && (
                    <div className="flex items-baseline space-x-8">
                        <span className="text-sm">
                            Welcome, <span className="font-semibold">{session.user.name}</span>
                        </span>
                        <a
                            onClick={async () => await signOut()}
                            className="cursor-pointer font-semibold text-blue-500 hover:underline"
                        >
                            Logout
                        </a>
                    </div>
                )}
            </header>
            {session ? (
                <>
                    <h2 className="mb-6 text-3xl font-semibold">
                        Posts
                        {postsQuery.status === 'loading' && '(loading)'}
                    </h2>

                    <main className="flex items-start space-x-8">
                        <section className="grid grid-cols-3 gap-4">
                            {postsQuery.data &&
                                postsQuery.data.map(item => (
                                    <article className="min-w-[25rem] rounded border p-4" key={item.id}>
                                        <h3 className="mb-4 text-xl font-semibold">{item.title}</h3>
                                        <h4>
                                            By <span className="mb-4 font-medium">{item.user.name}</span>
                                        </h4>
                                        <div className="mt-1.5">
                                            <Link href={`/post/${item.id}`}>
                                                <a className="text-sm text-blue-500 hover:underline">View more</a>
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                        </section>

                        <form
                            className="flex w-[25rem] flex-col space-y-3 rounded border p-4"
                            onSubmit={handleSubmit(async ({ title, text }: FieldValues) => {
                                await addPost.mutateAsync({ title, text })
                                reset({ title: '', text: '' })
                            })}
                        >
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium" htmlFor="title">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    {...register('title')}
                                    className="rounded border border-gray-300"
                                    disabled={addPost.isLoading}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium" htmlFor="text">
                                    Text
                                </label>
                                <textarea
                                    id="text"
                                    {...register('text')}
                                    disabled={addPost.isLoading}
                                    className="rounded border border-gray-300"
                                />
                            </div>
                            <input
                                className="w-1/3 cursor-pointer self-end rounded border p-2 font-medium"
                                type="submit"
                                disabled={addPost.isLoading}
                            />
                            {addPost.error && <p className="text-red-600">{addPost.error.message}</p>}
                        </form>
                    </main>
                </>
            ) : (
                <div className="space-y-2">
                    <p className="text-lg font-medium">
                        <Link href="/auth/login">
                            <a className="cursor-pointer text-blue-500 hover:underline">Sign in </a>
                        </Link>
                        to view and create posts!
                    </p>
                    <p>
                        Need an acount?
                        <Link href="/signup">
                            <a className="cursor-pointer text-blue-500 hover:underline"> Sign up</a>
                        </Link>
                    </p>
                </div>
            )}
        </div>
    )
}

export default IndexPage
