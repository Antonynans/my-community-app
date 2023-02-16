// import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import type { User } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import React from 'react';
import { CgProfile } from 'react-icons/cg';
import { FaRedditSquare } from 'react-icons/fa';
import { IoSparkles } from 'react-icons/io5';
import { MdOutlineLogin } from 'react-icons/md';
import { VscAccount } from 'react-icons/vsc';
import { useResetRecoilState, useSetRecoilState } from 'recoil';

import { authModalState } from '@/atoms/AuthModalAtom';
import { communityState } from '@/atoms/communitiesAtom';
import { auth } from '@/Firebase/clientApp';

type UserMenuProps = {
  user?: User | null;
  // setModalState: (value: AuthModalState) => void;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const resetCommunityState = useResetRecoilState(communityState);

  const logout = async () => {
    await signOut(auth);
    resetCommunityState();
  };

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius="4px"
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
      >
        <Flex align="center">
          <Flex align="center">
            {user ? (
              <>
                <Icon
                  fontSize={24}
                  mr={1}
                  colors="gray-300"
                  as={FaRedditSquare}
                />
                <Box
                  display={{ base: 'none', lg: 'flex' }}
                  flexDirection="column"
                  fontSize="8pt"
                  alignItems="flex-start"
                  mr={8}
                >
                  <Text fontWeight={700}>
                    {user?.displayName || user?.email?.split('@')[0]}
                  </Text>
                  <Flex alignItems="center">
                    <Icon as={IoSparkles} color="brand.100" mr={1} />
                    <Text color="gray.400">1 karma</Text>
                  </Flex>
                </Box>
              </>
            ) : (
              <Icon fontSize={24} mr={1} colors="gray-400" as={VscAccount} />
            )}
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem>
              <Flex align="center">
                <Icon as={CgProfile} />
                Profile
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{ bg: 'blue.500', color: 'white' }}
              onclick={logout}
            >
              <Flex align="center">
                <Icon as={MdOutlineLogin} />
                Log Out
              </Flex>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem>
              <Flex align="center">
                <Icon as={CgProfile} />
                Profile
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{ bg: 'blue.500', color: 'white' }}
              onClick={() => setAuthModalState({ open: true, view: 'login' })}
            >
              <Flex align="center">
                <Icon as={MdOutlineLogin} />
                Log In / Sign Up
              </Flex>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
