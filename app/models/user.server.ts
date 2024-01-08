import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import * as Choice from "~/models/choice.server";
export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(input: {
  id: User["id"];
  username: User["username"];
  password: string;
}) {
  const hashedPassword = await bcrypt.hash(input.password, 10);

  return prisma.user.create({
    data: {
      ...input,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserById(id: User["id"]) {
  return prisma.user.delete({ where: { id } });
}

export async function verifyLogin(id: User["id"], password: Password["hash"]) {
  const userWithPassword = await prisma.user.findUnique({
    where: { id },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function getAllUsers() {
  return prisma.user.findMany();
}

export function getWinnerUsers() {
  return prisma.choice
    .findMany({
      include: {
        user: true,
      },
      where: {
        dress: Choice.answer,
      },
    })
    .then((vs) => vs.map((v) => v.user));
}
