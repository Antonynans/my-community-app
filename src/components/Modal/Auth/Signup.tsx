import type { User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';

import { authModalState } from '@/atoms/AuthModalAtom';
import { auth, firestore } from '@/Firebase/clientApp';
import { FIREBASE_ERRORS } from '@/Firebase/errors';

const Signup = () => {
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const setAuthModalState = useSetRecoilState(authModalState);

  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) setError('');
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Password do not match');
      return;
    }
    createUserWithEmailAndPassword(signupForm.email, signupForm.password);
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm({ ...signupForm, [event.target.name]: event.target.value });
  };

  const createUserDocument = async (user: User) => {
    await addDoc(
      collection(firestore, 'users'),
      JSON.parse(JSON.stringify(user))
    );
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);

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
      <input
        name="confirmPassword"
        placeholder="confirm password"
        type="password"
        className="mb-2"
        onChange={onChange}
        required
      />
      <p>
        {error ||
          FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
      </p>
      <button type="submit" className="rounded-full bg-blue-500 text-white">
        {!loading ? 'Sign Up' : loading}
      </button>
      <div className="">
        <p>Already a redditor</p>
        <p
          className=""
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: 'login',
            }))
          }
        >
          LOG IN
        </p>
      </div>
    </form>
  );
};

export default Signup;
