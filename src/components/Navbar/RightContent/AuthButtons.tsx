import React from 'react';
import { useSetRecoilState } from 'recoil';

import { authModalState } from '@/atoms/AuthModalAtom';

const AuthButtons = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  return (
    <>
      <button
        className="mr-[.5rem] flex h-7 w-28 items-center justify-center rounded-full border border-solid border-blue-500 bg-white px-4 py-1 text-sm hover:bg-[#edf2f7]"
        onClick={() => setAuthModalState({ open: true, view: 'login' })}
      >
        Log In
      </button>
      <button
        className="mr-[.5rem] flex h-7 w-28 items-center justify-center rounded-full border border-solid bg-blue-500 px-4 py-1 text-sm text-white hover:bg-[#4299e1]"
        onClick={() => setAuthModalState({ open: true, view: 'signup' })}
      >
        Sign Up
      </button>
    </>
  );
};

export default AuthButtons;
