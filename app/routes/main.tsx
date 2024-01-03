import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getChoiceByUserId } from "~/models/choice.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const choice = await getChoiceByUserId(userId);

  if (!choice) {
    return redirect("/choose");
  }

  return json({ choice });
};

export default function MainPage() {
  const { choice } = useLoaderData<typeof loader>();

  return (
    <main className="relative h-screen">
      <div className="mx-auto h-screen flex justify-center items-center">
        <div className={`absolute inset-0 ${choice.dressColorCode}`} />
      </div>
    </main>
  );
}
