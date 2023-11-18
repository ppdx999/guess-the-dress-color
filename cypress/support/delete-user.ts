// Use this to delete a user by their id
// Simply call this with:
// npx ts-node -r tsconfig-paths/register ./cypress/support/delete-user.ts username@example.com
// and that user will get deleted

import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { installGlobals } from "@remix-run/node";

import { prisma } from "~/db.server";

installGlobals();

async function deleteUser(id: string) {
  if (!id) {
    throw new Error("id required for login");
  }
  if (!id.endsWith("@example.com")) {
    throw new Error("All test ids must end in @example.com");
  }

  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.log("User not found, so no need to delete");
    } else {
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser(process.argv[2]);
