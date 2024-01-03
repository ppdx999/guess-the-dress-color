import type { Choice as DbChoice } from "@prisma/client";

import { prisma } from "~/db.server";

const dressColor = ["red", "blue", "yellow"] as const;
type DressColor = (typeof dressColor)[number];
const dressColorCode = ["bg-red-500", "bg-blue-500", "bg-yellow-500"] as const;
type DressColorCode = (typeof dressColorCode)[number];

export const fromDb = (choice: DbChoice): Choice => ({
  id: choice.id,
  userId: choice.userId,
  dressColor: dressColor[choice.dress],
  dressColorCode: dressColorCode[choice.dress],
});

/* dress means a number stored in the database in this function */
const toDress = (dress: DressColor): number =>
  dressColor.findIndex((d) => d === dress);

export function assertDressColor(text: unknown): asserts text is DressColor {
  if (typeof text !== "string") throw new Error("dressColor is not string");
  if (!dressColor.includes(text as DressColor))
    throw new Error("dressColor is not valid");
}

export interface Choice {
  id: DbChoice["id"];
  userId: DbChoice["userId"];
  dressColor: DressColor;
  dressColorCode: DressColorCode;
}

export const getChoiceByUserId = async (
  userId: string,
): Promise<Choice | null> => {
  const choice = await prisma.choice.findUnique({
    where: { userId },
  });

  if (!choice) return null;
  return fromDb(choice);
};

export const chooseDress = async (
  userId: string,
  dress: DressColor,
): Promise<Choice> => {
  const choice = await prisma.choice.upsert({
    where: { userId },
    create: { userId, dress: toDress(dress) },
    update: { dress: toDress(dress) },
  });
  return fromDb(choice);
};
