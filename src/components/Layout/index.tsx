import React from 'react';

import Navbar from '../Navbar/Navbar';

const Layout: React.FC = ({ children }) => {
  // useAuth(); // will implement later at end of tutorial

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;
