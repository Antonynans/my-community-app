import { Menu, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

import classNames from '@/utils/classNames';

type MenuComponentProps = {
  menuDropDown: any;
  children: any;
};

const MenuComponent: React.FC<MenuComponentProps> = ({
  menuDropDown,
  children,
}) => {
  const MenuItems = () => {
    return (
      <Menu.Item>
        {({ active }) => (
          <button
            className={classNames(
              active ? 'bg-blue-500 text-white' : 'text-gray-700',
              'px-4 py-2 text-sm flex items-center w-full'
            )}
          >
            {children}
          </button>
        )}
      </Menu.Item>
    );
  };

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="relative flex h-8 w-8 cursor-pointer items-center rounded-full shadow-sm hover:bg-gray-50 focus:outline-none">
            {menuDropDown}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <MenuItems>{children}</MenuItems>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default MenuComponent;
