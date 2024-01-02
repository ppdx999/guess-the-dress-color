import React from "react";

import { Wheel } from "~/components/Wheel";

const data = [
  { option: '0', style: { backgroundColor: 'green', textColor: 'black' } },
  { option: '1', style: { backgroundColor: 'white' } },
  { option: '2' },
]

export default function Result() {
	const [mustSpin, setMustSpin] = React.useState(false);
	const [prizeNumber, setPrizeNumber] = React.useState(0);

	const handleSpinClick = () => {
		const newSegment = Math.floor(Math.random() * data.length);
		const newPrizeNumber = newSegment === 0 ? data.length - 1 : newSegment - 1;

		setPrizeNumber(newPrizeNumber);
		setMustSpin(true);
	}

	return (
		<main className="relative h-screen">
			<div className="absolute inset-0 flex flex-col items-center justify-center">
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
						<div className="mt-24 space-y-16">
							<div className="flex flex-row items-center justify-center gap-4">
								<Wheel
									mustStartSpinning={mustSpin}
									prizeNumber={prizeNumber}
									data={data}
									onStopSpinning={() => setMustSpin(false)}
								/>
							</div>
						</div>
						<div className="mt-24 space-y-16">
							<button
								className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
								onClick={handleSpinClick}
							>
								スピン
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
