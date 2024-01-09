import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import * as User from "~/models/user.server";
import { createUserSession } from "~/session.server";
import { useOptionalUser } from "~/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id");

  if (typeof id !== "string" || id.length === 0) {
    return json(
      { errors: { id: "Id is required", password: null } },
      { status: 400 },
    );
  }

  const user = await User.getUserById(id);

  if (!user) {
    return json(
      { errors: { id: "Id not found", password: null } },
      { status: 400 },
    );
  }

  return createUserSession({
    redirectTo: "/choose",
    remember: true,
    request,
    userId: user.id,
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const guestType = url.searchParams.get("guest-type");

  if (guestType == null) {
    return json({ users: [] });
  }

  const users = await User.getUsersByGuest(User.toGuestType(guestType));

  return json({ users });
};

export default function Index() {
  const user = useOptionalUser();
  const { users } = useLoaderData<typeof loader>();

  return (
    <main className="relative min-h-screen bg-white">
      <div className="mx-auto max-w-7xl min-h-screen flex justify-center items-center">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="sunset-beach.png"
            alt="Sunset beach"
          />
        </div>
        <div className="relative px-4 pb-8 pt-16">
          <img
            className="mx-auto h-12 w-auto"
            src="app-title.svg"
            alt="guess the dress color"
          />
          <div className="mx-auto mt-10 pt-24 flex justify-center">
            <div className="space-y-4 mx-auto">
              {users.length == 0 ? (
                <div className="flex flex-col items-center justify-center gap-8">
                  <a
                    className="flex items-center justify-center w-64 rounded-lg px-4 py-3 text-white bg-gradient-to-t from-indigo-500 to-purple-500"
                    href={`/login?guest-type=groom`}
                  >
                    新郎ゲスト
                  </a>
                  <a
                    className="flex items-center justify-center w-64 rounded-lg px-4 py-3 text-white bg-gradient-to-r from-purple-500 to-fuchsia-500"
                    href={`/login?guest-type=bride`}
                  >
                    新婦ゲスト
                  </a>
                </div>
              ) : (
                <Form method="post" className="space-y-6">
                  <div className="space-y-4 mx-auto">
                    <select
                      name="id"
                      required
                      className="flex items-center justify-center w-64 rounded-lg px-4 py-3 text-white bg-gray-700 bg-opacity-80 backdrop-filter backdrop-blur-sm"
                      defaultValue={user?.id}
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center w-64 rounded-2xl px-4 py-3 text-white bg-gradient-to-r from-indigo-500 to-purple-700"
                  >
                    START
                  </button>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
