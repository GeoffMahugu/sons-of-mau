"use client";
import Image from "next/image";
import { useEffect } from "react";

import MpsData from "/public/data/mps.json";

export default function Home() {
  // console.log("MpsData ---------------------------------//");
  // console.log(MpsData);

  useEffect(() => {
    if (!MpsData.length) return;
    // console.log("MpsData ---------------------------------//");
    // console.log(MpsData);

    // Find and log repeating MPs
    const repeatingMPs = findRepeatingMPs(MpsData);
    if (repeatingMPs.length > 0) {
      console.log("Repeating Members of Parliament:", repeatingMPs);
    } else {
      console.log("No repeating Members of Parliament found.");
    }
  }, [MpsData]);

  // Function to find repeating instances
  function findRepeatingMPs(members) {
    const mpCount = {};
    const duplicates = [];

    members.forEach((member) => {
      const mp = member.MemberOfParliament;
      if (mpCount[mp]) {
        mpCount[mp]++;
      } else {
        mpCount[mp] = 1;
      }
    });

    for (const mp in mpCount) {
      if (mpCount[mp] > 1) {
        duplicates.push({ MemberOfParliament: mp, count: mpCount[mp] });
      }
    }

    return duplicates;
  }

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
