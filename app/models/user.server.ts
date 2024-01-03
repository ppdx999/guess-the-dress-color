import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import {fromDb as choiceFromDb} from "~/models/choice.server";


export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(id: User["id"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      id,
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

export async function verifyLogin(
  id: User["id"],
  password: Password["hash"],
) {
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

export async function getUsersWithChoice() {
	return prisma.user.findMany({
		include: {
			choice: true,
		},
	}).then(users => users.map(user => ({
		...user,
		choice: user.choice && choiceFromDb(user.choice)
	})));
}
