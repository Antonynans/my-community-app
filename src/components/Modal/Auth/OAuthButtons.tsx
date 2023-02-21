import { Button, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';

import { auth } from '@/Firebase/clientApp';

type OAuthButtonsProps = {};

const OAuthButtons: React.FC<OAuthButtonsProps> = () => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  return (
    <Flex direction="column" mb={4} width="100%">
      <Button
        variant="oauth"
        mb={2}
        onClick={() => signInWithGoogle()}
        isLoading={loading}
      >
        <Image src="/images/googlelogo.png" alt="" height="20px" mr={4} />
        Continue with Google
      </Button>
      {error && (
        <Text textAlign="center" fontSize="10pt" color="red" mt={2}>
          <>{error}</>
        </Text>
      )}
    </Flex>
  );
};
export default OAuthButtons;
