import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

import { PhoneCall } from "lucide-react";

const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};
const BentoGridItem = ({ className, title, description, header }) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
    >
      {header}
      <div className='group-hover/bento:translate-x-2 transition duration-200'>
        <div className='font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2'>
          {title}
        </div>
        <div className='font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300'>
          {description}
        </div>
      </div>
    </div>
  );
};
const MpBentoCard = ({ className, title, description, header }) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
    >
      {header}
      <div className='group-hover/bento:translate-x-2 transition duration-200'>
        <div className='font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2'>
          {title}
        </div>
        <div className='font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300'>
          {description}
        </div>
        <div className='flex flex-row items-center justify-between w-full mt-4'>
          <div className='flex flex-row items-center h-max'>
            <span className='text-xs text-slate-700'> Voted</span>{" "}
            <bold className='text-red-500 font-bold'>&nbsp;Yes</bold>
          </div>

          <Button variant='outline' className='p-2 mr-2 hover:bg-green-200'>
            <PhoneCall className='mr-2 h-4 w-4' /> Call
          </Button>
        </div>
      </div>
    </div>
  );
};

export { BentoGridItem, BentoGrid, MpBentoCard };
