import React from 'react';
import { useRecoilValue } from 'recoil';

import { authModalState } from '@/atoms/AuthModalAtom';

import Login from './Login';
import Signup from './Signup';

type AuthInputsProps = {};

const AuthInputs: React.FC<AuthInputsProps> = () => {
  const modalState = useRecoilValue(authModalState);

  return (
    <div className="mt-4 flex w-full items-center">
      {modalState.view === 'login' && <Login />}
      {modalState.view === 'signup' && <Signup />}
    </div>
  );
};

export default AuthInputs;
