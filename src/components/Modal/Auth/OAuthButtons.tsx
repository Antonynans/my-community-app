import type { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';

import { auth, firestore } from '@/Firebase/clientApp';

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);

  return (
    <div className="flex items-center justify-center">
      <button
        className="flex"
        onClick={() => signInWithGoogle()}
        // isloading={loading}
      >
        {/* {!loading ? ( */}
        <Image
          src="/images/googlelogo.png"
          alt="google logo"
          height={20}
          width={20}
          className="mr-4"
        />
        Continue with Google
      </button>
      {error && (
        <p className="mt-2 flex items-center text-red-500">{error.message}</p>
      )}
    </div>
  );
};

export default OAuthButtons;
