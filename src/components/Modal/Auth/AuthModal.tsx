import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Modal from 'react-modal';
import { useRecoilState } from 'recoil';

import { authModalState } from '@/atoms/AuthModalAtom';
import { auth } from '@/Firebase/clientApp';

import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';
import ResetPassword from './ResetPassword';

const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [user, loading, error] = useAuthState(auth);

  const handleClose = () =>
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  return (
    <>
      <Modal
        style={{
          overlay: {
            position: 'fixed',
            top: '0%',
            left: '0%',
            right: '0%',
            bottom: '0%',
            backgroundColor: 'rgba(119, 119, 119, 0.589)',
            zIndex: 50,
          },
        }}
        className="absolute inset-x-0 z-50 mt-16 flex h-screen flex-col justify-between overflow-auto border-0 bg-[#FFFDFD] pb-40 shadow-[5px_5px_30px_0px_#00000040] outline-none lg:inset-x-[35%] lg:mt-[20vh] lg:h-auto lg:rounded-[10px] lg:pb-[2%]"
        isOpen={modalState.open}
        shouldCloseOnOverlayclick={true}
        onRequestClose={handleClose}
        ariaHideApp={false}
      >
        <>
          <div>
            <h2>
              {modalState.view === 'login' && 'Login'}{' '}
              {modalState.view === 'signup' && 'Signup'}
              {modalState.view === 'resetPassword' && 'Reset Password'}
            </h2>
          </div>

          {modalState.view === 'login' || modalState.view === 'signup' ? (
            <>
              <OAuthButtons />
              <p className="text-center">OR</p>
              <AuthInputs />
            </>
          ) : (
            <ResetPassword />
          )}
        </>
      </Modal>
    </>
  );
};

export default AuthModal;
