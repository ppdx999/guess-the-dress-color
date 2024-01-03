import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { verifyLogin } from "~/models/user.server";
import { createUserSession } from "~/session.server";
import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "guess the dress colour" }];

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const password = formData.get("password");

  if (typeof id !== "string" || id.length === 0) {
    return json(
      { errors: { id: "Id is required", password: null } },
      { status: 400 },
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { id: null, password: "Password is required" } },
      { status: 400 },
    );
  }

  const user = await verifyLogin(id, password);

  if (!user) {
    return json(
      { errors: { id: "Invalid id or password", password: null } },
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

export default function Index() {
  const user = useOptionalUser();

  const actionData = useActionData<typeof action>();
  const idRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.id) {
      idRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

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
            {user ? (
              <div className="space-y-6 mx-auto">
                <Link
                  to="/choose"
                  className="flex items-center justify-center w-64 rounded-2xl px-4 py-3 text-white bg-gradient-to-r from-indigo-500 to-purple-700"
                >
                  START
                </Link>
                <Form method="post" action="/logout" className="space-y-6">
                  <button
                    type="submit"
                    className="flex items-center justify-center w-64 rounded-2xl px-4 py-3 text-white bg-gradient-to-r from-indigo-500 to-purple-700"
                  >
                    LOGOUT
                  </button>
                </Form>
              </div>
            ) : (
              <div className="space-y-4 mx-auto">
                <Form method="post" className="space-y-6">
                  <div className="space-y-4 mx-auto">
                    <input
                      ref={idRef}
                      id="id"
                      required
                      // eslint-disable-next-line jsx-a11y/no-autofocus
                      autoFocus={true}
                      name="id"
                      type="id"
                      autoComplete="username"
                      placeholder="id"
                      aria-invalid={actionData?.errors?.id ? true : undefined}
                      aria-describedby="id-error"
                      className="flex items-center justify-center w-64 rounded-lg px-4 py-3 text-white bg-gray-700 bg-opacity-80 backdrop-filter backdrop-blur-sm"
                    />
                    <input
                      ref={passwordRef}
                      id="password"
                      required
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="password"
                      aria-invalid={
                        actionData?.errors?.password ? true : undefined
                      }
                      aria-describedby="password-error"
                      className="flex items-center justify-center w-64 rounded-lg px-4 py-3 text-white bg-gray-700 bg-opacity-80 backdrop-filter backdrop-blur-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center w-64 rounded-2xl px-4 py-3 text-white bg-gradient-to-r from-indigo-500 to-purple-700"
                  >
                    START
                  </button>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
