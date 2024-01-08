export default function Result() {
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
        <div className="relative px-4 pb-8 pt-16">
          <div className="flex flex-col items-center justify-center">
            <hr className="w-1/2 border-gray-800 border-2 rounded-full mb-8" />
            <h1 className="text-4xl font-bold text-gray-800">抽選発表</h1>
            <hr className="w-1/2 border-gray-800 border-2 rounded-full mt-8" />
            <div className="mt-24 space-y-16">
              <div className="flex flex-row items-center justify-center gap-4">
                <p className="text-4xl font-bold text-gray-800">1等賞</p>
                <p className="text-4xl font-bold text-gray-800">xxx xxx 様</p>
              </div>

              <div className="flex flex-row items-center justify-center gap-4">
                <p className="text-4xl font-bold text-gray-800">2等賞</p>
                <p className="text-4xl font-bold text-gray-800">xxx xxx 様</p>
              </div>

              <div className="flex flex-row items-center justify-center gap-4">
                <p className="text-4xl font-bold text-gray-800">3等賞</p>
                <p className="text-4xl font-bold text-gray-800">xxx xxx 様</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
