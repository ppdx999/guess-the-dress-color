import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import * as z from "zod";

import * as Choice from "~/models/choice.server";
import { requireUserId } from "~/session.server";

const dressChooseValidator = withZod(
  z.object({
    dress: z
      .string()
      .transform((v) => parseInt(v, 10))
      .pipe(Choice.dressSchema),
  }),
);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const choice = await Choice.getByUserId(userId);
  return json({ dress: choice?.dress });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const { error, data } = await request
    .formData()
    .then(dressChooseValidator.validate);

  if (error) return validationError(error);

  await Choice.upsert(userId, data.dress);

  return redirect("/main");
};

const DressInput = ({
  i,
  title,
  defaultChecked,
}: {
  i: number;
  title: string;
  defaultChecked: boolean;
}) => {
  return (
    <label className="flex flex-col items-center space-y-2">
      <p>{title}</p>
      <input
        id="dress-input"
        type="radio"
        name="dress"
        value={i}
        className="absolute opacity-0 w-0 h-0 peer"
        defaultChecked={defaultChecked}
      />
      <img
        src={`tuxedo-and-dress-${i}.png`}
        alt={`tuxedo and dress ${i}`}
        className="w-36 pl-4 p-3 cursor-pointer rounded-lg ring-1 border-dashed peer-checked:ring-4 peer-checked:ring-indigo-500 peer-checked:ring-opacity-50 peer-checked:ring-offset-2 peer-checked:ring-offset-gray-200"
      />
    </label>
  );
};

export default function ChosePage() {
  const { dress } = useLoaderData<typeof loader>();

  return (
    <main className="relative h-screen">
      <div className="mx-auto h-screen flex justify-center items-center">
        <div className="absolute inset-0 bg-gray-200" />
        <Form method="post">
          <div className="relative px-4 flex flex-col items-center space-y-16">
            <h1 className="text-2xl text-center font-bold">
              Choose the dress color
            </h1>
            <div className="mx-auto flex justify-center">
              <div className="space-y-4 mx-auto">
                <div className="flex justify-center space-x-8">
                  <DressInput
                    i={0}
                    defaultChecked={dress === 0}
                    title={"brown & red"}
                  />
                  <DressInput
                    i={1}
                    defaultChecked={dress === 1}
                    title={"navy & green"}
                  />
                </div>
                <div className="flex justify-center">
                  <DressInput
                    i={2}
                    defaultChecked={dress === 2}
                    title={"black & blue"}
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center w-64 rounded-2xl px-4 py-3 text-white bg-gradient-to-r from-indigo-500 to-purple-700"
            >
              ペンライト画面にGO!
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}
