import Link from 'next/link';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const postsQuery = trpc.useQuery(['post.all']);
  const addPost = trpc.useMutation('post.add', {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(['post.all']);
    },
  });

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   for (const { id } of postsQuery.data ?? []) {
  //     utils.prefetchQuery(['post.byId', { id }]);
  //   }
  // }, [postsQuery.data, utils]);

  return (
    <div className="p-8 subpixel-antialiased">
      <header className="mb-12">
        <h1 className="text-6xl mb-4">Welcome to your tRPC starter!</h1>
        <p>
          Check <a href="https://trpc.io/docs">the docs</a> whenever you get
          stuck, or ping <a href="https://twitter.com/alexdotjs">@alexdotjs</a>{' '}
          on Twitter.
        </p>
      </header>

      <h2 className="text-3xl font-semibold mb-6">
        Posts
        {postsQuery.status === 'loading' && '(loading)'}
      </h2>

      <main className="flex items-start">
        <section className="flex flex-col mr-12">
          {postsQuery.data?.map((item) => (
            <article
              className="mb-4 rounded p-4 border min-w-[25rem]"
              key={item.id}
            >
              <h3 className="text-xl mb-2">{item.title}</h3>
              <Link href={`/post/${item.id}`}>
                <a className="text-blue-500 hover:underline text-sm">
                  View more
                </a>
              </Link>
            </article>
          ))}
        </section>

        <form
          className="w-[25rem] p-4 flex flex-col rounded border"
          onSubmit={async (e) => {
            e.preventDefault();
            /**
             * In a real app you probably don't want to use this manually
             * Checkout React Hook Form - it works great with tRPC
             * @link https://react-hook-form.com/
             */

            const $text: HTMLInputElement = (e as any).target.elements.text;
            const $title: HTMLInputElement = (e as any).target.elements.title;
            const input = {
              title: $title.value,
              text: $text.value,
            };
            try {
              await addPost.mutateAsync(input);

              $title.value = '';
              $text.value = '';
            } catch {}
          }}
        >
          <div className="flex flex-col mb-2">
            <label className="mb-1" htmlFor="title">
              Title:
            </label>
            <input
              className="rounded border border-gray-300"
              id="title"
              name="title"
              type="text"
              disabled={addPost.isLoading}
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-1" htmlFor="text">
              Text:
            </label>
            <textarea
              id="text"
              name="text"
              disabled={addPost.isLoading}
              className="rounded border border-gray-300"
            />
          </div>
          <input
            className="cursor-pointer w-1/3 border rounded border-black p-2 self-end font-medium"
            type="submit"
            disabled={addPost.isLoading}
          />
          {addPost.error && (
            <p style={{ color: 'red' }}>{addPost.error.message}</p>
          )}
        </form>
      </main>
    </div>
  );
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
