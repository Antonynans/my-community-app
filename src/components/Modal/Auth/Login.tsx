import React, { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';

import type { ModalView } from '@/atoms/AuthModalAtom';
import { authModalState } from '@/atoms/AuthModalAtom';
import { auth } from '@/Firebase/clientApp';
import { FIREBASE_ERRORS } from '@/Firebase/errors';

type LoginProps = {
  // toggleView: (view: ModalView) => void;
};

const Login: React.FC<LoginProps> = () => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const setAuthModalState = useSetRecoilState(authModalState);
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <input
        name="email"
        placeholder="email"
        type="email"
        className="mb-2"
        onChange={onChange}
        required
      />
      <input
        name="password"
        placeholder="password"
        type="password"
        className="mb-2"
        onChange={onChange}
        required
      />
      <p className="">
        {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
      </p>
      <button type="submit" className="rounded-full bg-blue-500 text-white">
        Log In
      </button>
      <div className="mb-2 flex justify-center">
        <p className="mr-1">Forgot your password?</p>
        <p
          className="cursor-pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: 'resetPassword',
            }))
          }
        >
          Reset
        </p>
      </div>
      <div className="">
        <p>New here</p>
        <p
          className=""
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
    </form>
  );
};

export default Login;
