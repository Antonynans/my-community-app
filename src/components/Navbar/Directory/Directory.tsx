import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Menu, MenuButton, MenuList } from '@chakra-ui/react';
import React from 'react';

import Communities from './Communities';
import { TiHome } from 'react-icons/ti';

const Directory: React.FC = () => {
  return (
    <Menu>
      <>
        <MenuButton
          cursor="pointer"
          padding="0px 6px"
          borderRadius="4px"
          _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
          mr={2}
          ml={{ base: 0, md: 2 }}
          // onClick={toggleMenuOpen}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            width={{ base: 'auto', lg: '200px' }}
          >
            <TiHome />
            Home
            <ChevronDownIcon color="gray.500" />
          </Flex>
        </MenuButton>
        <MenuList maxHeight="300px" overflow="scroll" overflowX="hidden">
          <Communities />
        </MenuList>
      </>
    </Menu>
  );
};

export default Directory;
