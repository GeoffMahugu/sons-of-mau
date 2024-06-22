import Image from "next/image";

import MpsData from "data/MpsData";

export default function Home() {
  console.log("MpsData ---------------------------------//");
  console.log(MpsData);
  return (
    <main className='flex relative  min-h-screen h-screen flex-col items-center justify-between p-24 bg-white'>
      {/* <div
        id='landing-section'
        className='flex flex-col items-center h-inherit p-10 '
      >
        <h1 className='text-8xl'>The Revolution starts here !</h1>
      </div> */}
      <div
        id='landing-section'
        className='flex flex-col items-center h-screen p-10 '
      >
        <h1 className='text-8xl'>The Revolution starts here !</h1>
      </div>

      <div className='flex flex-col min-h-screen py-80 gap-5'>
        <div className='flex flex-col'>
          <h1>
            MPs who Voted <bold>YES</bold>{" "}
          </h1>
        </div>
        <div className='flex flex-col min-h-screen py-80 gap-5'></div>
      </div>
    </main>
  );
}
