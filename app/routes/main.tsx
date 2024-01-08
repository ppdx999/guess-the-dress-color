import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useWakeLock } from "react-screen-wake-lock";

import * as Choice from "~/models/choice.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const choice = await Choice.getByUserId(userId);

  if (!choice) {
    return redirect("/choose");
  }

  return json({ choice });
};

export default function MainPage() {
  const { choice } = useLoaderData<typeof loader>();
  const { request, released } = useWakeLock();

  return (
    <main className="relative h-screen">
      <div className="mx-auto h-screen flex justify-center items-center">
        <div className={`absolute inset-0 ${choice.color}`} />
        {released != false ? (
          <button
            className="absolute bottom-0 m-4 p-4 bg-gray-200 rounded-full"
            onClick={() => {
              request();
            }}
          >
            スリープをOFFにする
          </button>
        ) : null}
      </div>
    </main>
  );
}
