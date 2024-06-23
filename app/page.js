"use client";
import Image from "next/image";
import { useEffect } from "react";

import { HomeBentoGrid } from "../components/HomeBentoGrid";
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
      const mp = member.memberOfParliament;
      if (mpCount[mp]) {
        mpCount[mp]++;
      } else {
        mpCount[mp] = 1;
      }
    });

    for (const mp in mpCount) {
      if (mpCount[mp] > 1) {
        duplicates.push({ memberOfParliament: mp, count: mpCount[mp] });
      }
    }

    return duplicates;
  }

  return (
    <main className='flex relative  min-h-screen h-screen flex-col items-center justify-between p-24 bg-white'>
      <h1>MPS who Voted Yes</h1>
      {/* <div className='flex flex-row gap-5 flex-wrap'></div> */}
      <HomeBentoGrid />
      <div className='flex flex-row gap-5 flex-wrap'>
        {MpsData?.length &&
          MpsData.map((member, index) => (
            <>
              <div key={index} className='flex flex-col items-center'>
                <Image
                  src={member.imageURL}
                  alt={member.memberOfParliament}
                  width={100}
                  height={100}
                />
                <p>{member.memberOfParliament}</p>
              </div>
            </>
          ))}
      </div>
    </main>
  );
}
