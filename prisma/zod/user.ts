import * as z from "zod"
import { CompletePost, PostModel } from "./index"

export const _UserModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  email: z.string(),
  passwordHash: z.string(),
})

export interface CompleteUser extends z.infer<typeof _UserModel> {
  posts: CompletePost[]
}

/**
 * UserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const UserModel: z.ZodSchema<CompleteUser> = z.lazy(() => _UserModel.extend({
  posts: PostModel.array(),
}))
