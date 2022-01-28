import * as z from 'zod'
import { CompleteUser, UserModel } from './index'

export const _PostModel = z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    title: z.string(),
    text: z.string(),
    userId: z.string(),
})

export interface CompletePost extends z.infer<typeof _PostModel> {
    user: CompleteUser
}

/**
 * PostModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const PostModel: z.ZodSchema<CompletePost> = z.lazy(() =>
    _PostModel.extend({
        user: UserModel,
    })
)
