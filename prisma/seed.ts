import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const id = "testuser";

  // cleanup the existing database
  await prisma.user.delete({ where: { id } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("password", 10);

  const user = await prisma.user.upsert({
		where: { id },
    create: {
      id,
			username: "鈴木一郎",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
		update: {
			username: "鈴木一郎",
		}
  });

	await prisma.user.upsert({
		where: { id: "testuser2" },
		create: {
			id: "testuser2",
			username: "佐藤二郎",
			password: {
				create: {
					hash: hashedPassword,
				},
			},
		},
		update: {
			username: "佐藤二郎",
		}
	});

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
