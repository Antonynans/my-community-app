import React, { useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { BsDot, BsReddit } from 'react-icons/bs';
import { useSetRecoilState } from 'recoil';

import type { ModalView } from '@/atoms/AuthModalAtom';
import { authModalState } from '@/atoms/AuthModalAtom';
import { auth } from '@/Firebase/clientApp';

type ResetPasswordProps = {
  // toggleView: (view: ModalView) => void;
};

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await sendPasswordResetEmail(email);
    setSuccess(true);
  };
  return (
    <div className="flex flex-col">
      <BsReddit />
      <p className="">Reset your password</p>
      {success ? (
        <p className="">Check your email :</p>
      ) : (
        <>
          <p className="text-center">
            Enter the email associated with your account and we will send you a
            reset link
          </p>
          <form onSubmit={onSubmit} style={{ width: '100%' }}>
            <input
              required
              name="email"
              placeholder="email"
              type="email"
              onChange={(event) => setEmail(event.target.value)}
            />
            <p className="text-center">{error?.message}</p>
            <button>{!sending ? 'Reset Password' : sending} </button>
          </form>
        </>
      )}
      <div className="flex cursor-pointer items-center">
        <p
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: 'login',
            }))
          }
        >
          LOGIN
        </p>
        <BsDot />
        <p
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: 'signup',
            }))
          }
        >
          SIGN UP
        </p>
      </div>
    </div>
  );
};
export default ResetPassword;
