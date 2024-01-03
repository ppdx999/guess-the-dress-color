import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { chooseDress, assertDressColor } from "~/models/choice.server";
import { getChoiceByUserId } from "~/models/choice.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const choice = await getChoiceByUserId(userId);
  return json({ choice });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const chosenColor = formData.get("dress");

  assertDressColor(chosenColor);
  await chooseDress(userId, chosenColor);

  return redirect("/main");
};

export default function ChosePage() {
  const { choice } = useLoaderData<typeof loader>();

  return (
    <main className="relative h-screen">
      <div className="mx-auto h-screen flex justify-center items-center">
        <div className="absolute inset-0 bg-gray-200" />
        <Form method="post">
          <div className="relative px-4 flex flex-col items-center space-y-16">
            <h1 className="text-lg text-center font-bold">
              Choose the dress color
            </h1>
            <div className="mx-auto flex justify-center">
              <div className="space-y-4 mx-auto">
                <div className="flex justify-center space-x-8">
                  <label>
                    <input
                      type="radio"
                      name="dress"
                      value="red"
                      defaultChecked={choice?.dressColor === "red"}
                    />
                    <img src="red-dress.svg" alt="Red dress" className="w-32" />
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="dress"
                      value="blue"
                      defaultChecked={choice?.dressColor === "blue"}
                    />
                    <img
                      src="blue-dress.svg"
                      alt="Blue dress"
                      className="w-32"
                    />
                  </label>
                </div>
                <div className="flex justify-center">
                  <label>
                    <input
                      type="radio"
                      name="dress"
                      value="yellow"
                      defaultChecked={choice?.dressColor === "yellow"}
                    />
                    <img
                      src="yellow-dress.svg"
                      alt="Yellow dress"
                      className="w-32"
                    />
                  </label>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center w-64 rounded-2xl px-4 py-3 text-white bg-gradient-to-r from-indigo-500 to-purple-700"
            >
              CHOOSE
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}
