import React, { useState } from 'react';
import { GrAdd } from 'react-icons/gr';

import CreateCommunityModal from '@/components/Modal/CreateCommunity/CreateCommunityModal';

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CreateCommunityModal isOpen={open} handleClose={() => setOpen(false)} />
      <div
        className="mr-2 flex items-center px-2"
        onClick={() => setOpen(true)}
      >
        <GrAdd className="mr-1 " />
        Create Community
      </div>
    </>
  );
};

export default Communities;
