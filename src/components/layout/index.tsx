import React from "react";

type propType = {
  children: React.ReactNode;
};

const Layout = (props: propType) => {
  const { children } = props;
  return (
    <>
      {children}
    </>
  );
};

export default Layout;
