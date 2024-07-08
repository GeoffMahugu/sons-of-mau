"use client";
import Image from "next/image";
import { useEffect } from "react";

import { HomeBentoGrid } from "../components/HomeBentoGrid";
import { MpBentoCard } from "../components/ui/bento-grid";
import MpsData from "/public/data/mps.json";

import { Button } from "@/components/ui/button";

export default function Home() {
  // console.log("MpsData ---------------------------------//");
  // console.log(MpsData);

  useEffect(() => {
    if (!MpsData.length) return;
    console.log("MpsData ---------------------------------//");
    console.log(MpsData);

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
      const mp = member.name;
      if (mpCount[mp]) {
        mpCount[mp]++;
      } else {
        mpCount[mp] = 1;
      }
    });

    for (const mp in mpCount) {
      if (mpCount[mp] > 1) {
        duplicates.push({ name: mp, count: mpCount[mp] });
      }
    }

    return duplicates;
  }

  return (
    <main className='flex relative  min-h-screen h-screen flex-col items-center justify-between p-24 bg-white'>
      {/* <div className='flex flex-row gap-5 flex-wrap'></div> */}
      <HomeBentoGrid />

      <div className='flex flex-col my-48 gap-10 p-5 items-center'>
        <div className='flex flex-col gap-5 w-full'>
          <h1 className='text-6xl font-bold'>Search MP</h1>
          <p className='text-2xl'>
            Use the search to find infomation about your Member of parliament.
          </p>
        </div>
        <div className='flex flex-row gap-5 w-full'>
          <Button className='bg-red-500  hover:bg-red-700 hover:border-2 hover:border-red-900'>
            Voted Yes
          </Button>
          <Button className='bg-green-500 hover:bg-green-700 hover:border-2 hover:border-green-900'>
            Voted No
          </Button>
          <Button className='bg-slate-100 text-black hover:bg-white hover:border-black hover:border-2'>
            Absent
          </Button>
        </div>

        <div className='flex flex-row gap-5 flex-wrap mx-auto'>
          {MpsData?.length &&
            MpsData.map((member, index) => (
              <>
                <div key={index} className='flex flex-col items-center'>
                  <MpBentoCard
                    className={"w-[250px] p-2 border border-slate-100 "}
                    title={member.name}
                    description={`Party ${member.party}, ${member.constituency} constituency`}
                    header={
                      <Image
                        src={member.imageURL}
                        alt={member.name}
                        width={100}
                        height={100}
                        className='w-full h-[200px] rounded-lg'
                      />
                    }
                  />
                </div>
              </>
            ))}
        </div>
      </div>
    </main>
  );
}
