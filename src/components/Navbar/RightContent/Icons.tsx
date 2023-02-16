import React from 'react';
import { BsArrowRightCircle, BsChatDots } from 'react-icons/bs';
import { GrAdd } from 'react-icons/gr';
import {
  IoFilterCircleOutline,
  IoNotificationsOutline,
  IoVideocamOutline,
} from 'react-icons/io5';

const Icons = () => {
  return (
    <div className="flex items-center">
      <div className=" hidden items-center border-r border-solid border-[#E2E8F0] md:flex ">
        <div className="mx-1 cursor-pointer p-1">
          <BsArrowRightCircle className="text-xl" />
        </div>
        <div className="mx-1 cursor-pointer p-1">
          <IoFilterCircleOutline className="text-[22px]" />
        </div>
        <div className="mx-1 cursor-pointer p-1">
          <IoVideocamOutline className="text-[22px]" />
        </div>
      </div>
      <>
        <div className="mx-1 cursor-pointer p-1">
          <BsChatDots className="text-xl" />
        </div>
        <div className="mx-1 cursor-pointer p-1">
          <IoNotificationsOutline className="text-xl" />
        </div>
        <div className="mx-1 cursor-pointer p-1">
          <GrAdd className="text-xl" />
        </div>
      </>
    </div>
  );
};

export default Icons;
