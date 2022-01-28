import { z } from 'zod'
import { _UserModel } from 'prisma/zod'

const UserPasswordInput = z.object({ password: z.string().min(8) })
export const UserInput = _UserModel.pick({ email: true, name: true }).merge(UserPasswordInput)
