import * as z from "zod";

import { prisma } from "~/db.server";

export const answer = 2;
export const dressSchema = z.number().int().min(0).max(2);
export type Dress = z.infer<typeof dressSchema>;
export const colorSchema = z.enum([
  "bg-red-500",
  "bg-blue-500",
  "bg-yellow-500",
]);

export type ColorCode = z.infer<typeof colorSchema>;
export const choiceSchema = z.object({
  id: z.number(),
  dress: dressSchema,
  userId: z.string(),
  color: colorSchema,
});
export type Choice = z.infer<typeof choiceSchema>;

const dressColorMap = {
  0: "bg-red-500",
  1: "bg-blue-500",
  2: "bg-yellow-500",
} as const;

export function dress2Color(dress: Dress) {
  return dressColorMap[dress as keyof typeof dressColorMap];
}

export async function getByUserId(userId: string) {
  const choice = await prisma.choice.findUnique({
    where: { userId },
  });

  if (!choice) return null;

  return choiceSchema.parse({
    ...choice,
    color: dress2Color(choice.dress),
  });
}

export function upsert(userId: string, dress: number) {
  return prisma.choice.upsert({
    where: { userId },
    create: { userId, dress },
    update: { dress },
  });
}
