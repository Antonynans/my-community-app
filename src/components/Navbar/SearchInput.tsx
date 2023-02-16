import type { User } from 'firebase/auth';
import React from 'react';
import { BsSearch } from 'react-icons/bs';

type SearchInputProps = {
  user?: User | null;
};

const SearchInput: React.FC<SearchInputProps> = () => {
  return (
    <div className="relative flex max-w-[600px] grow items-center">
      <BsSearch className="absolute left-2 text-gray-300" />
      <input
        type="text"
        placeholder="Search Reddit"
        className="h-8 w-full rounded-md border border-solid border-gray-200 bg-[#f7fafc] pl-8 text-xs hover:border-blue-500 hover:bg-[#ffffff] focus:border focus:border-blue-500 outline-none "
      />
    </div>
  );
};

export default SearchInput;
