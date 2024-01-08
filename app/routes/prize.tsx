import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

const imgs = ["prize-special.jpg", "prize-1.jpg", "prize-2.jpg", "prize-3.jpg"];

const titles = ["特別賞", "1等賞", "2等賞", "3等賞"];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const number = url.searchParams.get("n") || "3";

  return json({ src: imgs[parseInt(number)], title: titles[parseInt(number)] });
};

export default function Prize() {
  const { src, title } = useLoaderData<typeof loader>();

  return (
    <main className="relative h-screen">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="congratulation.png"
            alt="Sunset beach"
          />
        </div>
        <div className="z-10">
          <div className="flex flex-col items-center justify-center gap-8">
            <p className="text-6xl font-bold text-gray-800">{title}</p>
            <img src={src} alt="Sunset beach" />
          </div>
        </div>
      </div>
    </main>
  );
}
