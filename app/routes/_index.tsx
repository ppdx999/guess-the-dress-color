import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { requireUser } from "~/session.server";

export const meta: MetaFunction = () => [{ title: "guess the dress colour" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // ログインしていなければログイン画面へ
  const user = await requireUser(request);

  return json({ user });
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

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
          <p className="text-2xl text-center mt-2 pb-6 text-indigo-700">
            {user.username}様
          </p>
          <div className="mx-auto mt-10 pt-24 flex justify-center">
            <div className="space-y-10 mx-auto">
              <Link
                to="/main"
                className="flex items-center justify-center w-64 rounded-2xl px-4 py-3 text-white bg-gradient-to-r from-indigo-500 to-purple-700"
              >
                ペンライト画面へGo！
              </Link>
              <Form method="post" action="/logout" className="space-y-6">
                <button
                  type="submit"
                  className="flex items-center justify-center w-64 rounded-2xl px-4 py-3 text-white bg-gray-700"
                >
                  はじめから
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
