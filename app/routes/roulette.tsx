import { useWindowSize } from "@react-hook/window-size";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import ReactConfetti from "react-confetti";

import { ScaleFadein } from "~/components/ScaleFadein";
import { Wheel } from "~/components/Wheel";
import * as User from "~/models/user.server";
import { shuffle } from "~/utils";

const rouletteColors = [
  "moccasin",
  "orange",
  "paleturquoise",
  "pink",
  "skyblue",
  "lightgreen",
];

const sampleData = [
  {
    option: "佐藤太郎",
    style: { backgroundColor: "moccasin", textColor: "black" },
  },
  {
    option: "鈴木由美",
    style: { backgroundColor: "orange", textColor: "black" },
  },
  {
    option: "斎藤雄一",
    style: { backgroundColor: "paleturquoise", textColor: "black" },
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const isWinnerOnly = url.searchParams.get("filter") === "winner";

  const users = await (isWinnerOnly
    ? User.getWinnerUsers()
    : User.getAllUsers());

  const data = users.length
    ? users.map((user, i) => {
        return {
          option: user.username + " 様",
          style: {
            backgroundColor: rouletteColors[i % rouletteColors.length],
            textColor: "black",
          },
        };
      })
    : sampleData;

  return json({ data: shuffle(data), prizeNumber: 0 });
};

export default function Result() {
  const { data, prizeNumber } = useLoaderData<typeof loader>();
  const [mustSpin, setMustSpin] = React.useState(false);

  const [winner, setWinner] = React.useState("");

  const [width, height] = useWindowSize();

  const handleSpinClick = () => setMustSpin(true);

  const onStopSpinning = () => {
    setMustSpin(false);
    setWinner(data[prizeNumber].option);
  };

  return (
    <main className="relative h-screen">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {winner == "" ? null : <ReactConfetti width={width} height={height} />}
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="congratulation.png"
            alt="Sunset beach"
          />
        </div>
        <div className="relative px-4 pb-8 pt-16">
          <div className="flex flex-col items-center justify-center">
            <hr className="w-1/2 border-gray-800 border-2 rounded-full mb-8" />
            <h1 className="text-4xl font-bold text-gray-800">抽選発表</h1>
            <hr className="w-1/2 border-gray-800 border-2 rounded-full mt-8" />
            <div className="mt-12 space-y-16">
              <div className="flex flex-row items-center justify-center gap-4">
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={data}
                  onStopSpinning={onStopSpinning}
                  fontSize={12}
                  fontWeight={300}
                  innerBorderWidth={1}
                  radiusLineWidth={1}
                  outerBorderWidth={1}
                />
              </div>
            </div>
            <div className="mt-12 space-y-16">
              {winner == "" ? (
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={handleSpinClick}
                >
                  スピン
                </button>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                  <ScaleFadein>
                    <h1 className="text-8xl font-bold text-gray-800">
                      {winner}
                    </h1>
                  </ScaleFadein>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
