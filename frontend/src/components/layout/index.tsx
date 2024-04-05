import React from "react";
import Header from "./Header";

type propType = {
  children: React.ReactNode;
};

const Layout = (props: propType) => {
  const { children } = props;
  return (
    <>
      {/* <Header /> */}
      {children}
    </>
  );
};

export default Layout;
