import Image from 'next/image';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '@/Firebase/clientApp';

import Directory from './Directory/Directory';
import RightContent from './RightContent/RightContent';
import SearchInput from './SearchInput';

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <div className="flex h-11 items-center justify-between bg-white px-3 py-[6px]">
      <div className="flex items-center mr-2">
        <Image
          src="/images/redditFace.svg"
          className="h-[30px]  w-[30px]"
          height={30}
          width={30}
          alt=""
        />
        <Image
          className="hidden h-12 w-auto lg:block"
          src="/images/redditText.svg"
          height={46}
          width={46}
          alt=""
          priority
        />
      </div>

      {!user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </div>
  );
};

export default Navbar;
