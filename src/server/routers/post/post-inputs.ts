import { _PostModel } from 'prisma/zod'

export const CreatePostInput = _PostModel.pick({ title: true, text: true })
export const EditPostInput = _PostModel.pick({ id: true, title: true, text: true })
