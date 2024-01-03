import {useWindowSize} from "@react-hook/window-size";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import ReactConfetti from "react-confetti";

import { ScaleFadein } from "~/components/ScaleFadein";
import { Wheel } from "~/components/Wheel";
import { getUsersWithChoice } from "~/models/user.server";

const rouletteColors = [
	'moccasin',
	'orange',
	'paleturquoise',
	'pink',
	'skyblue',
	'lightgreen',
];

export const loader = async () => {
	const users = await getUsersWithChoice();

	const data = users.map((user, i) => {
		return {
			option: user.username + ' 様',
			style: { backgroundColor: rouletteColors[i % rouletteColors.length], textColor: 'black' },
		};
	});

	return json({data});
};

export default function Result() {
	const { data } = useLoaderData<typeof loader>();
	const [mustSpin, setMustSpin] = React.useState(false);
	const [prizeNumber, setPrizeNumber] = React.useState(0);

	const [winner, setWinner] = React.useState('');

	const [width, height] = useWindowSize();

	const handleSpinClick = () => {
		const newSegment = Math.floor(Math.random() * data.length);
		const newPrizeNumber = newSegment === 0 ? data.length - 1 : newSegment - 1;

		setPrizeNumber(newPrizeNumber);
		setMustSpin(true);
	}

	const onStopSpinning = () => {
		setMustSpin(false);
		setWinner(data[prizeNumber].option);
	}

	return (
		<main className="relative h-screen">
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				{
					winner == '' ? null : (
					<ReactConfetti width={width} height={height} />
				)}
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src='congratulation.png'
            alt="Sunset beach"
          />
        </div>
        <div className="relative px-4 pb-8 pt-16">
					<div className="flex flex-col items-center justify-center">
						<hr className="w-1/2 border-gray-800 border-2 rounded-full mb-8" />
							<h1 className="text-4xl font-bold text-gray-800">
								抽選発表
							</h1>
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
						{ winner == ''  ? (
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
