import type { User } from 'firebase/auth';
import React from 'react';

import AuthModal from '@/components/Modal/Auth/AuthModal';

import AuthButtons from './AuthButtons';
import Icons from './Icons';
import UserMenu from './UserMenu';

type RightContentProps = {
  user?: User | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <div className="flex items-center justify-center bg-transparent">
        {user ? <Icons /> : <AuthButtons />}
        <UserMenu user={user} />
      </div>
    </>
  );
};

export default RightContent;
