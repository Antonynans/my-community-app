import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';

import type { ModalView } from '@/atoms/AuthModalAtom';
import { authModalState } from '@/atoms/AuthModalAtom';

import Login from './Login';
import SignUp from './Signup';

type AuthInputsProps = {
  toggleView: (view: ModalView) => void;
};

const AuthInputs: React.FC<AuthInputsProps> = ({ toggleView }) => {
  const modalState = useRecoilValue(authModalState);

  return (
    <Flex direction="column" alignItems="center" width="100%" mt={4}>
      {modalState.view === 'login' ? (
        <Login toggleView={toggleView} />
      ) : (
        <SignUp toggleView={toggleView} />
      )}
    </Flex>
  );
};

export default AuthInputs;
